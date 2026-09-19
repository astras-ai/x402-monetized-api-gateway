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
};

// In-Memory Storage for Demo & Sandbox
let requestLogs: any[] = [
  {
    id: 'log_01',
    timestamp: new Date().toISOString(),
    route: '/v1/tools/openspec.plan',
    status: 200,
    payment_method: 'L402 Macaroon',
    revenue_usd: 0.05,
    latency_ms: 12,
    ip: '104.28.14.92'
  },
  {
    id: 'log_02',
    timestamp: new Date(Date.now() - 60000).toISOString(),
    route: '/v1/tools/review.kimi',
    status: 402,
    payment_method: 'HTTP 402 Required',
    revenue_usd: 0,
    latency_ms: 2,
    ip: '172.56.21.10'
  },
  {
    id: 'log_03',
    timestamp: new Date(Date.now() - 120000).toISOString(),
    route: '/v1/tools/audit.cf',
    status: 200,
    payment_method: 'EVM USDC (Base)',
    revenue_usd: 0.05,
    latency_ms: 8,
    ip: '198.51.100.4'
  }
];

let apiKeys: any[] = [
  {
    id: 'key_01',
    name: 'Primary Developer Key',
    key_secret: 'x402_live_demo888899990000',
    balance_usd: 25.00,
    total_spent: 1.45,
    status: 'active',
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'key_02',
    name: 'Autonomous Agent ElizaOS',
    key_secret: 'x402_agent_eliza_77889900',
    balance_usd: 50.00,
    total_spent: 4.80,
    status: 'active',
    created_at: new Date(Date.now() - 172800000).toISOString()
  }
];

let creditLedger: any[] = [
  {
    id: 'tx_01',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    type: 'DEPOSIT',
    amount_usd: 25.00,
    description: 'Initial developer credit funding via Stripe'
  },
  {
    id: 'tx_02',
    created_at: new Date(Date.now() - 1800000).toISOString(),
    type: 'CALL_CHARGE',
    amount_usd: -0.05,
    description: 'OpenSpec Plan generation call'
  }
];

let secretsStore: any[] = [
  {
    key_name: 'PAY_WALLET',
    secret_value: '0x71C7...402B89',
    category: 'web3',
    description: 'EVM USDC Receiving Vault Address on Base Mainnet'
  },
  {
    key_name: 'OPENAI_API_KEY',
    secret_value: 'sk-proj-x402...9901',
    category: 'ai',
    description: 'Upstream LLM Provider Backup Key'
  },
  {
    key_name: 'SOLANA_RPC_URL',
    secret_value: 'https://api.mainnet-beta.solana.com',
    category: 'web3',
    description: 'Solana Network RPC Endpoint'
  }
];

let oidcConfigState: any = {
  mode: 'dev_open',
  cloudflare_access_domain: 'aifoundry.cloudflareaccess.com',
  oidc_client_id: 'cf_access_client_aifoundry_402',
  require_mfa: 1,
  allowed_domains: '["@aifoundry.sh", "admin@cf.dev"]',
  active_session_user: 'AIFoundry Admin'
};

let ghConfigState: any = {
  gh_username: 'aifoundry-sh',
  gh_token: 'ghp_x402demo...hidden',
  target_repo: 'aifoundry-x402-gateway',
  connected_at: Date.now() - 86400000,
  last_sync_time: Date.now() - 3600000
};

const customRoutes: any[] = [
  {
    id: 'route_01',
    name: 'OpenSpec Architecture Generator',
    path_pattern: '/v1/tools/openspec.plan',
    type: 'builtin_ai',
    target_url: 'internal://openspec.plan',
    price_usd: 0.05,
    status: 'active'
  },
  {
    id: 'route_02',
    name: 'DeepSeek / Nemotron AI Engine',
    path_pattern: '/v1/tools/nemotron.chat',
    type: 'builtin_ai',
    target_url: 'internal://nemotron.chat',
    price_usd: 0.05,
    status: 'active'
  },
  {
    id: 'route_03',
    name: 'Alibaba Open Code Review (Kimi)',
    path_pattern: '/v1/tools/review.kimi',
    type: 'builtin_ai',
    target_url: 'internal://review.kimi',
    price_usd: 0.05,
    status: 'active'
  },
  {
    id: 'route_04',
    name: 'Cloudflare Security Audit Skill',
    path_pattern: '/v1/tools/audit.cf',
    type: 'builtin_ai',
    target_url: 'internal://audit.cf',
    price_usd: 0.05,
    status: 'active'
  },
  {
    id: 'route_05',
    name: 'OpenDesign UI Spec Generator',
    path_pattern: '/v1/tools/design.402',
    type: 'builtin_ai',
    target_url: 'internal://design.402',
    price_usd: 0.05,
    status: 'active'
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
    'X-API-Key'
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
    brand: 'AIFoundry.sh',
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
        description: 'Direct completion interface to NVIDIA Nemotron 3 120B / DeepSeek.'
      },
      {
        name: 'review.kimi',
        endpoint: '/v1/tools/review.kimi',
        method: 'POST',
        sku: 'T10K',
        price_usd: 0.05,
        status: 'production',
        description: 'Automated Alibaba Kimi code review & token receipt meter.'
      },
      {
        name: 'audit.cf',
        endpoint: '/v1/tools/audit.cf',
        method: 'POST',
        sku: 'T10K',
        price_usd: 0.05,
        status: 'production',
        description: 'Cloudflare Workers configuration & security audit skill.'
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

// Admin Dashboard API Endpoints
app.get('/api/stats', (c) => {
  const totalRev = requestLogs.reduce((acc, log) => acc + (log.revenue_usd || 0), 0);
  const totalReq = requestLogs.length;
  const paidReq = requestLogs.filter(l => l.status === 200).length;
  const challenges = requestLogs.filter(l => l.status === 402).length;

  return c.json({
    total_revenue_usd: Number(totalRev.toFixed(4)),
    total_requests: totalReq,
    total_paid_requests: paidReq,
    total_402_challenges: challenges,
    avg_latency_ms: 5,
    active_api_keys: apiKeys.length
  });
});

app.get('/api/routes', (c) => c.json(customRoutes));

app.post('/api/routes', async (c) => {
  const body = await c.req.json();
  const newRoute = {
    id: `route_${Date.now()}`,
    name: body.name || 'New Proxy Route',
    path_pattern: body.path_pattern || `/v1/tools/custom_${Date.now()}`,
    type: body.type || 'builtin_ai',
    target_url: body.target_url || 'internal://custom',
    price_usd: Number(body.price_usd || 0.05),
    status: 'active'
  };
  customRoutes.push(newRoute);
  return c.json(newRoute);
});

app.get('/api/keys', (c) => c.json({ keys: apiKeys, ledger: creditLedger }));

app.post('/api/keys', async (c) => {
  const body = await c.req.json();
  const newKey = {
    id: `key_${Date.now()}`,
    name: body.name || 'Developer Key',
    key_secret: `x402_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`,
    balance_usd: Number(body.initial_balance || 10.00),
    total_spent: 0.00,
    status: 'active',
    created_at: new Date().toISOString()
  };
  apiKeys.push(newKey);
  creditLedger.unshift({
    id: `tx_${Date.now()}`,
    created_at: new Date().toISOString(),
    type: 'DEPOSIT',
    amount_usd: newKey.balance_usd,
    description: `Initial funding for API key ${newKey.name}`
  });
  return c.json(newKey);
});

app.post('/api/keys/:id/topup', async (c) => {
  const keyId = c.req.param('id');
  const body = await c.req.json();
  const keyObj = apiKeys.find(k => k.id === keyId);
  if (keyObj) {
    const amount = Number(body.amount || 10.00);
    keyObj.balance_usd += amount;
    creditLedger.unshift({
      id: `tx_${Date.now()}`,
      created_at: new Date().toISOString(),
      type: 'TOPUP',
      amount_usd: amount,
      description: `Top-up for key ${keyObj.name}`
    });
    return c.json({ success: true, new_balance: keyObj.balance_usd });
  }
  return c.json({ error: 'Key not found' }, 404);
});

app.get('/api/logs', (c) => c.json(requestLogs));

app.get('/api/secrets', (c) => c.json(secretsStore));

app.post('/api/secrets', async (c) => {
  const body = await c.req.json();
  const existingIndex = secretsStore.findIndex(s => s.key_name === body.key_name);
  if (existingIndex >= 0) {
    secretsStore[existingIndex] = { ...secretsStore[existingIndex], ...body };
  } else {
    secretsStore.push({
      key_name: body.key_name,
      secret_value: body.secret_value,
      category: body.category || 'web3',
      description: body.description || ''
    });
  }
  return c.json({ success: true, key_name: body.key_name });
});

app.delete('/api/secrets/:keyName', (c) => {
  const keyName = c.req.param('keyName');
  secretsStore = secretsStore.filter(s => s.key_name !== keyName);
  return c.json({ success: true, deleted: keyName });
});

app.get('/api/security/oidc', (c) => c.json(oidcConfigState));

app.post('/api/security/oidc', async (c) => {
  const body = await c.req.json();
  oidcConfigState = { ...oidcConfigState, ...body };
  return c.json({ success: true, config: oidcConfigState });
});

app.post('/api/security/oidc/test-handshake', (c) => {
  return c.json({
    success: true,
    status: 'OIDC_VALIDATED',
    issuer: oidcConfigState.cloudflare_access_domain,
    user: oidcConfigState.active_session_user,
    mfa_verified: true
  });
});

app.get('/api/github/status', (c) => c.json(ghConfigState));

app.post('/api/github/connect', async (c) => {
  const body = await c.req.json();
  ghConfigState = { ...ghConfigState, ...body, connected_at: Date.now() };
  return c.json({ success: true, gh_username: ghConfigState.gh_username });
});

app.post('/api/github/push', (c) => {
  ghConfigState.last_sync_time = Date.now();
  return c.json({
    success: true,
    repo: ghConfigState.target_repo,
    branch: 'main',
    commit_sha: 'a0db79f3f0b0ca08530b58a312ba383e31c01e97'
  });
});

app.post('/api/worker/eval', async (c) => {
  const body = await c.req.json();
  return c.json({
    success: true,
    result: {
      status: 'SUCCESS',
      worker_runtime: 'Cloudflare Workers V8 Isolate',
      durable_object: 'AIFoundry x402 Engine',
      secrets_count: secretsStore.length,
      evaluated_at: new Date().toISOString()
    }
  });
});

app.post('/api/invoices/settle', async (c) => {
  const body = await c.req.json();
  const preimage = `preimage_${Math.random().toString(36).substring(2, 12)}`;
  const macaroon = `macaroon_proof_jwt_x402`;
  return c.json({
    success: true,
    invoice_id: body.invoice_id || 'inv_demo_402',
    preimage,
    macaroon,
    auth_header: `L402 ${macaroon}:${preimage}`
  });
});

app.post('/api/faucet/topup', (c) => {
  const demoKey = apiKeys[0];
  if (demoKey) {
    demoKey.balance_usd += 10.00;
    creditLedger.unshift({
      id: `tx_${Date.now()}`,
      created_at: new Date().toISOString(),
      type: 'FAUCET',
      amount_usd: 10.00,
      description: 'Testnet faucet top-up claim'
    });
    return c.json({ success: true, keySecret: demoKey.key_secret, new_balance: demoKey.balance_usd });
  }
  return c.json({ success: true, keySecret: 'x402_live_demo888899990000', new_balance: 10.00 });
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

  // Check grant token or API key provided in request
  const authHeader = c.req.header('authorization') || c.req.header('x-aifoundry-grant') || '';
  let token = authHeader.replace(/^Bearer\s+/i, '').trim();

  const apiKeyHeader = c.req.header('x-api-key');
  const sandboxHeader = c.req.header('x-402-sandbox-key') || c.req.header('x-402-settle-paid') || c.req.header('x-payment-header');
  const isSandboxPay = Boolean(sandboxHeader && (sandboxHeader === 'sandbox_demo' || sandboxHeader === 'true' || sandboxHeader.length > 5));

  let grantClaims: any = null;

  if (token) {
    const verifyResult = await verifyGrantToken(jwtSecret, token);
    if (verifyResult.valid) {
      grantClaims = verifyResult.claims;
    }
  }

  // If API key header provided
  if (!grantClaims && apiKeyHeader) {
    const matchedKey = apiKeys.find(k => k.key_secret === apiKeyHeader);
    if (matchedKey && matchedKey.balance_usd >= 0.05) {
      matchedKey.balance_usd -= 0.05;
      matchedKey.total_spent += 0.05;
      const mintResult = await mintGrantToken(jwtSecret, toolName, 'T10K', matchedKey.id, 600, 10000, 10000);
      token = mintResult.token;
      grantClaims = mintResult.claims;
    }
  }

  // If payment was simulated / settled in header
  if (!grantClaims && isSandboxPay) {
    const mintResult = await mintGrantToken(jwtSecret, toolName, 'T10K', 'sandbox_user', 600, 10000, 10000);
    token = mintResult.token;
    grantClaims = mintResult.claims;
  }

  // If STILL no valid grant, trigger HTTP 402 Payment Required challenge
  if (!grantClaims) {
    requestLogs.unshift({
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      route: `/v1/tools/${toolName}`,
      status: 402,
      payment_method: 'HTTP 402 Challenge Issued',
      revenue_usd: 0,
      latency_ms: 3,
      ip: c.req.header('cf-connecting-ip') || '127.0.0.1'
    });

    c.header('X-402-Payment-Required', 'true');
    c.header('WWW-Authenticate', `L402 asset="USDC", price="0.05", network="${network}"`);
    return c.json(
      {
        error: 'HTTP 402 Payment Required',
        message: 'Payment required to access AIFoundry tool. Settle $0.05 USDC on Base/Solana or attach L402 macaroon token.',
        x402: {
          version: 1,
          challenge_id: `inv_${Math.random().toString(36).substring(2, 10)}`,
          payment_hash: `hash_${Math.random().toString(36).substring(2, 12)}`,
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

  // Record successful paid execution log
  requestLogs.unshift({
    id: `log_${Date.now()}`,
    timestamp: new Date().toISOString(),
    route: `/v1/tools/${toolName}`,
    status: 200,
    payment_method: isSandboxPay ? 'Sandbox Micropayment' : (apiKeyHeader ? 'API Key Ledger' : 'L402 Macaroon'),
    revenue_usd: 0.05,
    latency_ms: Math.floor(Math.random() * 15) + 5,
    ip: c.req.header('cf-connecting-ip') || '127.0.0.1'
  });

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

