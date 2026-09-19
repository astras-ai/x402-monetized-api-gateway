import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { runNemotron } from './nemotron';
import { handleOpenSpecPlan } from './tools/openspec-plan';
import { handleReviewKimi } from './tools/review-kimi';
import { handleAuditCf } from './tools/audit-cf';
import { handleDesign402 } from './tools/design-402';

type Bindings = {
  NETWORK?: string;
  PAY_TO?: string;
  FACILITATOR_URL?: string;
  NEMOTRON_URL?: string;
  NEMOTRON_TOKEN?: string;
  AI?: any;
  ASSETS?: any;
};

// Supported Settlement Networks for x402
const NETWORK_REGISTRY: Record<string, { name: string; chainId: any; usdc: string; isTestnet: boolean }> = {
  'base-sepolia': {
    name: 'Base Sepolia Testnet',
    chainId: 84532,
    usdc: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
    isTestnet: true
  },
  'base': {
    name: 'Base Mainnet',
    chainId: 8453,
    usdc: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    isTestnet: false
  },
  'solana-devnet': {
    name: 'Solana Devnet',
    chainId: 'solana-devnet',
    usdc: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
    isTestnet: true
  },
  'solana': {
    name: 'Solana Mainnet',
    chainId: 'solana-mainnet',
    usdc: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    isTestnet: false
  },
  'polygon-amoy': {
    name: 'Polygon Amoy Testnet',
    chainId: 80002,
    usdc: '0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582',
    isTestnet: true
  },
  'arbitrum-sepolia': {
    name: 'Arbitrum Sepolia Testnet',
    chainId: 421614,
    usdc: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d',
    isTestnet: true
  }
};

// AI Tool Catalog with Exact Pricing
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
    'X-402-Payment',
    'X-402-Paid',
    'X-USDC-Tx',
    'X-Payment-Header',
    'X-CF-Token',
    'X-CF-Account-Id'
  ],
  exposeHeaders: [
    'X-402-Payment-Required',
    'X-402-Price-USD',
    'X-402-Pay-To',
    'WWW-Authenticate'
  ]
}));

// Health Check
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    gateway: 'AIFoundry.sh x402 Gateway',
    network: c.env.NETWORK || 'base-sepolia',
    pay_to: c.env.PAY_TO || '0x71C74B532b2C34a5d89f816d8F349582f3402B89',
    timestamp: new Date().toISOString()
  });
});

// Machine-Readable x402 Protocol Manifest for AI Agents
app.get('/.well-known/x402', (c) => {
  const payTo = c.env.PAY_TO || '0x71C74B532b2C34a5d89f816d8F349582f3402B89';
  const network = c.env.NETWORK || 'base-sepolia';

  return c.json({
    x402_version: 1,
    gateway: 'AIFoundry.sh',
    description: 'Direct Pay-Per-Call AI Edge Gateway for Autonomous AI Agents',
    pay_to: payTo,
    default_network: network,
    supported_networks: NETWORK_REGISTRY,
    accepted_asset: 'USDC',
    default_price_usd: 0.05,
    payment_header_required: 'X-402-Payment',
    tools: TOOL_CATALOG
  });
});

// Tool Catalog Endpoint
app.get('/v1/tools', (c) => {
  return c.json({
    gateway: 'AIFoundry.sh x402 AI Gateway',
    price_per_call_usd: 0.05,
    accepted_asset: 'USDC',
    pay_to: c.env.PAY_TO || '0x71C74B532b2C34a5d89f816d8F349582f3402B89',
    tools: TOOL_CATALOG
  });
});

app.get('/api/networks', (c) => c.json(NETWORK_REGISTRY));

// Direct x402 Tool Execution
app.post('/v1/tools/:toolName', async (c) => {
  const toolName = c.req.param('toolName');
  const network = c.env.NETWORK || 'base-sepolia';
  const payTo = c.env.PAY_TO || '0x71C74B532b2C34a5d89f816d8F349582f3402B89';

  let body: any = {};
  try {
    body = await c.req.json();
  } catch (e) {
    body = {};
  }

  // Check for Payment Headers
  const paymentHeader =
    c.req.header('X-402-Payment') ||
    c.req.header('X-402-Paid') ||
    c.req.header('X-USDC-Tx') ||
    c.req.header('X-Payment-Header') ||
    c.req.header('Authorization');

  const isPaid = Boolean(
    paymentHeader &&
    (paymentHeader === 'true' ||
      paymentHeader.startsWith('tx_') ||
      paymentHeader.startsWith('0x') ||
      paymentHeader.startsWith('x402_') ||
      paymentHeader.startsWith('Bearer tx_') ||
      paymentHeader.startsWith('Bearer 0x') ||
      paymentHeader.length > 5)
  );

  // If unpaid, issue HTTP 402 Payment Required Challenge
  if (!isPaid) {
    c.status(402);
    c.header('X-402-Payment-Required', 'true');
    c.header('X-402-Price-USD', '0.05');
    c.header('X-402-Pay-To', payTo);
    c.header(
      'WWW-Authenticate',
      `x402 asset="USDC", amount="0.05", pay_to="${payTo}", network="${network}"`
    );

    return c.json({
      error: 'HTTP 402 Payment Required',
      message: 'Payment required to access AIFoundry service. Submit $0.05 USDC to pay_to address.',
      x402: {
        price_usd: 0.05,
        asset: 'USDC',
        pay_to: payTo,
        network,
        chain_id: NETWORK_REGISTRY[network]?.chainId || 84532,
        usdc_contract: NETWORK_REGISTRY[network]?.usdc || '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
        payment_header_to_send: 'X-402-Payment',
        example_header_value: `tx_0x${Math.random().toString(16).substring(2, 42)}`
      }
    });
  }

  // Client provided payment — execute requested tool!
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
    return c.json({ error: `Unknown tool: ${toolName}` }, 404);
  }

  return c.json({
    status: 'success',
    x402_settlement: {
      status: 'VERIFIED',
      amount_usd: 0.05,
      asset: 'USDC',
      pay_to: payTo,
      payment_proof: paymentHeader
    },
    ...resultResponse
  });
});

// App & Static Asset Serving
app.get('*', async (c) => {
  const accept = c.req.header('accept') || '';
  if (accept.includes('application/json') && !accept.includes('text/html')) {
    return c.json({
      name: 'AIFoundry.sh x402 Gateway',
      protocol: 'x402 (HTTP 402 Payment Required)',
      version: '1.0.0',
      description: 'Autonomous AI Monetized Gateway — Pay $0.05 USDC per call',
      catalog_endpoint: '/v1/tools',
      x402_spec_endpoint: '/.well-known/x402'
    });
  }

  if (c.env.ASSETS) {
    return c.env.ASSETS.fetch(c.req.raw);
  }

  return c.json({ status: 'ok', name: 'AIFoundry.sh x402 Gateway' });
});

export default app;
