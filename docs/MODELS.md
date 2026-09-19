# Models Specification & Cloudflare Workers AI TypeScript Binding

The x402 Gateway connects directly to **Cloudflare Workers AI** via `env.AI.run(model, payload, options)` with AI Gateway binding (`{ gateway: { id: "default" } }`).

### Supported Workers AI Model Identifier Syntax
Any valid `@cf/...` model identifier can be passed directly in the JSON request body under the `"model"` key:

| Service / Identifier | Description | Model String Example |
|---|---|---|
| **GPT-6 Astra (Workers AI)** | Cloudflare Workers AI Next-Gen OpenAI Model | `@cf/openai/gpt-6-astra` |
| **DeepSeek V4 Pro (Workers AI)** | DeepSeek Reasoning & Coding Engine | `@cf/deepseek/deepseek-v4-pro` |
| **Llama 3.1 8B Instruct** | Ultra-Fast Edge Inference | `@cf/meta/llama-3.1-8b-instruct-fast` |
| **DeepSeek R1 Distill 32B** | Advanced Code & Architectural Reasoning | `@cf/deepseek-ai/deepseek-r1-distill-qwen-32b` |
| **Llama 3.3 70B Instruct** | High-Capacity Fast Edge LLM | `@cf/meta/llama-3.3-70b-instruct-fp8-fast` |
| **Nvidia Nemotron 120B** | Dense Agentic Reasoning | `@cf/nvidia/nemotron-3-120b-a12b` |

### Cloudflare Workers AI TypeScript Call Specification
In Cloudflare Workers, the API call follows the official Cloudflare Workers AI SDK format:

```typescript
export interface Env {
  AI: Ai;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const response = await env.AI.run(
      "@cf/openai/gpt-6-astra", // or "@cf/deepseek/deepseek-v4-pro"
      {
        messages: [
          { role: "system", content: "You are a specialized x402 edge agent." },
          { role: "user", content: "Generate software architecture for x402 gateway." }
        ],
        max_tokens: 1024
      },
      {
        gateway: {
          id: "default", // AI Gateway ID
          skipCache: false
        }
      }
    );

    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" }
    });
  }
} satisfies ExportedHandler<Env>;
```

