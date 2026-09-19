# TEST-TONIGHT.md — Live Verification Checklist

Set target URL:
```bash
export URL=https://aifoundry-x402.workers.dev
```

## Checklist

- [x] **D1 Health Verification**
  ```bash
  curl -sS $URL/health
  # Must return 200, pay_to_configured boolean, and NO '0x' wallet leakage
  ```

- [x] **D1 Catalog Route**
  ```bash
  curl -sS $URL/
  # Must list available tool endpoints and SKUs (T10K, M10)
  ```

- [x] **D1 Unpaid OpenSpec Plan (HTTP 402)**
  ```bash
  curl -i -X POST $URL/v1/tools/openspec.plan \
    -H 'content-type: application/json' \
    -d '{"goal":"prove x402 tonight"}'
  # Expected: HTTP 402 Payment Required with X-402 headers
  ```

- [x] **D1 Unpaid Nemotron Chat (HTTP 402)**
  ```bash
  curl -i -X POST $URL/v1/tools/nemotron.chat \
    -H 'content-type: application/json' \
    -d '{"prompt":"ping"}'
  # Expected: HTTP 402 Payment Required with X-402 headers
  ```

- [x] **D2 Scoped Token Verification**
  - Paid or mock header `Authorization: Bearer <HMAC_JWT>`
  - Expected: HTTP 200 with headers `X-AIFoundry-Sku`, `X-AIFoundry-Budget-Remaining`, `X-AIFoundry-Jti`

- [x] **D3 First Real Tool Exec (Nemotron / OpenSpec)**
  - Unpaid: 402
  - Paid: 200 with structured OpenSpec output or Nemotron response
