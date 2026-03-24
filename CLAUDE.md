# CLAUDE.md - AI Assistant Guide for Marine Detail Supply Theme

## Project Overview

Enterprise Shopify theme for the Marine Detail Supply franchise network. Built on the Taillour Theme boilerplate with B2B and B2C retail support and multi-store deployment capabilities.

**Stack**: Shopify Liquid, Web Components (ES Modules), Tailwind CSS 4.x, Vite 5.x, Alpine.js, Swiper, Node.js 20

## Repository Structure

```
├── src/                    # Source code (JS + CSS) - NOT deployed to Shopify
│   ├── scripts/            # JavaScript source
│   │   ├── global.js       # Main entry point
│   │   ├── design.js       # Design system entry
│   │   ├── b2b-theme-editor.js  # B2B editor entry
│   │   ├── core/           # Base component, registries, UI primitives
│   │   ├── components/     # Web Components (mds-header-menu, mds-cart-drawer, etc.)
│   │   ├── products/       # Product state engine and controllers
│   │   └── compat/         # Legacy Taillour compatibility layer
│   └── styles/             # CSS component files (42 files)
│       └── tailwind.css    # Main CSS entry importing all component styles
├── assets/                 # Compiled output from Vite build - deployed to Shopify
├── layout/                 # Shopify layouts (theme.liquid, b2b.liquid, password.liquid)
├── templates/              # Shopify JSON templates (20 files)
├── sections/               # Shopify Liquid sections (83 files)
├── snippets/               # Reusable Liquid snippets (30+ files)
├── config/                 # Theme settings + multi-store configs
│   ├── settings_schema.json
│   └── stores/             # Per-store configuration overrides
├── locales/                # i18n translations
├── scripts/                # Build & deployment scripts (build.js, deploy.js)
│   └── docker/             # Docker helper scripts
├── design/                 # Design system documentation & previews
├── docs/                   # Developer documentation
└── tasks/                  # Project task tracking
```

## Build & Development Commands

```bash
npm run dev              # Start Vite dev server with HMR
npm run build            # Production build (outputs to assets/)
npm run watch            # Continuous build on file changes
npm run deploy -- --store=<name>  # Multi-store deployment
npm run shopify:dev      # Shopify theme preview (port 9292)
npm run shopify:push     # Push theme to Shopify
npm run shopify:pull     # Pull theme from Shopify
npm run shopify:check    # Run theme linter
npm run design           # Design system server (port 5173)
npm run check:animations # Validate animation contracts
```

All scripts run `scripts/check-dir.js` as a preflight check.

## Build Pipeline

- **Vite** compiles `src/` into `assets/` with Terser minification
- **Entry points**: `global.js`, `design.js`, `b2b-theme-editor.js`, `tailwind.css`
- **Import aliases**: `@scripts`, `@styles`, `@components`, `@sections`, `@assets`
- **Output**: Flat filenames in `assets/` (no hashes) — Shopify serves them directly
- `emptyOutDir: false` — build preserves static assets already in `assets/`

## Architecture & Patterns

### Web Components

All custom elements extend `BaseComponent` (`src/scripts/core/base-component.js`):

```javascript
import { BaseComponent } from '@scripts/core/base-component';

export class MyComponent extends BaseComponent {
  init() { /* setup state, cache DOM */ }
  attachEventListeners() { /* bind handlers */ }
  cleanup() { /* teardown */ }
}
customElements.define('my-component', MyComponent);
```

BaseComponent provides: `$(selector)`, `$$(selector)`, `on(event, selector, handler)`, `emit(name, detail)`, `attr()`, `addClass()`, `removeClass()`, `toggleClass()`, `hasClass()`.

### Product State Engine

Canonical state management at `window.B2B.ProductState`:
- Observable pattern with `subscribe(fn)`, `setState(partial)`, `getState()`
- WeakMap singleton per root element
- Controllers: pricing, image, variant, quantity, inventory, cart

### Component & Section Registries

- `component-registry.js` — Map-based Web Component lifecycle tracking with `initAll(context)`
- `section-registry.js` — Shopify Section Rendering API integration

### Event Conventions

- Custom events prefixed with `mds:` (e.g., `mds:menu:opened`, `mds:cart:updated`)
- Shopify theme editor events: `shopify:section:load`, `shopify:section:unload`, `shopify:block:select`
- All custom events use `CustomEvent` with `bubbles: true`

### Liquid Conventions

- Data attributes for JS hooks: `[data-product-card]`, `[data-product-id]`, `[data-add-to-cart]`
- BEM-style class naming: `product-card`, `product-card__image`, `product-card__content`
- Tailwind utility classes for layout and styling
- Image optimization: `image_url: width: 600` with `loading="lazy"`
- Snippet composition: `{% render 'product-pricing', product: product %}`
- Accessibility: `aria-expanded`, `aria-hidden`, semantic HTML

## Key Files

| File | Purpose |
|------|---------|
| `vite.config.js` | Build configuration, entry points, aliases |
| `tailwind.config.js` | Tailwind CSS v4 content scanning config |
| `postcss.config.js` | PostCSS with @tailwindcss/postcss + autoprefixer |
| `scripts/build.js` | ThemeBuilder class — cleans assets, runs Vite |
| `scripts/deploy.js` | MultiStoreDeployer — per-store deploy with CLI args |
| `src/scripts/core/base-component.js` | Base class for all Web Components |
| `src/scripts/products/product-state.js` | Canonical product state engine |
| `config/settings_schema.json` | Theme-wide Shopify settings |

## CI/CD

- **GitHub Actions**: `.github/workflows/ci.yml` runs `shopify/theme-check-action@v2` on push
- **Theme Check**: extends `theme-check:recommended` (`.theme-check.yml`)
- **CLA workflow**: `.github/workflows/cla.yml`

## Docker Development

```bash
docker-compose up -d         # Start dev container
docker exec -it <container> ./scripts/docker/vite.sh   # Vite dev server
docker exec -it <container> ./scripts/docker/dev.sh    # Shopify preview
docker exec -it <container> ./scripts/docker/build.sh  # Production build
```

Ports: 3000 (Vite proxy), 5173 (Vite/design), 9292 (Shopify dev)

## Important Rules for AI Assistants

### Do

- Run `npm run build` after modifying files in `src/` to regenerate `assets/`
- Use import aliases (`@scripts`, `@styles`, etc.) in JS source files
- Follow the BaseComponent pattern for new Web Components
- Use `data-` attributes for JS hooks, not CSS classes
- Use `mds:` prefix for custom events
- Keep Liquid snippets composable and small
- Test theme changes with `npm run shopify:check`

### Do Not

- Edit files in `assets/` directly — they are build output (exception: static assets like images/fonts)
- Commit `config/settings_data.json` — it's store-specific and gitignored
- Commit `.env` files — use `.env.example` as reference
- Add source maps to production builds (sourcemap is disabled in vite.config.js)
- Bypass the `check-dir.js` preflight in scripts

### File Ownership

- `src/` — source of truth for JS and CSS
- `assets/` — generated output; static assets (images, fonts, non-built JS) coexist here
- `layout/`, `sections/`, `snippets/`, `templates/` — Shopify Liquid files, edit directly
- `config/settings_schema.json` — theme settings schema, edit directly
- `config/settings_data.json` — never commit (gitignored, store-specific)

## Multi-Store Deployment

Stores are configured in `config/stores/{store-name}/config.json` with per-store overrides in `config/stores/{store-name}/overrides/`. Deploy with:

```bash
npm run deploy -- --store=store-name    # Single store
npm run deploy -- --all                 # All stores
npm run deploy -- --store=name --no-build  # Skip build step
```

## Module System

This project uses ES Modules (`"type": "module"` in package.json). All JS uses `import`/`export` syntax.
