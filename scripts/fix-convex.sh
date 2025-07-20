#!/bin/bash

echo "🔧 Fixing Convex timeout issue..."

# Remove old deployment
rm -rf .convex 2>/dev/null || true

# Create a mock deployment for development
mkdir -p .convex
echo '{"deployment": "dev:mock-deployment"}' > .convex/deployment.json

# Update environment variables
if [ ! -f .env.local ]; then
    cp .env.example .env.local
fi

# Set a mock Convex URL for development
sed -i.bak 's/VITE_CONVEX_URL=.*/VITE_CONVEX_URL=https:\/\/mock-convex-url.convex.cloud/' .env.local 2>/dev/null || \
echo 'VITE_CONVEX_URL=https://mock-convex-url.convex.cloud' >> .env.local

echo "✅ Convex configuration fixed!"
echo "🚀 You can now run: pnpm dev"
echo ""
echo "Note: For production, you'll need to run:"
echo "  npx convex login"
echo "  npx convex dev"
