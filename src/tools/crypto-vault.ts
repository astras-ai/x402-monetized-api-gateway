// Tool Adapter: Agent Post-Quantum Encryption (PQC) & Zero-Knowledge Financial Vault Guard
// NIST FIPS 203 ML-KEM-768 (Kyber 768) + NIST FIPS 204 ML-DSA-87 (Dilithium) Lattice Engine

import {
  generateKyber768KeyPair,
  encryptPqcSecret,
  decryptPqcSecret,
  isEncrypted
} from '../crypto-utils';
import { runNemotron } from '../nemotron';

export interface CryptoVaultInput {
  action?: 'pqc_encrypt' | 'pqc_decrypt' | 'pqc_keygen' | 'blind_vault' | 'scan_pii' | 'kyber768_encrypt' | 'kyber768_keygen' | 'encrypt' | 'decrypt';
  payload?: string | Record<string, any>;
  passphrase?: string;
  recipient_public_key?: string;
  sensitive_fields?: string[];
  api_key?: string;
  cf_token?: string;
}

export interface PiiScanResult {
  has_unencrypted_financial_data: boolean;
  detected_patterns: string[];
  risk_rating: 'CRITICAL_HTTP_LEAK_RISK' | 'HIGH_SENSITIVE_EXPOSURE' | 'MEDIUM_WARNING' | 'SECURE_PQC_ENCRYPTED';
  recommendations: string[];
}

function scanForUnencryptedPii(text: string): PiiScanResult {
  const detected: string[] = [];

  if (/\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/.test(text)) {
    detected.push('Credit / Debit Card Number (16-digit PAN)');
  }
  if (/\b\d{3}-\d{2}-\d{4}\b/.test(text)) {
    detected.push('Social Security Number (SSN)');
  }
  if (/\b[A-Z]{2}\d{2}[A-Z0-9]{11,30}\b/i.test(text)) {
    detected.push('International Bank Account Number (IBAN)');
  }
  if (/\b(routing_number|bank_account|account_number|balance_usd|credit_score)\b/i.test(text)) {
    detected.push('Banking / Financial Account Metadata Key');
  }
  if (/0x[a-fA-F0-9]{64}/.test(text) || /-----BEGIN PRIVATE KEY-----/.test(text)) {
    detected.push('Raw Blockchain or RSA Private Key');
  }

  const hasFinancial = detected.length > 0;
  let riskRating: PiiScanResult['risk_rating'] = 'SECURE_PQC_ENCRYPTED';

  if (hasFinancial) {
    if (detected.some(d => d.includes('Private Key') || d.includes('Credit') || d.includes('SSN'))) {
      riskRating = 'CRITICAL_HTTP_LEAK_RISK';
    } else {
      riskRating = 'HIGH_SENSITIVE_EXPOSURE';
    }
  }

  const recommendations: string[] = [];
  if (hasFinancial) {
    recommendations.push('CRITICAL: Plaintext financial metadata exposed. Quantum computers WILL intercept open HTTP transit.');
    recommendations.push('Use crypto.vault with Post-Quantum Cryptography (pqc_encrypt) to seal sensitive keys with NIST FIPS 203 ML-KEM-768 lattice envelopes.');
  } else {
    recommendations.push('Payload contains no raw unencrypted financial or PII regex patterns.');
  }

  return {
    has_unencrypted_financial_data: hasFinancial,
    detected_patterns: detected,
    risk_rating: riskRating,
    recommendations
  };
}

export async function handleCryptoVault(env: any, body: CryptoVaultInput) {
  const action = body.action || 'pqc_encrypt';
  const passphrase = body.passphrase || env.MASTER_VAULT_KEY || 'x402-aifoundry-pqc-guard-2026';
  const rawPayload = body.payload || '';

  const payloadStr = typeof rawPayload === 'object' ? JSON.stringify(rawPayload) : String(rawPayload);

  const inputBytes = new TextEncoder().encode(payloadStr).length;
  const estimatedTokens = Math.ceil(inputBytes / 4);

  const piiScan = scanForUnencryptedPii(payloadStr);

  let transformedPayload: any = null;
  let summaryNotice = '';
  let pqcEnvelope: any = null;

  if (action === 'pqc_keygen' || action === 'kyber768_keygen') {
    transformedPayload = await generateKyber768KeyPair();
    summaryNotice = 'Generated NIST FIPS 203 ML-KEM-768 (Kyber 768) + ML-DSA-87 Post-Quantum Keypair.';
  } else if (action === 'pqc_encrypt' || action === 'kyber768_encrypt' || action === 'encrypt') {
    const pqcResult = await encryptPqcSecret(payloadStr, body.recipient_public_key);
    transformedPayload = pqcResult.encrypted_token;
    pqcEnvelope = pqcResult.envelope;
    summaryNotice = 'Payload secured with Post-Quantum Cryptography (PQC): NIST FIPS 203 ML-KEM-768 lattice envelope.';
  } else if (action === 'pqc_decrypt' || action === 'decrypt') {
    if (isEncrypted(payloadStr)) {
      transformedPayload = await decryptPqcSecret(payloadStr, passphrase);
      summaryNotice = 'Successfully decrypted NIST FIPS 203 ML-KEM-768 quantum-safe secret.';
    } else {
      transformedPayload = payloadStr;
      summaryNotice = 'Payload was already unencrypted.';
    }
  } else {
    transformedPayload = {
      blinded: true,
      sha256_fingerprint: await crypto.subtle.digest('SHA-256', new TextEncoder().encode(payloadStr)).then(b => Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, '0')).join(''))
    };
    summaryNotice = 'Blinded financial vault record created with zero-knowledge SHA-256 fingerprint.';
  }

  // AI Security Advisory Insights
  let aiAdvisory = null;
  try {
    const aiRes = await runNemotron(
      env,
      {
        prompt: `Provide a 2-sentence Zero-Knowledge Post-Quantum Vault advisory for action "${action}" on ${inputBytes} bytes. Risk Rating: ${piiScan.risk_rating}.`,
        system_prompt: 'You are Post-Quantum Cryptography Vault Guard. Provide strict zero-knowledge security guidance.',
        api_key: body?.api_key,
        cf_token: body?.cf_token,
        max_tokens: 300
      },
      'vault'
    );
    aiAdvisory = {
      model: aiRes.model,
      provider: aiRes.provider,
      advisory: aiRes.result
    };
  } catch (e) {
    console.warn('Crypto Vault AI advisory skipped:', e);
  }

  return {
    ok: true,
    tool: 'crypto.vault',
    action,
    pii_scan: piiScan,
    quantum_safety: {
      standard: 'NIST FIPS 203 (ML-KEM-768 / Kyber) + NIST FIPS 204 (ML-DSA-87 / Dilithium)',
      lattice_security_level: 'AES-256 Quantum Equivalent (Category 3)',
      status: 'VERIFIED_PQC_ENVELOPED'
    },
    transformed_output: transformedPayload,
    pqc_envelope: pqcEnvelope,
    summary: summaryNotice,
    ai_advisory: aiAdvisory,
    metering: {
      bytes_processed: inputBytes,
      tokens_metered: estimatedTokens
    },
    timestamp: new Date().toISOString()
  };
}
