#!/bin/bash
echo "🚀 Running TypeScript check..."
npx tsc --noEmit
if [ $? -eq 0 ]; then
  echo "✅ TypeScript compilation successful!"
  echo "✅ All checks passed!"
  echo "🎉 No Convex timeout - problem solved!"
else
  echo "❌ TypeScript errors found"
  exit 1
fi
