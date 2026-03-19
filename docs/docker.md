# Docker Development Environment

**Marine Detail Supply Global Theme Framework - Docker Setup Guide**

This guide covers how to use Docker for consistent, reproducible development of the MDS Shopify theme across all machines and team members.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Docker Architecture](#docker-architecture)
- [Helper Scripts](#helper-scripts)
- [Shopify CLI Integration](#shopify-cli-integration)
- [Common Workflows](#common-workflows)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

---

## Prerequisites

### Required Software

1. **Docker Desktop** (macOS/Windows) or **Docker Engine** (Linux)
   - Download: https://www.docker.com/products/docker-desktop/
   - Minimum version: Docker 20.10+
   - Docker Compose v3.8+

2. **Git**
   - For cloning the repository

3. **Terminal/Command Line**
   - macOS: Terminal
   - Windows: WSL2 + Ubuntu (recommended) or PowerShell
   - Linux: Any terminal

### System Requirements

- **RAM**: 4GB minimum, 8GB recommended
- **Disk Space**: 5GB free space
- **Ports Available**: 3000, 5173, 9292

---

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mdsc-shopify-theme
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and set your Shopify store details:

```bash
SHOPIFY_STORE_URL=your-store.myshopify.com
SHOPIFY_CLI_THEME_ID=<your-theme-id>
```

### 3. Build Docker Container

```bash
docker compose build
```

This will:
- Pull Node 20 base image
- Install Ruby, Shopify CLI, and Theme Check
- Install all npm dependencies
- Set up the development environment

Build time: ~5-10 minutes (first time only)

### 4. Start Development

#### Option A: Vite Dev Server (for asset development)

```bash
./scripts/docker/vite.sh
```

Access at: http://localhost:3000

#### Option B: Shopify Theme Dev Server (for full theme preview)

```bash
./scripts/docker/dev.sh
```

Follow the authentication prompts to connect to your Shopify store.

---

## Docker Architecture

### Services

#### **node-dev** (Main Development Service)

- **Purpose**: Primary development environment
- **Base Image**: Node 20 LTS (Debian Bullseye)
- **Includes**: 
  - Node.js & npm
  - Shopify CLI
  - Ruby & Theme Check gem
  - Git
- **Ports**:
  - 3000: Vite dev server
  - 5173: Alternative Vite port
  - 9292: Shopify CLI tunnel
- **Volumes**:
  - Project directory → `/workspace`
  - Node modules (anonymous volume for performance)
  - Shopify credentials → `~/.shopify`

#### **theme-check** (Linting Service)

- **Purpose**: Run Shopify theme validation
- **Base Image**: Same as node-dev
- **Command**: `theme-check .`
- **Usage**: `docker compose run theme-check`

### Volume Mounts

```yaml
volumes:
  - .:/workspace                          # Your project code
  - /workspace/node_modules               # Anonymous volume for speed
  - ~/.shopify:/home/node-user/.shopify   # Persisted auth credentials
```

**Why anonymous volumes?**
- Prevents node_modules sync issues between host and container
- Dramatically improves performance on macOS and Windows
- Preserves container-native binaries

---

## Helper Scripts

All helper scripts are located in `scripts/docker/` and are executable bash scripts.

### **./scripts/docker/dev.sh**

**Purpose**: Start Shopify Theme Dev Server

```bash
./scripts/docker/dev.sh
```

**What it does**:
1. Validates `.env` configuration
2. Starts Docker container
3. Runs `shopify theme dev`
4. Opens a tunnel to your Shopify store
5. Enables hot reload for theme changes

**Use when**: You want to preview your theme on a live Shopify store with real data.

---

### **./scripts/docker/vite.sh**

**Purpose**: Start Vite Development Server

```bash
./scripts/docker/vite.sh
```

**What it does**:
1. Starts Vite in watch mode
2. Compiles Tailwind CSS
3. Bundles JavaScript modules
4. Enables Hot Module Replacement (HMR)

**Use when**: You're developing custom JavaScript or Tailwind styles and want instant feedback.

**Access**: http://localhost:3000

---

### **./scripts/docker/build.sh**

**Purpose**: Build Production Assets

```bash
./scripts/docker/build.sh
```

**What it does**:
1. Runs Vite production build
2. Compiles and minifies Tailwind CSS
3. Bundles and minifies JavaScript
4. Outputs to `assets/global.css` and `assets/global.js`

**Use when**: You're ready to deploy changes to production.

**Output**:
- `assets/global.css` (~38KB minified)
- `assets/global.js` (~106KB minified)

---

### **./scripts/docker/deploy.sh**

**Purpose**: Deploy Theme to Shopify Store

```bash
# Deploy to specific store
./scripts/docker/deploy.sh --store=headquarters

# Deploy to all configured stores
./scripts/docker/deploy.sh --all

# Deploy without rebuilding assets
./scripts/docker/deploy.sh --store=miami --no-build
```

**Options**:
- `--store=NAME`: Deploy to specific store (required if not using --all)
- `--all`: Deploy to all stores in `config/stores/`
- `--no-build`: Skip asset build step

**What it does**:
1. Builds production assets (unless --no-build)
2. Reads store configuration from `config/stores/`
3. Runs deployment script
4. Uses Shopify CLI to push theme

---

## Shopify CLI Integration

### First-Time Authentication

When you run `./scripts/docker/dev.sh` for the first time, you'll need to authenticate:

```bash
./scripts/docker/dev.sh
```

**You'll see**:
```
To run this command, log in to Shopify.
User verification code: XXXX-XXXX
👉 Open this link to start the auth process:
https://accounts.shopify.com/activate-with-code?device_code...
```

**Steps**:
1. Open the provided URL in your browser
2. Enter the verification code
3. Log in to your Shopify account
4. Grant permissions
5. Return to terminal

**Credentials are persisted** in `~/.shopify` and bind-mounted into the container, so you only need to authenticate once.

### Common Shopify CLI Commands

All commands run inside Docker:

#### List Themes

```bash
docker compose run --rm node-dev npx shopify theme list
```

#### Pull Theme from Store

```bash
docker compose run --rm node-dev npx shopify theme pull
```

#### Push Theme to Store

```bash
docker compose run --rm node-dev npx shopify theme push
```

#### Create New Theme

```bash
docker compose run --rm node-dev npx shopify theme push --unpublished --theme="MDS Dev Theme"
```

---

## Common Workflows

### Workflow 1: Daily Development

```bash
# Start Vite for asset development
./scripts/docker/vite.sh

# In another terminal, start Shopify dev server
./scripts/docker/dev.sh

# Make changes to files
# Vite auto-compiles assets
# Shopify CLI auto-reloads theme
```

### Workflow 2: Build and Deploy

```bash
# Build production assets
./scripts/docker/build.sh

# Deploy to staging store
./scripts/docker/deploy.sh --store=staging

# Deploy to production store
./scripts/docker/deploy.sh --store=headquarters
```

### Workflow 3: Multi-Store Rollout

```bash
# Build once
./scripts/docker/build.sh

# Deploy to all franchises
./scripts/docker/deploy.sh --all
```

### Workflow 4: Code Quality Check

```bash
# Run theme check
docker compose run --rm theme-check

# Run npm scripts
docker compose run --rm node-dev npm run lint
```

---

## Troubleshooting

### Issue: Port Already in Use

**Error**: `Bind for 0.0.0.0:3000 failed: port is already allocated`

**Solution**:
```bash
# Find process using port
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or change port in docker-compose.yml
```

---

### Issue: Container Build Fails

**Error**: Various build errors

**Solution**:
```bash
# Clean rebuild
docker compose down
docker compose build --no-cache
```

---

### Issue: node_modules Out of Sync

**Error**: Module not found errors

**Solution**:
```bash
# Rebuild container to reinstall dependencies
docker compose build

# Or manually install inside container
docker compose run --rm node-dev npm install
```

---

### Issue: Shopify CLI Authentication Loop

**Error**: Repeatedly asked to authenticate

**Solution**:
```bash
# Remove cached credentials
rm -rf ~/.shopify

# Authenticate again
./scripts/docker/dev.sh
```

---

### Issue: Changes Not Reflecting

**Problem**: File changes not triggering rebuilds

**Solution**:
1. Verify file is saved
2. Check Docker volume mount:
   ```bash
   docker compose run --rm node-dev ls -la /workspace
   ```
3. Restart Vite:
   ```bash
   # Stop Vite (Ctrl+C)
   ./scripts/docker/vite.sh
   ```

---

## Best Practices

### 1. Always Use Helper Scripts

❌ Don't:
```bash
docker compose run node-dev npm run build
```

✅ Do:
```bash
./scripts/docker/build.sh
```

**Why**: Helper scripts include error handling, logging, and validation.

---

### 2. Build Before Deploying

❌ Don't:
```bash
./scripts/docker/deploy.sh --store=production --no-build
```

✅ Do:
```bash
./scripts/docker/build.sh
./scripts/docker/deploy.sh --store=production
```

**Why**: Ensures latest assets are included.

---

### 3. Keep Docker Images Updated

```bash
# Pull latest base images
docker compose pull

# Rebuild containers
docker compose build
```

**Frequency**: Weekly or when dependencies change.

---

### 4. Use .dockerignore

The project includes `.dockerignore` to exclude:
- `node_modules`
- `.git`
- `assets/` (generated)
- Log files

This speeds up builds and reduces image size.

---

### 5. Clean Up Regularly

```bash
# Remove stopped containers
docker compose down

# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune
```

---

## Advanced Usage

### Running Arbitrary Commands

```bash
# Interactive shell
docker compose run --rm node-dev bash

# Run npm command
docker compose run --rm node-dev npm run <script>

# Run node script
docker compose run --rm node-dev node scripts/custom.js
```

### Debugging Inside Container

```bash
# Start container with shell
docker compose run --rm node-dev bash

# Inside container:
node-user@container:/workspace$ npm run build
node-user@container:/workspace$ ls -la assets/
node-user@container:/workspace$ exit
```

---

## Summary

Docker provides:
- ✅ **Consistent environments** across all machines
- ✅ **Isolated dependencies** (no conflicts with system Node/Ruby)
- ✅ **Reproducible builds** (same output every time)
- ✅ **Easy onboarding** (one command to start)
- ✅ **CI/CD ready** (same container in development and production)

**Next Steps**:
- Read [Developer Onboarding Guide](./developer-onboarding.md)
- Review [Multi-Store Deployment Guide](./multi-store.md)
- Check [Development Guide](./development.md)
