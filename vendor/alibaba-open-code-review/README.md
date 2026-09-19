# Alibaba Open Code Review Engine (Kimi AI Integration)
Upstream Repository: https://github.com/alibaba/open-code-review

## Overview
Automated AI-assisted code review engine powered by Alibaba Kimi & DeepSeek models.
Integrated into AIFoundry.sh as `/v1/tools/review.kimi` with x402 pay-per-review token receipts.

## Features
- Code diff AST analysis
- Security vulnerability pattern detection
- Strict input/output token usage metering & receipt output
- Automated recommendations for x402 compliance

## Local Engine Schema
```typescript
export interface ReviewResult {
  ok: boolean;
  tool: string;
  language: string;
  tokens_analyzed: number;
  review_summary: string;
  findings: Array<{
    severity: 'CRITICAL' | 'HIGH' | 'LOW' | 'INFO' | 'PASSED';
    category: string;
    message: string;
  }>;
  receipt: {
    tokens_in: number;
    tokens_out: number;
    total_tokens: number;
    meter_status: string;
  };
}
```
