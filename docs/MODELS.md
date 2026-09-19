# Models Specification

| Service | Primary Model / Origin | Fallback Model |
|---|---|---|
| **Nemotron Chat** | `@cf/nvidia/nemotron-3-120b-a12b` | `@cf/meta/llama-3.1-8b-instruct` |
| **OpenSpec Generator** | `NEMOTRON_URL` (cloudflared) or Workers AI | Embedded High-Fidelity LLM Engine |
| **OpenDesign / Human** | DeepSeek R1 Distill Qwen 32B | High-Fidelity Embedded Engine |
| **Review Kimi** | Alibaba Open-Code-Review Wrap | Embedded Metered Auditor |
