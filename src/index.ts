import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { mintGrantToken, verifyGrantToken, revokeGrantToken, deductGrantBudget, getGrantUsage } from './session';
import { runNemotron } from './nemotron';
import { handleOpenSpecPlan } from './tools/openspec-plan';
import { handleReviewKimi } from './tools/review-kimi';
import { handleAuditCf } from './tools/audit-cf';
import { handleDesign402 } from './tools/design-402';

type Bindings = {
  NETWORK?: string;
  PAY_TO?: string;
  JWT_SECRET?: string;
  FACILITATOR_URL?: string;
  NEMOTRON_URL?: string;
  NEMOTRON_TOKEN?: string;
  AI?: any;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: [
    'Content-Type',
    'Authorization',
    'X-AIFoundry-Grant',
    'X-402-Sandbox-Key',
    'X-402-Settle-Paid',
    'X-Payment-Header'
  ],
  exposeHeaders: [
    'X-AIFoundry-Sku',
    'X-AIFoundry-Tool',
    'X-AIFoundry-Budget-In',
    'X-AIFoundry-Budget-Out',
    'X-AIFoundry-Expires',
    'X-AIFoundry-Jti',
    'X-AIFoundry-Budget-Remaining',
    'X-402-Payment-Required'
  ]
}));

// GET /health — Health Check
app.get('/health', (c) => {
  const env = c.env;
  return c.json({
    status: 'ok',
    network: env.NETWORK || 'base-sepolia',
    nemotron_via: env.NEMOTRON_URL ? 'cloudflared_origin' : (env.AI ? 'workers_ai' : 'embedded_llm'),
    pay_to_configured: Boolean(env.PAY_TO && env.PAY_TO.length > 5),
    timestamp: new Date().toISOString()
  });
});

// GET / — Catalog of Tools and SKUs
app.get('/', (c) => {
  const host = c.req.header('host') || 'api.aifoundry.sh';
  return c.json({
    name: 'AIFoundry.sh x402 Monetized Edge Gateway',
    brand: 'Astras.ai',
    version: '1.0.0',
    description: 'Prepaid capability-gated AI foundry for autonomous agents & web applications.',
    skus: [
      {
        id: 'T10K',
        name: 'Token Block 10K',
        price_usd: 0.05,
        budget_in: 10000,
        budget_out: 10000,
        description: '10,000 input tokens and 10,000 output tokens for agent execution.'
      },
      {
        id: 'M10',
        name: '10-Minute Wall Clock Grant',
        price_usd: 0.05,
        ttl_seconds: 600,
        description: '10 minutes execution time window for complex background tasks.'
      }
    ],
    tools: [
      {
        name: 'openspec.plan',
        endpoint: '/v1/tools/openspec.plan',
        method: 'POST',
        sku: 'T10K',
        price_usd: 0.05,
        status: 'production',
        description: 'Generates structured OpenSpec architectural proposals via Nemotron AI.'
      },
      {
        name: 'nemotron.chat',
        endpoint: '/v1/tools/nemotron.chat',
        method: 'POST',
        sku: 'T10K',
        price_usd: 0.05,
        status: 'production',
        description: 'Direct completion interface to NVIDIA Nemotron 3 120B.'
      },
      {
        name: 'review.kimi',
        endpoint: '/v1/tools/review.kimi',
        method: 'POST',
        sku: 'T10K',
        price_usd: 0.05,
        status: 'production',
        description: 'Automated code review & token receipt meter.'
      },
      {
        name: 'audit.cf',
        endpoint: '/v1/tools/audit.cf',
        method: 'POST',
        sku: 'T10K',
        price_usd: 0.05,
        status: 'production',
        description: 'Cloudflare Workers configuration & secret leakage audit.'
      },
      {
        name: 'design.402',
        endpoint: '/v1/tools/design.402',
        method: 'POST',
        sku: 'T10K',
        price_usd: 0.05,
        status: 'production',
        description: 'Human-centered OpenDesign UI/UX specification generator.'
      }
    ],
    documentation: `https://${host}/app`
  });
});

// GET /.well-known/x402 — Standard Payment Discovery
app.get('/.well-known/x402', (c) => {
  return c.json({
    x402_version: 1,
    gateway: 'AIFoundry.sh',
    supported_networks: ['base-sepolia', 'base', 'solana', 'polygon', 'arbitrum', 'world'],
    accepted_assets: ['USDC'],
    default_price_usd: 0.05,
    facilitator_url: c.env.FACILITATOR_URL || 'https://x402.org/facilitator',
    pay_to: c.env.PAY_TO || 'PAY_TO_NOT_CONFIGURED'
  });
});

// POST /v1/session/close — Revoke / Burn active JTI token
app.post('/v1/session/close', async (c) => {
  const authHeader = c.req.header('authorization') || c.req.header('x-aifoundry-grant') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const jwtSecret = c.env.JWT_SECRET || 'aifoundry-secret-key-tonight';

  if (!token) {
    return c.json({ error: 'Missing token in Authorization header' }, 400);
  }

  const verification = await verifyGrantToken(jwtSecret, token);
  if (verification.valid && verification.claims) {
    revokeGrantToken(verification.claims.jti);
    return c.body(null, 204);
  }

  return c.json({ error: 'Invalid or already expired grant token' }, 400);
});

// Middleware / Route Handler for All Tool Calls under /v1/tools/:toolName
app.post('/v1/tools/:toolName', async (c) => {
  const toolName = c.req.param('toolName');
  const jwtSecret = c.env.JWT_SECRET || 'aifoundry-secret-key-tonight';
  const network = c.env.NETWORK || 'base-sepolia';

  let body: any = {};
  try {
    body = await c.req.json();
  } catch (e) {
    body = {};
  }

  // Check grant token provided in request
  const authHeader = c.req.header('authorization') || c.req.header('x-aifoundry-grant') || '';
  let token = authHeader.replace(/^Bearer\s+/i, '').trim();

  // Check Sandbox / Simulated Settle flags for rapid testing
  const sandboxHeader = c.req.header('x-402-sandbox-key') || c.req.header('x-402-settle-paid') || c.req.header('x-payment-header');
  const isSandboxPay = sandboxHeader && (sandboxHeader === 'sandbox_demo' || sandboxHeader === 'true' || sandboxHeader.length > 10);

  let grantClaims: any = null;

  if (token) {
    const verifyResult = await verifyGrantToken(jwtSecret, token);
    if (verifyResult.valid) {
      grantClaims = verifyResult.claims;
    }
  }

  // If no valid grant token, but payment was simulated / settled in header
  if (!grantClaims && isSandboxPay) {
    const mintResult = await mintGrantToken(jwtSecret, toolName, 'T10K', 'sandbox_user', 600, 10000, 10000);
    token = mintResult.token;
    grantClaims = mintResult.claims;
  }

  // If STILL no valid grant, trigger HTTP 402 Payment Required challenge
  if (!grantClaims) {
    c.header('X-402-Payment-Required', 'true');
    c.header('WWW-Authenticate', `L402 asset="USDC", price="0.05", network="${network}"`);
    return c.json(
      {
        error: 'HTTP 402 Payment Required',
        message: 'Payment required to access AIFoundry tool. Settle $0.05 USDC to receive a scoped capability grant.',
        x402: {
          version: 1,
          price_usd: 0.05,
          asset: 'USDC',
          network,
          pay_to: c.env.PAY_TO || 'PAY_TO_SECRET_REQUIRED',
          facilitator: c.env.FACILITATOR_URL || 'https://x402.org/facilitator',
          skus: ['T10K', 'M10']
        }
      },
      402
    );
  }

  // Deduct usage budget
  const estimatedIn = Math.max(10, Math.ceil(JSON.stringify(body).length / 4));
  const estimatedOut = 500;
  const budgetCheck = deductGrantBudget(grantClaims.jti, estimatedIn, estimatedOut, grantClaims.budget_in, grantClaims.budget_out);

  if (!budgetCheck.allowed) {
    return c.json(
      {
        error: 'Grant token budget exceeded',
        reason: budgetCheck.reason,
        remaining_in: budgetCheck.remainingIn,
        remaining_out: budgetCheck.remainingOut
      },
      413
    );
  }

  // Attach Required Output Headers
  c.header('X-AIFoundry-Sku', grantClaims.sku || 'T10K');
  c.header('X-AIFoundry-Tool', toolName);
  c.header('X-AIFoundry-Budget-In', String(grantClaims.budget_in));
  c.header('X-AIFoundry-Budget-Out', String(grantClaims.budget_out));
  c.header('X-AIFoundry-Expires', String(grantClaims.exp));
  c.header('X-AIFoundry-Jti', grantClaims.jti);
  c.header('X-AIFoundry-Budget-Remaining', String(budgetCheck.remainingOut));

  // Route Execution
  if (toolName === 'openspec.plan') {
    const res = await handleOpenSpecPlan(c.env, body);
    return c.json(res);
  }

  if (toolName === 'nemotron.chat') {
    const res = await runNemotron(c.env, body, 'chat');
    return c.json({
      ok: true,
      tool: 'nemotron.chat',
      prompt: body.prompt || body.goal || 'ping',
      result: res.result,
      usage: res.usage,
      model: res.model,
      provider: res.provider
    });
  }

  if (toolName === 'review.kimi') {
    const res = await handleReviewKimi(c.env, body);
    return c.json(res);
  }

  if (toolName === 'audit.cf') {
    const res = await handleAuditCf(c.env, body);
    return c.json(res);
  }

  if (toolName === 'design.402') {
    const res = await handleDesign402(c.env, body);
    return c.json(res);
  }

  return c.json({ error: `Unknown tool name: ${toolName}` }, 404);
});

export default app;
