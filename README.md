# 🚢 Marine Detail Supply Global Theme Framework

**Enterprise Shopify multi-store theme system built on Taillour Boilerplate Theme**

A production-ready, scalable theme framework powering the entire Marine Detail Supply franchise network. Built on [Taillour Theme](https://github.com/ketanmistry/taillour-theme) with custom Tailwind CSS, Vite build pipeline, and ESM modules. Designed for long-term maintenance, global updates, and multi-store deployments.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE.md)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://www.docker.com/)

## 🚀 Features

- **🏗️ Built on Taillour Boilerplate Theme** - Feature-rich Shopify theme foundation
- **🎨 Tailwind CSS v4** - CSS-first configuration with custom MDS design system
- **⚡ Vite Build Pipeline** - Fast HMR and optimized production builds
- **🐳 Docker Development** - Containerized environment for consistent builds
- **🧩 Web Components** - Native ESM modules with custom elements
- **📱 Swiper.js Integration** - Production-ready sliders and carousels
- **🏪 Multi-Store Architecture** - Deploy to multiple franchises from one codebase
- **🔄 Hot Module Replacement** - Instant feedback during development
- **📦 Component Registry** - Automatic component initialization
- **🎯 Section Controllers** - Shopify Section Rendering API integration
- **🔧 Store Overrides** - Per-store customizations without forking
- **🛒 Rich E-commerce Features** - Product grids, collections, cart, search from Taillour

## 📋 Quick Start

### Prerequisites

**Option 1: Local Development**
- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Shopify CLI** 3.x
- **Git**

**Option 2: Docker Development** (Recommended)
- **Docker** 20.x or higher
- **Docker Compose** 2.x or higher
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mdsc-shopify-theme
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your Shopify store details.

4. **Choose your development environment**

   **Option A: Docker (Recommended)**
   ```bash
   # Authenticate with Shopify on host (one-time setup)
   npx shopify theme list --store your-store.myshopify.com
   
   # Start development with Docker
   ./scripts/docker/vite.sh      # Vite dev server with HMR
   ./scripts/docker/dev.sh       # Shopify theme preview
   ./scripts/docker/build.sh     # Production build
   ```

   **Option B: Local Development**
   ```bash
   npm install
   npm run build
   npm run dev                   # Vite dev server
   npm run shopify:dev           # Shopify theme preview
   ```

## 📁 Project Structure

```
mdsc-shopify-theme/
├── src/                          # Source files (uncompiled)
│   ├── scripts/                  # JavaScript source
│   │   ├── global.js             # Main entry point
│   │   ├── core/                 # Core utilities
│   │   │   ├── base-component.js # Base component class
│   │   │   ├── component-registry.js
│   │   │   └── section-registry.js
│   │   ├── components/           # Web Components
│   │   │   ├── mds-header-menu.js
│   │   │   ├── mds-cart-drawer.js
│   │   │   ├── mds-platform-slider.js
│   │   │   └── ...
│   │   └── sections/             # Section controllers
│   └── styles/                   # CSS source
│       ├── tailwind.css          # Main Tailwind entry
│       └── mds.preset.js         # MDS design system preset
│
├── assets/                       # Compiled output (generated)
│   ├── global.js                 # Compiled JavaScript
│   ├── theme.css                 # Compiled Tailwind CSS
│   └── ...                       # Static assets
│
├── layout/                       # Shopify layout templates
│   ├── theme.liquid
│   └── password.liquid
│
├── templates/                    # Shopify JSON templates
│   ├── index.json
│   ├── product.json
│   └── ...
│
├── sections/                     # Shopify sections
│   ├── header.liquid
│   ├── footer.liquid
│   └── ...
│
├── snippets/                     # Liquid snippets
│   ├── image.liquid
│   └── ...
│
├── blocks/                       # Shopify blocks
│   └── ...
│
├── config/                       # Theme configuration
│   ├── settings_schema.json
│   ├── settings_data.json
│   └── stores/                   # Multi-store configs
│       ├── headquarters/
│       │   ├── config.json
│       │   └── overrides/
│       └── franchise-001/
│           └── config.json
│
├── scripts/                      # Build & deployment scripts
│   ├── deploy.js                 # Multi-store deployment
│   ├── build.js                  # Build script
│   └── docker/                   # Docker helper scripts
│       ├── dev.sh                # Shopify theme dev server
│       ├── vite.sh               # Vite dev server
│       ├── build.sh              # Production build
│       └── deploy.sh             # Multi-store deployment
│
├── docs/                         # Documentation
│   ├── development.md
│   ├── deployment.md
│   ├── multi-store.md
│   ├── docker.md                 # Docker setup guide
│   └── developer-onboarding.md  # Best practices
│
├── Dockerfile                    # Docker container definition
├── docker-compose.yml            # Docker services configuration
├── .dockerignore                 # Docker build exclusions
├── vite.config.js                # Vite configuration
├── tailwind.config.js            # Tailwind configuration
├── postcss.config.js             # PostCSS configuration
├── package.json                  # Dependencies & scripts
└── .env.example                  # Environment template
```

## 🛠️ Available Commands

### Docker Commands (Recommended)

```bash
# Development
./scripts/docker/vite.sh    # Start Vite dev server with HMR (port 3000)
./scripts/docker/dev.sh     # Start Shopify theme preview (port 9292)

# Building
./scripts/docker/build.sh   # Build production assets in container

# Deployment
./scripts/docker/deploy.sh --store=store-name  # Deploy to specific store
./scripts/docker/deploy.sh --all               # Deploy to all stores

# Theme Check
docker compose run --rm theme-check   # Run Shopify theme linter
```

### Local Commands

```bash
# Development
npm run dev              # Start Vite dev server with HMR
npm run shopify:dev      # Start Shopify CLI dev server

# Building
npm run build            # Build production assets
npm run watch            # Build and watch for changes

# Deployment
npm run deploy -- --store=store-name    # Deploy to specific store
npm run deploy -- --all                  # Deploy to all stores

# Shopify CLI
npm run shopify:push     # Push theme to store
npm run shopify:pull     # Pull theme from store
npm run shopify:check    # Run theme validation
```

## 🎨 Tailwind CSS & Design System

The theme includes a custom **Marine Detail Supply Design System** with brand-specific tokens:

### Color Palette

- `mds-navy-*` - Navy blue shades (50-900)
- `mds-blue-*` - Primary blue shades (50-900)
- `mds-marine-*` - Marine/teal shades (50-900)
- `mds-neutral-*` - Neutral grays (50-900)

### Custom Components

```html
<!-- Buttons -->
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>

<!-- Container -->
<div class="container-mds">Content</div>

<!-- Card -->
<div class="card">
  <h3>Card Title</h3>
  <p>Card content</p>
</div>
```

See `src/styles/mds.preset.js` for full design system.

## 🧩 Web Components

### Available Components

- `<mds-header-menu>` - Header navigation with mobile menu
- `<mds-cart-drawer>` - Slide-out cart drawer
- `<mds-bottom-filter-shelf>` - Mobile-friendly filter panel
- `<mds-collection-filters>` - Product collection filtering
- `<mds-platform-slider>` - Swiper-powered content slider
- `<mds-campaign-banner>` - Dismissible announcement banners

### Creating Components

```javascript
import { BaseComponent } from '../core/base-component.js';

export class MDSYourComponent extends BaseComponent {
  init() {
    // Initialization
  }
  
  attachEventListeners() {
    // Event handlers
  }
}

customElements.define('mds-your-component', MDSYourComponent);
```

## 🏪 Multi-Store Deployment

### Deploy to Single Store

```bash
npm run deploy -- --store=headquarters
```

### Deploy to All Stores

```bash
npm run deploy -- --all
```

### Store Configuration

Each store has a configuration file in `config/stores/{store-name}/config.json`:

```json
{
  "storeName": "franchise-001",
  "storeUrl": "franchise001.myshopify.com",
  "displayName": "Marine Detail Supply - Northeast"
}
```

### Store Overrides

Add store-specific customizations in `config/stores/{store-name}/overrides/`:

- `settings_data.json` - Theme settings
- `snippets/` - Custom snippets
- `sections/` - Custom sections
- `assets/` - Store-specific assets

## 🐳 Docker Development

The theme includes a complete Docker-based development environment for consistent, isolated builds.

### Why Docker?

- **Consistent Environment** - Same Node.js, Ruby, and Shopify CLI versions across all developers
- **No Local Dependencies** - No need to install Node.js, Ruby, or Shopify CLI on your machine
- **Isolated Builds** - Avoid conflicts with other projects
- **Production Parity** - Build assets in the same environment as production

### Quick Start with Docker

1. **Authenticate with Shopify (one-time setup)**
   ```bash
   npx shopify theme list --store your-store.myshopify.com
   ```

2. **Start Vite dev server with HMR**
   ```bash
   ./scripts/docker/vite.sh
   # Access at http://localhost:3000
   ```

3. **Start Shopify theme preview**
   ```bash
   ./scripts/docker/dev.sh
   # Access at http://localhost:9292
   ```

### Docker Configuration

- `Dockerfile` - Node 20 + Ruby + Shopify CLI container
- `docker-compose.yml` - Service definitions for development
- `.dockerignore` - Optimized build context
- `scripts/docker/` - Helper scripts for common tasks

### Troubleshooting

**Permission Issues**: If you encounter permission errors, fix with:
```bash
docker compose run --rm -u root node-dev chown -R $(id -u):$(id -g) /workspace/node_modules
```

**Full Documentation**: See **[Docker Setup Guide](./docs/docker.md)** for comprehensive instructions.

## 📚 Documentation

Comprehensive guides available in `/docs`:

- **[Development Guide](./docs/development.md)** - Local development, components, and styling
- **[Deployment Guide](./docs/deployment.md)** - Deployment workflows and CI/CD
- **[Multi-Store Guide](./docs/multi-store.md)** - Managing multiple franchise stores
- **[Docker Setup Guide](./docs/docker.md)** - Complete Docker development environment guide
- **[Developer Onboarding](./docs/developer-onboarding.md)** - Philosophy and best practices

## 🔧 Technology Stack

- **Frontend Framework**: Shopify Liquid
- **CSS Framework**: Tailwind CSS 4.x (CSS-first configuration)
- **Build Tool**: Vite 5.x
- **JavaScript**: ES Modules (ESM)
- **Components**: Web Components (Custom Elements)
- **Slider Library**: Swiper.js 11.x
- **Package Manager**: npm
- **Containerization**: Docker + Docker Compose
- **Runtime**: Node.js 20.x (Bullseye Slim)
- **Shopify CLI**: 3.x (Ruby-based)

## 📝 Development Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make changes and test**
   ```bash
   # Docker (recommended)
   ./scripts/docker/vite.sh
   
   # Or local
   npm run dev
   ```

3. **Build for production**
   ```bash
   # Docker (recommended)
   ./scripts/docker/build.sh
   
   # Or local
   npm run build
   ```

4. **Deploy to test store**
   ```bash
   # Docker (recommended)
   ./scripts/docker/deploy.sh --store=dev-store
   
   # Or local
   npm run deploy -- --store=dev-store
   ```

5. **Merge and deploy to production**
   ```bash
   git checkout main
   git merge feature/new-feature
   ./scripts/docker/deploy.sh --all  # or npm run deploy -- --all
   ```

## 🤝 Contributing

This theme is maintained for Marine Detail Supply franchise network. For contributions:

1. Follow existing code patterns
2. Test thoroughly before deploying
3. Document new features
4. Update relevant documentation

## 📄 License

This project is licensed under the MIT License - see [LICENSE.md](./LICENSE.md) for details.

## 🆘 Support

- **Documentation**: Check `/docs` folder
- **Issues**: Review deployment logs
- **Shopify**: [Shopify Help Center](https://help.shopify.com)

---

**Built with ❤️ for Marine Detail Supply franchise network**
