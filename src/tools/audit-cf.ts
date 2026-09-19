// Tool Adapter: Cloudflare Workers & Security Audit Skill
// Inspired by cloudflare/security-audit-skill

import { runNemotron } from '../nemotron';

export interface AuditCfInput {
  wrangler_config?: string;
  source_code?: string;
  environment_vars?: Record<string, string>;
  project_type?: 'worker' | 'pages' | 'durable_objects' | 'hyperdrive';
  include_ai_insights?: boolean;
  api_key?: string;
  cf_token?: string;
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
  const includeAiInsights = body?.include_ai_insights ?? true;

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
        recommendation: 'Remove `PAY_TO` from wrangler config [vars] and store as encrypted Cloudflare Secret.',
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

  // Calculate audit score
  let penalty = 0;
  for (const issue of issues) {
    if (issue.severity === 'CRITICAL') penalty += 35;
    else if (issue.severity === 'HIGH') penalty += 20;
    else if (issue.severity === 'MEDIUM') penalty += 10;
    else if (issue.severity === 'LOW') penalty += 5;
  }
  const score = Math.max(0, Math.min(100, 100 - penalty));

  // AI Security Reasoning
  let aiReasoning = null;
  if (includeAiInsights) {
    try {
      const summaryPrompt = `Perform a Cloudflare Workers Security Audit on this submission:\n` +
        `Wrangler Config:\n${wranglerConfig || 'None provided'}\n\n` +
        `Source Code / Env:\n${sourceCode || 'None provided'}\n\n` +
        `Detected Issues (${issues.length}):\n${issues.map(i => `- [${i.severity}] ${i.title}: ${i.description}`).join('\n')}\n` +
        `Provide a concise 3-sentence executive security assessment & mitigation roadmap.`;

      const aiResponse = await runNemotron(
        env,
        {
          ...body,
          prompt: summaryPrompt,
          system_prompt: 'You are Cloudflare Workers Security Auditor. Provide strict, practical security analysis.',
          max_tokens: 400
        },
        'audit'
      );

      aiReasoning = {
        model: aiResponse.model,
        provider: aiResponse.provider,
        insight: aiResponse.result
      };
    } catch (err) {
      console.warn('AI reasoning enrichment skipped:', err);
    }
  }

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
    ai_reasoning: aiReasoning,
    vendor_reference: 'https://github.com/cloudflare/security-audit-skill',
    timestamp: new Date().toISOString()
  };
}
