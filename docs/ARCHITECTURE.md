# AIFoundry.sh Architecture

```
  Agents / Curl / Autonomous Web Apps
               |
               v
     Cloudflare Worker (aifoundry-x402)
     Hono + x402 Header Gatekeeper
     + WebCrypto Hardware Engine
               |
               v
     /v1/tools/* Service Gatekeeper
     ├── openspec.plan (Nemotron AI Engine)
     ├── nemotron.chat (Nemotron AI Edge Proxy)
     ├── review.kimi   (Kimi Code Auditor)
     ├── audit.cf      (Workers Security Audit Skill)
     ├── crypto.vault  (WebCrypto Zero-Knowledge Vault Guard)
     └── design.402    (OpenDesign UI Spec Engine)
```

## Core Architecture Layers

1. **Edge Paywall:** Standard HTTP 402 Payment Required headers with x402 challenges on Base, Base Sepolia, Solana, Polygon, and Arbitrum.
2. **WebCrypto Zero-Knowledge Isolate:** Hardware-accelerated AES-256-GCM encryption & PII scanning for sensitive agent context (financial records, credit card numbers, IBANs, SSNs, API secrets).
3. **Capability Token Issuer:** Mints 10-minute HMAC JWT carrying `budget_in`, `budget_out`, and unique `jti`.
4. **Tool Adapters:** Modular task execution adapters with exact token metering & itemized receipts.
5. **Resilient Isolate Metering:** Isolate memory JTI state map returning budget headers on every 200 response.
