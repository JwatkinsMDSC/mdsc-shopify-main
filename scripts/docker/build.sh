#!/bin/bash

set -e

echo "🔨 Building Production Assets in Docker..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "📦 Running build in Docker container..."
docker compose run --rm node-dev npm run build

echo ""
echo "✅ Build completed successfully!"
echo "📁 Assets generated in: ./assets/"
echo ""
ls -lh assets/global.* 2>/dev/null || echo "⚠️  No global assets found"
