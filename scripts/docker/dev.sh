#!/bin/bash

set -e

echo "🚢 Starting Shopify Theme Dev Server in Docker..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found. Using defaults."
    echo "   Create .env from .env.example for custom configuration."
fi

echo "📦 Starting Docker container..."
docker compose run --rm --service-ports node-dev npx shopify theme dev --host 0.0.0.0

echo "✅ Dev server stopped"
