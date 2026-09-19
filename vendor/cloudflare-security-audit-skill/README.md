# Cloudflare Security Audit Skill
Upstream Repository: https://github.com/cloudflare/security-audit-skill

## Overview
Automated security auditor for Cloudflare Workers, Wrangler configuration files, Durable Objects, and secret management.
Integrated into AIFoundry.sh as `/v1/tools/audit.cf` with x402 capability-gated verification.

## Features
- Scans `wrangler.json` / `wrangler.toml` for exposed environment variables
- Detects unsafe private keys or hardcoded tutorial wallet addresses
- Validates CORS header safety and DDoS rate limit policies
- Provides zero-trust security compliance score (0 - 100)
