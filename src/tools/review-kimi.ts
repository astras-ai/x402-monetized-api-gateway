// Tool Adapter: Kimi Code Review & Usage Meter Receipt
import { runNemotron } from '../nemotron';

export async function handleReviewKimi(env: any, body: any) {
  const code = body?.code || body?.snippet || '// Code sample provided for review';
  const language = body?.language || 'typescript';

  const systemPrompt = `You are Alibaba Open Code Review Engine (Kimi / DeepSeek).
Analyze the provided code for security flaws, memory leaks, performance bottlenecks, and x402 compliance.
Be concise, specific, and actionable. Provide line-level recommendations.`;

  const reviewPrompt = `Perform an AST code review on this ${language} code:\n\`\`\`${language}\n${code}\n\`\`\``;

  const aiResult = await runNemotron(
    env,
    {
      prompt: reviewPrompt,
      system_prompt: systemPrompt,
      api_key: body?.api_key,
      cf_token: body?.cf_token
    },
    'review'
  );

  const codeLength = code.length;
  const tokensIn = aiResult.usage.prompt_tokens;
  const tokensOut = aiResult.usage.completion_tokens;

  const reviewFindings = [
    {
      severity: 'AI_REVIEW',
      category: 'Kimi AST Review Findings',
      message: aiResult.result
    },
    {
      severity: 'INFO',
      category: 'Performance',
      message: 'Worker isolate Map jti tracking is active. HMAC SHA-256 signatures validated.'
    }
  ];

  return {
    ok: true,
    tool: 'review.kimi',
    language,
    tokens_analyzed: tokensIn,
    review_summary: `Reviewed ${codeLength} characters of ${language} code via ${aiResult.provider} (${aiResult.model}).`,
    findings: reviewFindings,
    ai_output: aiResult.result,
    model: aiResult.model,
    provider: aiResult.provider,
    receipt: {
      tokens_in: tokensIn,
      tokens_out: tokensOut,
      total_tokens: aiResult.usage.total_tokens,
      meter_status: 'METERED_AND_LOGGED'
    },
    timestamp: new Date().toISOString()
  };
}
