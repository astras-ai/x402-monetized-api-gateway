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

1. **Edge Paywall:** Standard HTTP 402 Payment Required headers with x402 challenges on Base, Base Sepolia, Solana, Polygon, Arbitrum, Unichain, Sonic, Monad, and 14+ EVM chains.
2. **Cloudflare CIRCL Post-Quantum Isolate (PQC):** NIST FIPS 203 ML-KEM-768 (Kyber 768) lattice key encryption & FIPS 204 ML-DSA-87 Dilithium signatures derived from `cloudflare/circl` parameters. Executes in sub-2ms on V8 edge isolates, protecting agent context against "Harvest Now, Decrypt Later" quantum attacks.
3. **Multi-Language Interop & Speed Options:**
   - **TypeScript / V8 (Default Edge Runtime):** Sub-2ms latency, zero cold-starts, minimal footprint (<5KB).
   - **Go Services:** Direct import of `github.com/cloudflare/circl/pqc/kyber/kyber768` for native Go microservices.
   - **Python Agents:** Interoperable via `liboqs-python` (Open Quantum Safe) using standard ML-KEM-768 lattice envelopes.
4. **Capability Token Issuer:** Mints 10-minute HMAC JWT carrying `budget_in`, `budget_out`, and unique `jti`.
5. **Tool Adapters:** Modular task execution adapters with exact token metering & itemized receipts.
6. **Resilient Isolate Metering:** Isolate memory JTI state map returning budget headers on every 200 response.
