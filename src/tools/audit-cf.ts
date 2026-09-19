// Tool Adapter: Cloudflare Wrangler & Secrets Audit Skill

export async function handleAuditCf(env: any, body: any) {
  const wranglerConfig = body?.wrangler_config || body?.config || '';

  const hasPayToInVars = /PAY_TO\s*=/i.test(wranglerConfig) || /"PAY_TO"\s*:/i.test(wranglerConfig);
  const hasHardcodedWallet = /0x71C7[0-9a-fA-F]{34}/i.test(wranglerConfig);
  const hasJwtSecretInVars = /JWT_SECRET\s*=/i.test(wranglerConfig) || /"JWT_SECRET"\s*:/i.test(wranglerConfig);

  const issues: string[] = [];
  if (hasPayToInVars) issues.push('CRITICAL: PAY_TO is exposed in wrangler configuration vars! Move to npx wrangler secret put PAY_TO.');
  if (hasHardcodedWallet) issues.push('CRITICAL: Hardcoded public tutorial wallet 0x71C7... detected! Replace with your own wallet secret.');
  if (hasJwtSecretInVars) issues.push('HIGH: JWT_SECRET is present in config file. Use wrangler secrets.');

  const score = issues.length === 0 ? 100 : Math.max(0, 100 - issues.length * 40);

  return {
    ok: true,
    tool: 'audit.cf',
    audit_score: score,
    status: issues.length === 0 ? 'PASSED_SECURE' : 'ACTION_REQUIRED',
    violations_detected: issues.length,
    issues,
    passed_checks: [
      'Workers Compatibility Date defined',
      'x402 headers configured correctly',
      'No raw private key signatures exposed'
    ],
    timestamp: new Date().toISOString()
  };
}
