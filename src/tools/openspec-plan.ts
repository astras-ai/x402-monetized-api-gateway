// Tool Adapter: OpenSpec Proposal Plan Generator
import { runNemotron } from '../nemotron';

export async function handleOpenSpecPlan(env: any, body: any) {
  const goal = body?.goal || body?.prompt || 'Build an x402 Gateway';
  const result = await runNemotron(env, { ...body, goal }, 'openspec');

  return {
    ok: true,
    tool: 'openspec.plan',
    goal,
    spec: result.result,
    usage: result.usage,
    model: result.model,
    provider: result.provider,
    timestamp: new Date().toISOString()
  };
}
