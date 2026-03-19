# ✅ **TASK: Implement Full Docker Setup for the MDS Global Theme Framework**



## **Objective**

Create a complete Docker-based development environment for the Marine Detail Supply Global Theme Framework.
This Docker setup will ensure consistent builds, isolated development, reproducible environments for all human developers and AI agents, and long-term stability for multi-store franchise deployments.

This Docker environment must fully support:

* Skeleton Theme base
* Tailwind CSS
* Vite build pipeline
* ESM JavaScript modules
* Shopify CLI
* Multi-store theme deployment
* Local sandbox development
* CI/CD readiness

---

# **1. Create the Dockerfile**

### **1.1 Base image**

Use **Node 20 LTS (official image)** as the base.

### **1.2 Install required global tools**

The Dockerfile MUST install:

* Shopify CLI
* Ruby (for Shopify CLI dependencies)
* Theme Check gem
* Git
* pnpm or npm (npm is fine)
* libvips or image tools if required later (optional)

### **1.3 Create non-root user**

For better security and compatibility with Shopify CLI tunnels.

### **1.4 Install project dependencies inside container**

During build, run:

```
npm install
```

### **1.5 Set working directory**

```
/workspace
```

---

# **2. Create docker-compose.yml**

### **2.1 Define services**

#### **Service: node-dev**

Purpose:
Main dev environment where Vite, Tailwind, and Shopify CLI commands run.

Requirements:

* Build from Dockerfile
* Mount local project directory → `/workspace`
* Expose ports for:

  * Vite (5173 or 3000)
  * Shopify CLI tunnel
* Pull environment variables from `.env`

#### **Service: theme-check**

Purpose:
Run Shopify Theme Check in isolation.

Command:

```
theme-check --init && theme-check
```

### **2.2 Hot reload + filesystem sync**

Bind mount:

```
volumes:
  - ./:/workspace
```

---

# **3. Add Helper Scripts (Expanded + Required)**

Create a `/scripts` directory containing **fully executable helper scripts** that simplify Docker workflows and guarantee consistent, error-free development for both humans and AI agents.

These scripts eliminate long Docker commands and enforce a reliable, repeatable workflow across all environments.

---

## **3.1 dev.sh — Run Shopify Theme Dev Server**

### Purpose:

Start the Shopify dev server inside Docker with proper port forwarding, file watching, and Skeleton compatibility.

### Command executed:

```
docker compose run --service-ports node-dev shopify theme dev
```

### Requirements:

* Must be executable (`chmod +x`)
* Must output status messages
* Must fail gracefully with clear errors

---

## **3.2 vite.sh — Run the Vite Development Server**

### Purpose:

Start the Vite dev server (JS + Tailwind hot reload) inside Docker.

### Command executed:

```
docker compose run --service-ports node-dev npm run dev
```

### Requirements:

* Must automatically mount file system changes
* Must expose Vite port for local browser preview

---

## **3.3 build.sh — Build Production Assets**

### Purpose:

Generate the final bundled `/assets` for deployment (Tailwind, Vite, ESM modules).

### Command executed:

```
docker compose run node-dev npm run build
```

### Requirements:

* Output must always go into `/assets`
* Output must match across machines (deterministic builds)

---

## **3.4 deploy.sh — Deploy Theme to Specific Store**

### Purpose:

Push the compiled theme to any franchise store using Shopify CLI, all inside Docker.

### Command executed:

```
docker compose run node-dev node ./scripts/deploy.js --store=$STORE_URL
```

### Requirements:

* Must accept `--store=STORE_URL`
* Must validate that store is provided
* Must output deployment progress
* Must end with a success or failure message

---

## **3.5 Shared Requirements for All Scripts**

All helper scripts MUST:

* be executable (`chmod +x`)
* include parameter handling
* include basic error handling
* echo meaningful logs for debugging
* work on macOS, Windows (WSL2), and Linux
* be callable from CI/CD

These scripts provide a unified workflow like:

```
./scripts/dev.sh
./scripts/vite.sh
./scripts/build.sh
./scripts/deploy.sh --store=mds-miami.myshopify.com
```

This ensures **complete consistency** for developers and AI agents.

---

# **4. Shopify CLI Integration**

### **4.1 Shopify CLI must work inside Docker**

```
shopify login
shopify theme dev
shopify theme push
shopify theme pull
```

### **4.2 Bind Authentication**

Persist CLI credentials:

```
~/.shopify:/home/node/.shopify
```

---

# **5. Environment Configuration**

### **5.1 Create `.env.example`**

Include:

```
SHOPIFY_STORE_URL=
SHOPIFY_CLI_THEME_ID=
MDS_ENV=development
```

### **5.2 Load `.env` Automatically**

In docker-compose.yml:

```
env_file: .env
```

---

# **6. Documentation**

### Add under `/docs`:

### **6.1 docker.md**

* Installing Docker Desktop
* Starting dev environment
* Logging into Shopify CLI
* Running builds
* Running helper scripts
* Deploying to franchise stores
* Resetting containers

### **6.2 developer-onboarding.md**

* Why Docker is used
* How it ensures reproducible environments
* How helper scripts simplify workflows
* How updates propagate globally across stores

---

# **7. Acceptance Criteria**

The following commands MUST work on any machine with Docker installed:

### **Start Shopify Dev**

```
./scripts/dev.sh
```

### **Run Vite Dev Server**

```
./scripts/vite.sh
```

### **Build Production Assets**

```
./scripts/build.sh
```

### **Deploy to Store**

```
./scripts/deploy.sh --store=example.myshopify.com
```

### **Run Theme Check**

```
docker compose run theme-check
```

### **Identical Build Outputs**

Running the build locally or in Docker must produce **bit-for-bit identical results** in `/assets`.

---

# **8. Deliverables Summary**

The coding agent must deliver:

* ✔ Dockerfile (Node 20 + Shopify CLI + Theme Check)
* ✔ docker-compose.yml (node-dev + theme-check)
* ✔ Helper scripts:

  * dev.sh
  * vite.sh
  * build.sh
  * deploy.sh
* ✔ `.env.example`
* ✔ `/docs/docker.md` and `/docs/developer-onboarding.md`
* ✔ Proper volume mounts + ports
* ✔ Tailwind + Vite running inside Docker
* ✔ Shopify CLI fully functional
* ✔ Multi-store deployment support
* ✔ Reproducible builds for all developers + AI agents
