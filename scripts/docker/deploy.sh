#!/bin/bash

set -e

echo "🚀 Deploying MDS Theme to Shopify Store"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

STORE=""
ALL_STORES=false
BUILD_FIRST=true

for arg in "$@"; do
    case $arg in
        --store=*)
            STORE="${arg#*=}"
            shift
            ;;
        --all)
            ALL_STORES=true
            shift
            ;;
        --no-build)
            BUILD_FIRST=false
            shift
            ;;
        *)
            ;;
    esac
done

if [ "$BUILD_FIRST" = true ]; then
    echo "🔨 Building assets first..."
    docker compose run --rm node-dev npm run build
    echo ""
fi

if [ -z "$STORE" ] && [ "$ALL_STORES" = false ]; then
    echo "❌ Error: No store specified!"
    echo ""
    echo "Usage:"
    echo "  ./scripts/docker/deploy.sh --store=STORE_NAME"
    echo "  ./scripts/docker/deploy.sh --all"
    echo ""
    echo "Options:"
    echo "  --store=NAME    Deploy to specific store"
    echo "  --all           Deploy to all configured stores"
    echo "  --no-build      Skip building assets"
    echo ""
    exit 1
fi

if [ "$ALL_STORES" = true ]; then
    echo "📦 Deploying to all stores..."
    docker compose run --rm node-dev node ./scripts/deploy.js --all
else
    echo "📦 Deploying to store: $STORE"
    docker compose run --rm node-dev node ./scripts/deploy.js --store="$STORE"
fi

echo ""
echo "✅ Deployment completed!"
