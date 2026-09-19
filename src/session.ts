// Scoped Grant Session & JWT Manager for x402 AIFoundry.sh

export interface GrantClaims {
  sub?: string;
  aud: string;
  sku: 'T10K' | 'M10' | 'CUSTOM';
  tool: string;
  budget_in: number;
  budget_out: number;
  exp: number;
  jti: string;
  iat: number;
}

// In-memory revoked/consumed JTI set per isolate (with optional TTL cleanup)
const revokedJtis = new Set<string>();
const jtiUsageMap = new Map<string, { budget_in_left: number; budget_out_left: number; exp: number }>();

async function getHmacKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    'raw',
    enc.encode(secret || 'default-aifoundry-hmac-secret-change-in-prod'),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

function base64UrlEncode(bytes: Uint8Array): string {
  let str = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    str += String.fromCharCode(bytes[i]);
  }
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str: string): Uint8Array {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  const binaryStr = atob(str);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  return bytes;
}

export async function mintGrantToken(
  secret: string,
  tool: string,
  sku: 'T10K' | 'M10' | 'CUSTOM' = 'T10K',
  payerSub?: string,
  ttlSeconds: number = 600,
  budgetIn: number = 10000,
  budgetOut: number = 10000
): Promise<{ token: string; claims: GrantClaims }> {
  const now = Math.floor(Date.now() / 1000);
  const jti = 'jti_' + Math.random().toString(36).substring(2, 10) + '_' + now;
  const exp = now + ttlSeconds;

  const claims: GrantClaims = {
    sub: payerSub || 'anonymous_agent',
    aud: 'aifoundry.sh',
    sku,
    tool,
    budget_in: budgetIn,
    budget_out: budgetOut,
    exp,
    jti,
    iat: now
  };

  const header = { alg: 'HS256', typ: 'JWT' };
  const enc = new TextEncoder();
  const headerB64 = base64UrlEncode(enc.encode(JSON.stringify(header)));
  const payloadB64 = base64UrlEncode(enc.encode(JSON.stringify(claims)));
  const dataToSign = enc.encode(`${headerB64}.${payloadB64}`);

  const key = await getHmacKey(secret);
  const sigBuffer = await crypto.subtle.sign('HMAC', key, dataToSign);
  const sigB64 = base64UrlEncode(new Uint8Array(sigBuffer));

  const token = `${headerB64}.${payloadB64}.${sigB64}`;

  // Register jti in memory
  jtiUsageMap.set(jti, {
    budget_in_left: budgetIn,
    budget_out_left: budgetOut,
    exp
  });

  return { token, claims };
}

export async function verifyGrantToken(
  secret: string,
  token: string
): Promise<{ valid: boolean; claims?: GrantClaims; error?: string }> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false, error: 'invalid_jwt_format' };
    }

    const [headerB64, payloadB64, sigB64] = parts;
    const enc = new TextEncoder();
    const dataToSign = enc.encode(`${headerB64}.${payloadB64}`);
    const key = await getHmacKey(secret);

    const sigBytes = base64UrlDecode(sigB64);
    const isValidSig = await crypto.subtle.verify('HMAC', key, sigBytes, dataToSign);

    if (!isValidSig) {
      return { valid: false, error: 'signature_mismatch' };
    }

    const payloadText = new TextDecoder().decode(base64UrlDecode(payloadB64));
    const claims: GrantClaims = JSON.parse(payloadText);

    const now = Math.floor(Date.now() / 1000);
    if (claims.exp < now) {
      return { valid: false, error: 'grant_expired' };
    }

    if (revokedJtis.has(claims.jti)) {
      return { valid: false, error: 'grant_revoked' };
    }

    return { valid: true, claims };
  } catch (e: any) {
    return { valid: false, error: 'token_parse_error: ' + e.message };
  }
}

export function revokeGrantToken(jti: string): boolean {
  if (!jti) return false;
  revokedJtis.add(jti);
  jtiUsageMap.delete(jti);
  return true;
}

export function deductGrantBudget(
  jti: string,
  tokensInUsed: number,
  tokensOutUsed: number,
  maxBudgetIn: number,
  maxBudgetOut: number
): { allowed: boolean; remainingIn: number; remainingOut: number; reason?: string } {
  let usage = jtiUsageMap.get(jti);
  if (!usage) {
    usage = { budget_in_left: maxBudgetIn, budget_out_left: maxBudgetOut, exp: Date.now() + 600000 };
    jtiUsageMap.set(jti, usage);
  }

  if (tokensInUsed > usage.budget_in_left) {
    return {
      allowed: false,
      remainingIn: usage.budget_in_left,
      remainingOut: usage.budget_out_left,
      reason: 'budget_in_exceeded'
    };
  }

  if (tokensOutUsed > usage.budget_out_left) {
    return {
      allowed: false,
      remainingIn: usage.budget_in_left,
      remainingOut: usage.budget_out_left,
      reason: 'budget_out_exceeded'
    };
  }

  usage.budget_in_left -= tokensInUsed;
  usage.budget_out_left -= tokensOutUsed;

  return {
    allowed: true,
    remainingIn: usage.budget_in_left,
    remainingOut: usage.budget_out_left
  };
}

export function getGrantUsage(jti: string, defaultIn: number, defaultOut: number) {
  const usage = jtiUsageMap.get(jti);
  if (!usage) {
    return { remainingIn: defaultIn, remainingOut: defaultOut };
  }
  return { remainingIn: usage.budget_in_left, remainingOut: usage.budget_out_left };
}
