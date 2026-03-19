#!/bin/bash

# Design Studio - Run Vite dev server for HTML prototyping
# Usage: ./scripts/docker/design.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo "🎨 Starting Design Studio..."
echo "📁 Project: $PROJECT_ROOT"
echo ""

cd "$PROJECT_ROOT"

if [ ! -d "design" ]; then
    echo "❌ Error: design/ folder not found"
    exit 1
fi

docker compose run --rm \
    --service-ports \
    -e NODE_ENV=development \
    node-dev \
    npm run design
