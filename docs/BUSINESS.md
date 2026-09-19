# Business Model & SKUs

AIFoundry.sh provides prepaid, metered x402 edge API capabilities for autonomous AI agents and developers.

## Gateway SKUs & Pricing Strategy

| SKU | Price (USDC) | Scope / Token Cap | Margin | Target Use Case |
|---|---|---|---|---|
| **`T10K`** | **$0.05 USDC** | Up to 10,000 input/output tokens | **≥ 3x COGS** | Architecture specs, Code reviews, Security audits |
| **`M10`** | **$0.05 USDC** | 10 minutes wall-clock execution budget | **≥ 3x COGS** | Sub-20ms edge chat proxy, UI generation |
| **`CRYPT`** | **$0.05 USDC** | 50 KB payload hardware WebCrypto isolation | **≥ 12x COGS** | Zero-knowledge payload encryption & financial data blinding |

---

## Unit Economics & Profit Margin per Call

| AI Tool ID | Upstream / Edge Engine | Gateway Price | Vendor COGS | Net Profit / Call | Gross Margin % |
|---|---|---|---|---|---|
| **`openspec.plan`** | DeepSeek R1 + Fission OpenSpec | $0.0500 | $0.0075 | +$0.0425 | **85.0%** (6.6x) |
| **`review.kimi`** | Alibaba Open Code Review AST | $0.0500 | $0.0095 | +$0.0405 | **81.0%** (5.2x) |
| **`audit.cf`** | Cloudflare Security Audit Scanner | $0.0500 | $0.0040 | +$0.0460 | **92.0%** (12.5x) |
| **`crypto.vault`** | WebCrypto AES-256 Edge Isolate | $0.0500 | $0.0002 | +$0.0498 | **99.6%** (250x) |
| **`design.402`** | OpenDesign UI Specs | $0.0500 | $0.0065 | +$0.0435 | **87.0%** (7.7x) |
| **`nemotron.chat`** | Workers AI Llama-3-70B Edge | $0.0500 | $0.0025 | +$0.0475 | **95.0%** (20.0x) |

---

## Security Rationale: Why Agents Need `crypto.vault`

Autonomous AI agents carrying banking credentials, user PII, SSNs, credit card numbers, or auth tokens cannot safely transmit raw contextual data across open HTTP headers or unencrypted agent storage.

1. **HTTP Leak Risk:** Agents walking between multi-tenant web endpoints with raw financial data on HTTP headers expose humans to credential theft and logging leaks.
2. **Zero-Knowledge Field Blinding:** `crypto.vault` allows agents to blind sensitive fields into AES-256-GCM tokens (`enc:v1:...`) on Cloudflare's WebCrypto hardware edge isolate.
3. **High Margin Revenue:** Micro-charges of $0.05 per encryption run yield an outstanding **99.6% gross margin** because Cloudflare Workers WebCrypto subroutines execute in under 5ms with negligible computing overhead.
