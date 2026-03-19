#!/bin/bash

set -e

echo "⚡ Starting Vite Development Server in Docker..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found."
fi

echo "📦 Starting Docker container..."
echo "🌐 Vite will be available at http://localhost:3000"
docker compose run --rm --service-ports node-dev npm run dev

echo "✅ Vite server stopped"
