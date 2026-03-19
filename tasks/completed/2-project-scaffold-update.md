# ✅ **TASK — Replace Shopify Skeleton With Taillour Theme Boilerplate**

## **Objective**

Remove the existing **Shopify Skeleton Theme** foundation and fully replace it with the **Taillour Boilerplate Theme** ([https://github.com/ketanmistry/taillour-theme](https://github.com/ketanmistry/taillour-theme)).
All previously created enhancements — build pipeline, Tailwind, Vite, multi-store tooling, Swiper integration, component framework, scripts, and documentation — must **remain intact** and functional.

This task MUST NOT break:

* Existing Vite build pipeline
* Tailwind integration
* ESM component system
* Multi-store deployment system
* Helper scripts
* Docker setup
* Documentation folder structure
* Current repo tooling and scripts

Only the **theme source layer** (Liquid templates/sections/snippets/assets) must be replaced.

---

# 1. **Remove the Shopify Skeleton Theme Completely**

The agent must perform a safe removal without touching tooling.

### **1.1 Remove all Skeleton theme files from:**

```
/shopify
/layout
/templates
/sections
/snippets
/assets (only Skeleton-supplied ones)
```

### **1.2 DO NOT delete:**

* `/src/` (your JS/Tailwind source code)
* `/scripts/` (deploy, dev, helpers)
* `/config/`
* `/docs/`
* `/docker/`
* `/package.json`, `/tailwind.config.js`, `/vite.config.js`
* Components under `/src/scripts/components/`
* Global design system files
* Multi-store override directories

### **1.3 Remove any Skeleton-specific Liquid markup**

Examples:

* `{% render 'skeleton-*' %}`
* Skeleton’s wrappers or classes
* Placeholder demos

All Skeleton references must be purged.

---

# 2. **Install & Scaffold the Taillour Boilerplate Theme**

### **2.1 Download the Taillour theme**

Clone or download:
[https://github.com/ketanmistry/taillour-theme](https://github.com/ketanmistry/taillour-theme)

### **2.2 Copy Taillour’s theme files into the project**

Place the following into the repo:

```
/layout
/templates
/sections
/snippets
/assets
/locales
```

### **2.3 Preserve your custom /assets build flow**

Taillour’s own CSS/JS files must be:

❌ NOT used
✔ replaced with your Tailwind/Vite output

### **2.4 Remove Taillour’s default build pipeline**

If Taillour contains any of the following:

* webpack
* parcel
* gulp
* prebuilt CSS
* third-party JS
* inline scripts

The agent must remove them.

Your build architecture remains unchanged:

* Tailwind → `src/styles/tailwind.css`
* Vite bundler
* ESM modules → `src/scripts`

---

# 3. **Integrate Taillour Into the Existing Build System**

### **3.1 Ensure theme references your compiled assets**

Update `layout/theme.liquid`:

* Replace Taillour styles with:

  ```
  <link rel="stylesheet" href="{{ 'theme.css' | asset_url }}">
  ```
* Replace Taillour JS with:

  ```
  <script src="{{ 'global.js' | asset_url }}" defer></script>
  ```

### **3.2 Remove any Taillour asset pipeline references**

* Delete references to legacy CSS files
* Delete references to Taillour's JS bundles
* Delete any Tailwind shipped with Taillour (not needed)

### **3.3 Keep Taillour HTML structure and content system**

Taillour’s section structure stays.

Your build system injects styling + JS.

---

# 4. **Reconcile Taillour's HTML With Your Design System**

### **4.1 Apply Tailwind classes to Taillour markup**

Agent must begin conversion of critical structures to Tailwind:

* Header
* Navigation
* Footer
* Product page layout
* Collection page layout
* Cart drawer (if present)
* Announcement bar
* Recently viewed (if included)
* Filters (if included)

Your final theme will eventually use full Tailwind markup — for now, ensure compatibility.

### **4.2 Strip inline CSS**

Remove all inline `style=""` attributes that conflict with Tailwind.

### **4.3 Retain Taillour’s rich structures**

Taillour includes valuable pre-built features:

* Product page layout
* Collection page layout
* Gift wrapping
* Purchase together
* Recently viewed
* Breadcrumbs
* SEO schema
* Contact forms
* Subcollections support

These must remain intact **unless they conflict with your custom components**.

---

# 5. **Integrate With Existing Component System**

Your agent already created these:

* `<mds-header-menu>`
* `<mds-cart-drawer>`
* `<mds-bottom-filter-shelf>`
* `<mds-collection-filters>`
* `<mds-platform-slider>`
* `<mds-campaign-banner>`

### The task:

**Map Taillour's layout + DOM anchors to your Web Components.**

Examples:

* Replace Taillour’s mobile menu → `<mds-header-menu>`
* Replace Taillour’s cart → `<mds-cart-drawer>`
* Replace Taillour’s filter UI → `<mds-bottom-filter-shelf>` + `<mds-collection-filters>`
* Replace sliders → `<mds-platform-slider>`

---

# 6. **Preserve Multi-Store Deployment System**

The following MUST remain functional:

* `scripts/deploy.js`
* `npm run deploy`
* `/config/stores/` overrides
* `.env` and CLI-based store switching

The theme replacement should not affect deployment logic.

---

# 7. **Preserve Swiper Integration**

Taillour’s built-in product slider must be replaced with:

```
<mds-platform-slider>
```

Using your existing Swiper component wrapper.

---

# 8. **Update Documentation**

Modify:

📄 `/docs/development.md`
📄 `/docs/deployment.md`
📄 `/docs/multi-store.md`
📄 `/README.md`

All references to “Skeleton Theme” must be changed to:

> **Taillour Boilerplate Theme (ketanmistry/taillour-theme)**

Document any structural differences introduced by Taillour.

---

# 9. **Acceptance Criteria**

### ✅ Skeleton files fully removed

### ✅ Taillour theme fully scaffolded

### ✅ Vite + Tailwind continue working

### ✅ ESM + Web Components continue working

### ✅ Multi-store deploy system untouched

### ✅ Helper scripts still work:

```
npm run dev
npm run build
npm run deploy
npm run shopify:dev
```

### ✅ Theme loads with Taillour layout + your custom JS/CSS

### ✅ Swiper works

### ✅ Header + navigation functional

### ✅ Product pages + collections functional

### ✅ No Skeleton leftovers

---

# 10. **Final Deliverables**

* Fully replaced theme based on **Taillour**, not Skeleton
* Full compatibility with your existing infrastructure
* Clean Liquid architecture
* Full build integration
* Multi-store safe
* Component-ready HTML
* Updated documentation
* Zero breaking changes to tooling