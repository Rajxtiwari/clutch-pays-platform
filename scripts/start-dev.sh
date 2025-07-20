#!/bin/bash

echo "🚀 Starting Clutch Pays Development Servers..."

# Kill any existing processes
echo "🔄 Stopping existing processes..."
killall node 2>/dev/null || true
killall convex 2>/dev/null || true

# Wait a moment
sleep 2

echo "📦 Installing dependencies..."
pnpm install

echo "🔧 Starting Convex backend..."
# Start Convex in background
npx convex dev &
CONVEX_PID=$!

# Wait for Convex to initialize
echo "⏳ Waiting for Convex to initialize..."
sleep 10

echo "🌐 Starting frontend server..."
# Start Vite dev server
pnpm dev &
VITE_PID=$!

echo "✅ Development servers started!"
echo "🔧 Convex Backend: PID $CONVEX_PID"
echo "🌐 Frontend: PID $VITE_PID"
echo "📱 Website: http://localhost:5173"
echo ""
echo "To stop servers: kill $CONVEX_PID $VITE_PID"

# Wait for user input to stop
read -p "Press Enter to stop all servers..."

echo "🛑 Stopping servers..."
kill $CONVEX_PID 2>/dev/null || true
kill $VITE_PID 2>/dev/null || true

echo "✅ All servers stopped!"
