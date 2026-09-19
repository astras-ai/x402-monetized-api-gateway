# OpenSpec Proposal: Add x402 Edge Gate & Scoped HMAC Capability Tokens

## Why
API endpoints monetized via x402 need scoped, time-bound session capability tokens rather than static long-lived vendor API keys.

## What
- Implement Hono middleware intercepting `/v1/tools/*`.
- Issue HMAC JWT carrying `budget_in`, `budget_out`, and `jti`.
- Provide decremental usage tracking on every HTTP 200 response.

## Impact
Zero vendor key leakage, cryptographic tamper protection, and instant micropayment verification on Cloudflare Workers.
