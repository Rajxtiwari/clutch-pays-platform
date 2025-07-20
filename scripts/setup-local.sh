#!/bin/bash

echo "🚀 Setting up Clutch Pays for local development..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from template..."
    cp .env.example .env.local
    echo "✅ Please edit .env.local with your Convex URL"
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Check if Convex is configured
if [ ! -d ".convex" ]; then
    echo "🔧 Convex not configured. Please run:"
    echo "   npx convex login"
    echo "   npx convex dev"
    echo ""
    echo "This will create your Convex project and update .env.local"
else
    echo "✅ Convex already configured"
fi

echo ""
echo "🎮 To start development:"
echo "   Terminal 1: npx convex dev"
echo "   Terminal 2: pnpm dev"
echo ""
echo "🐳 Or use Docker:"
echo "   docker-compose up -d"
echo ""
echo "📖 See LOCAL_SETUP.md for detailed instructions"
