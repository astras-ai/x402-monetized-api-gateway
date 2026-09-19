// Tool Adapter: Cloudflare Workers & Security Audit Skill
// Inspired by cloudflare/security-audit-skill

export interface AuditCfInput {
  wrangler_config?: string;
  source_code?: string;
  environment_vars?: Record<string, string>;
  project_type?: 'worker' | 'pages' | 'durable_objects' | 'hyperdrive';
}

export interface AuditIssue {
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: 'SECRETS_LEAK' | 'WRANGLER_CONFIG' | 'X402_COMPLIANCE' | 'CORS_SECURITY' | 'RUNTIME_ISOLATION';
  rule_id: string;
  title: string;
  description: string;
  recommendation: string;
  remediation_cmd?: string;
}

export async function handleAuditCf(env: any, body: AuditCfInput) {
  const wranglerConfig = body?.wrangler_config || '';
  const sourceCode = body?.source_code || '';
  const envVars = body?.environment_vars || {};
  const projectType = body?.project_type || 'worker';

  const issues: AuditIssue[] = [];
  const passedChecks: string[] = [];

  // --- 1. Wrangler Config Security Rules ---
  if (wranglerConfig) {
    if (/PAY_TO\s*=/i.test(wranglerConfig) || /"PAY_TO"\s*:/i.test(wranglerConfig)) {
      issues.push({
        severity: 'CRITICAL',
        category: 'WRANGLER_CONFIG',
        rule_id: 'CF_SEC_001',
        title: 'Exposed PAY_TO Wallet Address in Config File',
        description: '`PAY_TO` is declared in plain text in wrangler config vars. Unencrypted config files in git repositories expose recipient parameters.',
        recommendation: 'Remove `PAY_TO` from wrangler.json / wrangler.toml [vars] and store as encrypted Cloudflare Secret.',
        remediation_cmd: 'npx wrangler secret put PAY_TO'
      });
    } else {
      passedChecks.push('PAY_TO wallet address is safely externalized or secret-managed.');
    }

    if (/JWT_SECRET\s*=/i.test(wranglerConfig) || /"JWT_SECRET"\s*:/i.test(wranglerConfig)) {
      issues.push({
        severity: 'CRITICAL',
        category: 'SECRETS_LEAK',
        rule_id: 'CF_SEC_002',
        title: 'Plaintext JWT_SECRET in Plain Config',
        description: '`JWT_SECRET` is present in plaintext inside the configuration file. Anyone with repository read access can forge session grants.',
        recommendation: 'Delete `JWT_SECRET` from vars and set via `wrangler secret put JWT_SECRET`.',
        remediation_cmd: 'npx wrangler secret put JWT_SECRET'
      });
    } else {
      passedChecks.push('JWT_SECRET is not hardcoded in wrangler vars.');
    }

    if (/0x71C7[0-9a-fA-F]{34}/i.test(wranglerConfig) || /0x71C74B532b2C34a5d89f816d8F349582f3402B89/i.test(wranglerConfig)) {
      issues.push({
        severity: 'HIGH',
        category: 'X402_COMPLIANCE',
        rule_id: 'CF_SEC_003',
        title: 'Tutorial Test Wallet Detected',
        description: 'Hardcoded tutorial/demo wallet address 0x71C7... detected in config. Production payments will send funds to the demo sink.',
        recommendation: 'Replace 0x71C7... with your active EVM Base/Solana settlement address.',
        remediation_cmd: 'npx wrangler secret put PAY_TO'
      });
    } else {
      passedChecks.push('Target payment address is not the default tutorial wallet.');
    }

    if (/compatibility_date/i.test(wranglerConfig)) {
      passedChecks.push('Workers compatibility_date is explicitly set.');
    } else {
      issues.push({
        severity: 'LOW',
        category: 'RUNTIME_ISOLATION',
        rule_id: 'CF_SEC_004',
        title: 'Missing compatibility_date',
        description: 'No compatibility_date specified in wrangler config. Runtime behavior might drift on new V8 isolate deployments.',
        recommendation: 'Add `"compatibility_date": "2024-09-23"` to wrangler config.',
        remediation_cmd: 'npx wrangler types'
      });
    }
  }

  // --- 2. Source Code & API Key Scanning ---
  const codeToScan = `${sourceCode}\n${JSON.stringify(envVars)}`;

  if (/sk-[a-zA-Z0-9]{20,}/.test(codeToScan)) {
    issues.push({
      severity: 'CRITICAL',
      category: 'SECRETS_LEAK',
      rule_id: 'CF_SEC_005',
      title: 'Exposed OpenAI / Upstream API Key in Source',
      description: 'Found `sk-...` secret pattern in submitted code or environment variables.',
      recommendation: 'Revoke the exposed key immediately and pass via Cloudflare Worker bindings (`env.OPENAI_API_KEY`).',
      remediation_cmd: 'npx wrangler secret put OPENAI_API_KEY'
    });
  } else {
    passedChecks.push('No hardcoded OpenAI / LLM provider API keys found in source code.');
  }

  if (/ghp_[a-zA-Z0-9]{36}/.test(codeToScan)) {
    issues.push({
      severity: 'CRITICAL',
      category: 'SECRETS_LEAK',
      rule_id: 'CF_SEC_006',
      title: 'Exposed GitHub Personal Access Token',
      description: 'Found `ghp_...` token pattern in code or env body.',
      recommendation: 'Revoke token on GitHub and migrate to GitHub App OIDC auth or wrangler secret.',
      remediation_cmd: 'npx wrangler secret put GH_TOKEN'
    });
  } else {
    passedChecks.push('No hardcoded GitHub PAT tokens detected.');
  }

  if (/-----BEGIN\s+(RSA\s+)?PRIVATE\s+KEY-----/.test(codeToScan)) {
    issues.push({
      severity: 'CRITICAL',
      category: 'SECRETS_LEAK',
      rule_id: 'CF_SEC_007',
      title: 'Raw RSA / ECC Private Key Found',
      description: 'Source snippet contains raw PEM private key block.',
      recommendation: 'Store private keys in Cloudflare Secrets or KMS services.',
      remediation_cmd: 'npx wrangler secret put PRIVATE_KEY'
    });
  } else {
    passedChecks.push('No unencrypted PEM private keys in source context.');
  }

  // --- 3. CORS & x402 Header Checks ---
  if (/allow-origin\s*:\s*'\*'/i.test(codeToScan) && /credentials\s*:\s*true/i.test(codeToScan)) {
    issues.push({
      severity: 'HIGH',
      category: 'CORS_SECURITY',
      rule_id: 'CF_SEC_008',
      title: 'CORS Wildcard with Allow-Credentials',
      description: 'Combining `Access-Control-Allow-Origin: *` with `Access-Control-Allow-Credentials: true` is invalid and vulnerable to cross-site credential hijacking.',
      recommendation: 'Reflect the explicit request Origin header instead of wildcard `*` when credentials are included.',
      remediation_cmd: 'Use Hono cors() middleware with exact allow list.'
    });
  } else {
    passedChecks.push('CORS header configuration adheres to safe credential isolation rules.');
  }

  // Calculate audit score
  let penalty = 0;
  for (const issue of issues) {
    if (issue.severity === 'CRITICAL') penalty += 35;
    else if (issue.severity === 'HIGH') penalty += 20;
    else if (issue.severity === 'MEDIUM') penalty += 10;
    else if (issue.severity === 'LOW') penalty += 5;
  }
  const score = Math.max(0, Math.min(100, 100 - penalty));

  return {
    ok: true,
    tool: 'audit.cf',
    project_type: projectType,
    audit_score: score,
    status: score === 100 ? 'PASSED_SECURE' : (score >= 70 ? 'WARNING_REVIEW' : 'CRITICAL_ACTION_REQUIRED'),
    violations_detected: issues.length,
    issues,
    passed_checks: passedChecks,
    summary: {
      critical: issues.filter(i => i.severity === 'CRITICAL').length,
      high: issues.filter(i => i.severity === 'HIGH').length,
      medium: issues.filter(i => i.severity === 'MEDIUM').length,
      low: issues.filter(i => i.severity === 'LOW').length,
    },
    vendor_reference: 'https://github.com/cloudflare/security-audit-skill',
    timestamp: new Date().toISOString()
  };
}
