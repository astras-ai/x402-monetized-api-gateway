#!/usr/bin/env bash
# audit-wrangler.sh — CI script to verify secrets are NOT committed into wrangler config files

set -euo pipefail

echo "==> Running AIFoundry.sh Wrangler Secrets Audit..."

ERRORS=0

# Check wrangler files
CONFIG_FILES=$(find . -maxdepth 2 -name "wrangler.json" -o -name "wrangler.jsonc" -o -name "wrangler.toml" 2>/dev/null || true)

for file in $CONFIG_FILES; do
  if [ -f "$file" ]; then
    echo "Checking $file..."
    
    if grep -i -E "PAY_TO\s*=" "$file" || grep -i -E '"PAY_TO"\s*:' "$file"; then
      echo "❌ ERROR: Found PAY_TO in $file! Secret wallets must be configured via 'wrangler secret put PAY_TO'."
      ERRORS=$((ERRORS + 1))
    fi

    if grep -i -E "0x71C7656EC7ab88b098defB751B7401B5f6d8976F" "$file"; then
      echo "❌ ERROR: Found unsafe public tutorial address in $file!"
      ERRORS=$((ERRORS + 1))
    fi

    if grep -i -E "JWT_SECRET\s*=" "$file" || grep -i -E '"JWT_SECRET"\s*:' "$file"; then
      echo "❌ ERROR: Found JWT_SECRET in $file! Secrets must be put in Cloudflare Secrets."
      ERRORS=$((ERRORS + 1))
    fi
  fi
done

if [ $ERRORS -gt 0 ]; then
  echo "❌ Audit failed with $ERRORS error(s)."
  exit 1
else
  echo "✅ Wrangler secrets audit passed clean! No sensitive keys found in configuration files."
  exit 0
fi
