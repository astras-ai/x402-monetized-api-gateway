import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { mintGrantToken, verifyGrantToken, revokeGrantToken, deductGrantBudget } from './session';
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
  ASSETS?: any;
};

// Supported Networks Registry for x402 Settlement
const NETWORK_REGISTRY: Record<string, { name: string; chainId: any; usdc: string; isTestnet: boolean; faucetUrl?: string }> = {
  'base-sepolia': {
    name: 'Base Sepolia Testnet',
    chainId: 84532,
    usdc: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
    isTestnet: true,
    faucetUrl: 'https://faucet.quicknode.com/base/sepolia'
  },
  'solana-devnet': {
    name: 'Solana Devnet',
    chainId: 'solana-devnet',
    usdc: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
    isTestnet: true,
    faucetUrl: 'https://faucet.solana.com'
  },
  'polygon-amoy': {
    name: 'Polygon Amoy Testnet',
    chainId: 80002,
    usdc: '0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582',
    isTestnet: true,
    faucetUrl: 'https://faucet.polygon.technology'
  },
  'arbitrum-sepolia': {
    name: 'Arbitrum Sepolia Testnet',
    chainId: 421614,
    usdc: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d',
    isTestnet: true,
    faucetUrl: 'https://faucet.quicknode.com/arbitrum/sepolia'
  },
  'base': {
    name: 'Base Mainnet',
    chainId: 8453,
    usdc: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    isTestnet: false
  },
  'solana': {
    name: 'Solana Mainnet-Beta',
    chainId: 'solana-mainnet',
    usdc: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    isTestnet: false
  }
};

// Available AI Tools for Autonomous Agents
const TOOL_CATALOG = [
  {
    id: 'openspec.plan',
    name: 'OpenSpec Software Architecture Generator',
    endpoint: '/v1/tools/openspec.plan',
    price_usd: 0.05,
    description: 'Generates production software architecture specs, roles, business models, and technical plans.',
    provider: 'Fission AI OpenSpec + DeepSeek R1'
  },
  {
    id: 'review.kimi',
    name: 'Alibaba Open Code Review (Kimi)',
    endpoint: '/v1/tools/review.kimi',
    price_usd: 0.05,
    description: 'AST code review engine with exact token receipt metering and security flaw detection.',
    provider: 'Alibaba Open Code Review'
  },
  {
    id: 'audit.cf',
    name: 'Cloudflare Workers Security Audit',
    endpoint: '/v1/tools/audit.cf',
    price_usd: 0.05,
    description: 'Scans Wrangler configs & Worker code for exposed keys, insecure bindings, and x402 readiness.',
    provider: 'Cloudflare Security Audit Skill'
  },
  {
    id: 'design.402',
    name: 'OpenDesign UI Spec Generator',
    endpoint: '/v1/tools/design.402',
    price_usd: 0.05,
    description: 'Generates tailwind design tokens, component hierarchies, and layout specs.',
    provider: 'OpenDesign DeepSeek'
  },
  {
    id: 'nemotron.chat',
    name: 'Workers AI Edge Model Chat',
    endpoint: '/v1/tools/nemotron.chat',
    price_usd: 0.05,
    description: 'Direct sub-20ms edge LLM inference proxy for autonomous AI agents.',
    provider: 'Cloudflare Workers AI (Nemotron/DeepSeek)'
  }
];

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
    'X-Payment-Header',
    'X-CF-Token',
    'X-CF-Account-Id'
  ],
  exposeHeaders: [
    'X-AIFoundry-Sku',
    'X-AIFoundry-Tool',
    'X-AIFoundry-Budget-In',
    'X-AIFoundry-Budget-Out',
    'X-AIFoundry-Expires',
    'X-AIFoundry-Jti',
    'X-AIFoundry-Budget-Remaining',
    'X-402-Payment-Required',
    'WWW-Authenticate'
  ]
}));

// Health Check
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    gateway: 'AIFoundry.sh x402 Gateway',
    network: c.env.NETWORK || 'base-sepolia',
    timestamp: new Date().toISOString()
  });
});

// App & Static Asset Serving
app.get('/', async (c) => {
  const accept = c.req.header('accept') || '';
  if (accept.includes('application/json') && !accept.includes('text/html')) {
    return c.json({
      name: 'AIFoundry.sh x402 Gateway',
      protocol: 'x402 (HTTP 402 Payment Required)',
      version: '1.0.0',
      description: 'Autonomous AI Monetized Gateway — Pay $0.05 USDC per call via EVM / Solana / L402 Macaroons',
      catalog_endpoint: '/v1/tools',
      x402_spec_endpoint: '/.well-known/x402'
    });
  }

  if (c.env.ASSETS) {
    return c.env.ASSETS.fetch(c.req.raw);
  }

  return c.json({ status: 'ok', name: 'AIFoundry.sh x402 Gateway' });
});

app.get('/app', async (c) => {
  if (c.env.ASSETS) {
    return c.env.ASSETS.fetch(new Request(new URL('/', c.req.url), c.req.raw));
  }
  return c.text('AIFoundry.sh Portal');
});

// GET /.well-known/x402 — Machine-Readable Payment Discovery for AI Agents
app.get('/.well-known/x402', (c) => {
  return c.json({
    x402_version: 1,
    gateway: 'AIFoundry.sh',
    supported_networks: Object.keys(NETWORK_REGISTRY),
    accepted_assets: ['USDC'],
    default_price_usd: 0.05,
    facilitator_url: c.env.FACILITATOR_URL || 'https://x402.org/facilitator',
    pay_to: c.env.PAY_TO || '0x71C74B532b2C34a5d89f816d8F349582f3402B89',
    tools: TOOL_CATALOG
  });
});

// Tool Catalog Endpoint
app.get('/v1/tools', (c) => {
  return c.json({
    gateway: 'AIFoundry.sh x402 AI Agent Gateway',
    total_tools: TOOL_CATALOG.length,
    price_per_call_usd: 0.05,
    tools: TOOL_CATALOG
  });
});

app.get('/api/networks', (c) => c.json(NETWORK_REGISTRY));

// Settle Invoice Endpoint
app.post('/api/invoices/settle', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const preimage = `preimage_${Math.random().toString(36).substring(2, 12)}`;
  const macaroon = `macaroon_proof_jwt_x402_${Math.random().toString(36).substring(2, 8)}`;
  return c.json({
    success: true,
    invoice_id: body.invoice_id || `inv_${Math.random().toString(36).substring(2, 10)}`,
    amount_usd: 0.05,
    asset: 'USDC',
    preimage,
    macaroon,
    auth_header: `L402 ${macaroon}:${preimage}`
  });
});

// POST /v1/session/close — Burn / Revoke active Grant token
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

// Execution Route for AI Tools
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

  const authHeader = c.req.header('authorization') || c.req.header('x-aifoundry-grant') || '';
  let token = authHeader.replace(/^Bearer\s+/i, '').trim();

  const sandboxHeader = c.req.header('x-402-sandbox-key') || c.req.header('x-402-settle-paid') || c.req.header('x-payment-header');
  const isPaid = Boolean(sandboxHeader && (sandboxHeader === 'sandbox_demo' || sandboxHeader === 'true' || sandboxHeader.length > 5));

  let grantClaims: any = null;

  if (token) {
    const verifyResult = await verifyGrantToken(jwtSecret, token);
    if (verifyResult.valid) {
      grantClaims = verifyResult.claims;
    }
  }

  if (!grantClaims && isPaid) {
    const mintResult = await mintGrantToken(jwtSecret, toolName, 'T10K', 'agent_client', 600, 10000, 10000);
    token = mintResult.token;
    grantClaims = mintResult.claims;
  }

  // If unpaid, issue standard x402 HTTP 402 Payment Required challenge
  if (!grantClaims) {
    c.header('X-402-Payment-Required', 'true');
    c.header('WWW-Authenticate', `L402 asset="USDC", price="0.05", network="${network}"`);
    return c.json(
      {
        error: 'HTTP 402 Payment Required',
        message: 'Payment required to access AIFoundry AI tool. Settle $0.05 USDC or attach L402 macaroon token.',
        x402: {
          version: 1,
          challenge_id: `inv_${Math.random().toString(36).substring(2, 10)}`,
          payment_hash: `hash_${Math.random().toString(36).substring(2, 12)}`,
          price_usd: 0.05,
          asset: 'USDC',
          network,
          pay_to: c.env.PAY_TO || '0x71C74B532b2C34a5d89f816d8F349582f3402B89',
          facilitator: c.env.FACILITATOR_URL || 'https://x402.org/facilitator',
          instructions: 'To pay: send $0.05 USDC to pay_to or set header "X-402-Settle-Paid: true" in test/sandbox mode.'
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

  c.header('X-AIFoundry-Sku', grantClaims.sku || 'T10K');
  c.header('X-AIFoundry-Tool', toolName);
  c.header('X-AIFoundry-Budget-In', String(grantClaims.budget_in));
  c.header('X-AIFoundry-Budget-Out', String(grantClaims.budget_out));
  c.header('X-AIFoundry-Expires', String(grantClaims.exp));
  c.header('X-AIFoundry-Jti', grantClaims.jti);
  c.header('X-AIFoundry-Budget-Remaining', String(budgetCheck.remainingOut));

  const clientCfToken = c.req.header('x-cf-token');
  const clientCfAccountId = c.req.header('x-cf-account-id');
  const mergedEnv = {
    ...c.env,
    ...(clientCfToken ? { CF_API_TOKEN: clientCfToken } : {}),
    ...(clientCfAccountId ? { CF_ACCOUNT_ID: clientCfAccountId } : {})
  };

  let resultResponse: any = null;

  if (toolName === 'openspec.plan') {
    resultResponse = await handleOpenSpecPlan(mergedEnv, body);
  } else if (toolName === 'nemotron.chat') {
    const res = await runNemotron(mergedEnv, body, 'chat');
    resultResponse = {
      ok: true,
      tool: 'nemotron.chat',
      prompt: body.prompt || body.goal || 'ping',
      result: res.result,
      usage: res.usage,
      model: res.model,
      provider: res.provider
    };
  } else if (toolName === 'review.kimi') {
    resultResponse = await handleReviewKimi(mergedEnv, body);
  } else if (toolName === 'audit.cf') {
    resultResponse = await handleAuditCf(mergedEnv, body);
  } else if (toolName === 'design.402') {
    resultResponse = await handleDesign402(mergedEnv, body);
  } else {
    return c.json({ error: `Unknown tool name: ${toolName}` }, 404);
  }

  return c.json(resultResponse);
});

export default app;
