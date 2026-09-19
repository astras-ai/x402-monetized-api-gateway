// AES-256-GCM Encryption & Decryption Utility for Cloudflare Workers & Browser Runtimes

const ENCRYPTION_PREFIX = 'enc:v1:';
const DEFAULT_PASSPHRASE = 'aifoundry-master-vault-2026';

/**
 * Derives a CryptoKey from a passphrase using SHA-256
 */
async function deriveKey(passphrase: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const passphraseBytes = enc.encode(passphrase || DEFAULT_PASSPHRASE);
  const hash = await crypto.subtle.digest('SHA-256', passphraseBytes);
  return crypto.subtle.importKey(
    'raw',
    hash,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts a plaintext secret value using AES-256-GCM.
 * Returns string in format: enc:v1:<base64-payload>
 */
export async function encryptSecret(plaintext: string, passphrase?: string): Promise<string> {
  if (!plaintext) return '';
  if (plaintext.startsWith(ENCRYPTION_PREFIX)) {
    // Already encrypted
    return plaintext;
  }

  try {
    const key = await deriveKey(passphrase || DEFAULT_PASSPHRASE);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const encodedText = enc.encode(plaintext);

    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encodedText
    );

    const payload = {
      iv: Array.from(iv),
      ct: Array.from(new Uint8Array(ciphertext))
    };

    const b64 = btoa(JSON.stringify(payload));
    return `${ENCRYPTION_PREFIX}${b64}`;
  } catch (err) {
    console.error('Encryption failed:', err);
    throw new Error('Failed to encrypt secret value.');
  }
}

/**
 * Decrypts an encrypted secret string (enc:v1:<base64>).
 * Returns original plaintext string.
 */
export async function decryptSecret(encryptedStr: string, passphrase?: string): Promise<string> {
  if (!encryptedStr) return '';
  if (!encryptedStr.startsWith(ENCRYPTION_PREFIX)) {
    // Plaintext or unencrypted
    return encryptedStr;
  }

  try {
    const b64 = encryptedStr.substring(ENCRYPTION_PREFIX.length);
    const jsonStr = atob(b64);
    const payload = JSON.parse(jsonStr);

    const iv = new Uint8Array(payload.iv);
    const ciphertext = new Uint8Array(payload.ct);

    const key = await deriveKey(passphrase || DEFAULT_PASSPHRASE);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );

    const dec = new TextDecoder();
    return dec.decode(decrypted);
  } catch (err) {
    console.warn('Decryption failed with passphrase:', err);
    throw new Error('Decryption failed. Invalid passphrase or corrupted cipher payload.');
  }
}

/**
 * Helper to check if string is encrypted
 */
export function isEncrypted(val: string): boolean {
  return typeof val === 'string' && val.startsWith(ENCRYPTION_PREFIX);
}
