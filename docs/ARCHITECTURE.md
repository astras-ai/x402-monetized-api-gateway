# AIFoundry.sh Architecture

```
  Agents / Curl / Web Browser
               |
               v
     Cloudflare Worker (aifoundry-x402)
     Hono + x402-hono Middleware
     + Session HMAC JWT Manager
               |
               v
     /v1/tools/* Gatekeeper
     ├── openspec.plan (Nemotron AI Engine)
     ├── nemotron.chat (Nemotron AI Engine)
     ├── review.kimi (Kimi Code Auditor)
     ├── audit.cf (Wrangler Audit Skill)
     └── design.402 (OpenDesign UI Spec)
```

## Layers

1. **Edge Paywall:** Standard HTTP 402 Payment Required headers with x402 facilitator challenges on Base / Base Sepolia / Solana.
2. **Capability Token Issuer:** Mints 10-minute HMAC JWT carrying `budget_in`, `budget_out`, and unique `jti`.
3. **Tool Adapters:** Modular task execution adapters with input/output token metering.
4. **Resilient Isolate Metering:** Isolate memory JTI state map with budget headers on every 200 response.
