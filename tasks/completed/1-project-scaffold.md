# ✅ TASK: Scaffold the Marine Detail Supply Global Theme Framework (Skeleton-Based)

## **Mission**

Build the **Marine Detail Supply Global Theme Framework**, a long-term, multi-store theme system built on **Shopify’s Skeleton Theme**.
This theme will serve as the **canonical base theme** for every franchise store.

The coding agent must scaffold the entire architecture, implement build tooling, integrate Tailwind, ESM modules, Swiper.js, and prepare the repo for continuous global updates across multiple Shopify stores.

This MUST be engineered at an enterprise, future-proof level.

---

# **1. Base Theme Setup**

### **1.1 Use Shopify Skeleton Theme as the Foundation**

* Clone: [https://github.com/Shopify/skeleton-theme](https://github.com/Shopify/skeleton-theme)
* Use its folder structure, minimal markup, and modular design patterns.
* DO NOT replace it with Dawn or third-party themes.
* Maintain the structure exactly as Shopify intends for modular theme development.

### **1.2 Prepare for Tailwind and custom UI system**

* Remove only the minimal CSS Skeleton includes where needed.
* Keep structural HTML, JS hooks, and section/snippet layout intact.

---

# **2. Tailwind CSS Integration**

### **2.1 Install Tailwind via NPM**

Configure:

* JIT mode enabled
* Purge paths for all theme source types:

  * `/shopify/**/*.{liquid,json}`
  * `/src/**/*.{js,ts}`
  * `/src/styles/**/*.css`
  * `/sections/**/*.liquid`

### **2.2 Build Tailwind into a Shopify-compatible output**

* Tailwind entry file → `/src/styles/tailwind.css`
* Build output → `/assets/theme.css` or `/assets/theme.css.liquid`
* Must be minified for production.

### **2.3 Add Marine Detail Supply design system tokens**

* Create `/src/styles/mds.preset.js`
* Include brand:

  * colors
  * typography
  * spacing
  * radius
  * shadows
  * transitions
* This preset must be reusable across all stores.

---

# **3. JavaScript Architecture (ESM + Web Components)**

### **3.1 Global ESM Setup**

* All JS must be organized under `/src/scripts/`:

```
src/scripts/global.js
src/scripts/components/*
src/scripts/sections/*
```

### **3.2 Use native Web Components**

Build a reusable component system for:

* `<mds-header-menu>`
* `<mds-bottom-filter-shelf>`
* `<mds-cart-drawer>`
* `<mds-collection-filters>`
* `<mds-platform-slider>`
* `<mds-campaign-banner>`

These should follow Skeleton’s modular JS patterns.

### **3.3 Tie components into Shopify’s Section Rendering API**

Each section in `/shopify/sections` must have a JS controller under `/src/scripts/sections`.

### **3.4 Integrate Swiper.js**

* Install via npm.
* Create dedicated component wrapper:
  `/src/scripts/components/swiper-component.js`
* Auto-init when sections load or re-render.

---

# **4. Build Pipeline Requirements**

### **4.1 Use Vite (preferred) or esbuild**

Pipeline must support:

* ESM bundling
* Hot reload (local)
* Minified production bundles
* Tailwind compilation
* Watching file changes

### **4.2 Required NPM scripts**

Implement:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "watch": "vite build --watch",
    "deploy": "node ./scripts/deploy.js"
  }
}
```

### **4.3 Output Targets**

Compiled artifacts MUST output only to `/assets/`:

```
/assets/global.js
/assets/theme.css
/assets/*.js   (hashed allowed)
```

No source files should ever live in `/assets`.

---

# **5. Multi-Store Franchise Architecture**

### **5.1 Single Source of Truth Repo**

This theme must be built so all stores share the same global code.

### **5.2 Branch Workflow**

Implement:

* `main` → production releases
* `dev` → active development
* `feature/*` → isolated work
* Git tags for exact store-deployed versions

### **5.3 Global Update System**

Agent must create:

* A deployment script `/scripts/deploy.js`
* Ability to run:

  ```
  npm run deploy -- --store=storeA.myshopify.com
  ```
* Support pushing the same code to:

  * Headquarters store
  * Franchise stores
  * Regional stores (future)

### **5.4 Store-specific overrides**

Add support for local overrides:

```
/config/stores/<store-name>/
```

These override:

* settings_schema
* theme settings
* partial snippets (optional)

---

# **6. Shopify CLI Integration**

### **6.1 Required CLI Support**

Agent must ensure the repo works with:

* `shopify theme dev`
* `shopify theme push`
* `shopify theme pull`
* `shopify theme check`

### **6.2 Dev Store Support**

We will use a Shopify Partner Test Store containing Marine Detail Supply products.

Agent must:

* Set this as the default dev environment
* Create `.env` template containing required variables:

  ```
  SHOPIFY_STORE_URL=
  SHOPIFY_CLI_THEME_ID=
  MDS_ENV=
  ```

---

# **7. Local Development Sandbox**

### **7.1 Closed Environment**

Development must NEVER access live stores.

### **7.2 Shopify CLI Tunnel for Preview**

`shopify theme dev` should render the Skeleton-based theme with:

* Tailwind
* ESM bundling
* Swiper
* Component system
* Section-aware JS

### **7.3 Dev mode must auto-rebuild assets**

Hot-reload for JS + CSS must be active via Vite.

---

# **8. Final Directory Structure**

The final repo must look like:

```
/src
  /scripts
    global.js
    /components
    /sections
  /styles
    tailwind.css
    mds.preset.js

/shopify
  /layout
  /templates
  /sections
  /snippets

/assets       (compiled output only)
/config
  settings_schema.json
  settings_data.json
  /stores/<store-name>/overrides.json
/scripts
  deploy.js
  build.js
.env.example
README.md
/docs
  development.md
  deployment.md
  multi-store.md
```

---

# **9. Documentation Deliverables**

Agent must create `/docs/` containing:

### **9.1 development.md**

How to run:

* Vite dev mode
* Shopify dev server
* Tailwind
* Component creation patterns

### **9.2 deployment.md**

* Deploying to individual stores
* Deploying globally
* Versioning and tagging

### **9.3 multi-store.md**

* How to override store settings
* How updates propagate globally
* How to sync changes

---

# **Deliverables Summary**

The coding agent must output a fully-working, complete base Shopify theme with:

* Skeleton theme foundation
* Tailwind CSS integrated
* Full Vite build pipeline
* ESM modules
* Web components
* Swiper.js
* Local sandbox development
* Multi-store franchise deployment tooling
* Git-based versioning workflow
* Clean global architecture
* Documentation

This project MUST be ready for all future enhancements and expansion.