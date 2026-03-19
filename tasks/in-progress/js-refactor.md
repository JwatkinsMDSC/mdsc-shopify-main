## Task: Refactor B2B JavaScript Into Professionally Structured, Reusable Components (Shopify Theme Safe)

### Context

The current B2B theme JavaScript is split across multiple feature-level files (cart, product grid, quick view, filters, etc.). While functional, **cross-cutting behaviors** (for example tooltips, drag-to-scroll, quantity controls) are implicitly duplicated and initialized from multiple places.

Shopify Liquid themes **may not support a true `/components/` directory or bundler**, so this refactor must remain compatible with:

* Plain script tags
* Asset-based loading
* Shopify Theme Editor dynamic section reloads
* AJAX DOM replacement

---

## Objective

Refactor the B2B JavaScript into a **professional, component-oriented architecture** that:

* Centralizes reusable behaviors (tooltips, drag-scroll, etc.)
* Preserves existing feature files (cart, quick view, product grid)
* Uses **data-attribute-driven initialization**
* Works without a bundler or module system
* Avoids framework assumptions (React, Vue, etc.)

---

## High-Level Design Principles

### 1. Behavior-Based Components (Not Page-Based)

Reusable UI behaviors should exist in **single authoritative modules** instead of being re-implemented in multiple feature files.

Examples:

* Tooltips
* Drag-to-scroll
* Quantity controls
* Variant swatch interactions

Each behavior should:

* Be initialized via a public API
* Accept a root element for scoped initialization
* Be safe to re-run multiple times

---

### 2. Global Namespace Pattern (Shopify-Safe)

Because ES module imports may not be available, all components should attach to a single namespace:

```js
window.B2B = window.B2B || {};
```

Each component should register itself under this namespace:

```js
window.B2B.Tooltips
window.B2B.DragScroll
window.B2B.Quantity
```

This avoids globals while remaining compatible with Liquid themes.

---

### 3. Asset-Level Organization (No Dedicated /components Directory Assumed)

If Shopify theme structure does not allow a physical `/components/` directory, components should be grouped logically using naming conventions:

Example asset layout:

```
b2b-core.js            // shared utilities & bootstrap
b2b-tooltips.js        // reusable tooltip behavior
b2b-drag-scroll.js     // reusable drag scrolling
b2b-cart.js            // feature: cart
b2b-product-grid.js   // feature: product grid
b2b-quick-view.js     // feature: quick view
```

No feature file should implement tooltip logic directly.

---

## Required Refactor Tasks

### 1. Create a Core Bootstrap File

Create or update a core file (for example `b2b-core.js`) that:

* Initializes all reusable components on `DOMContentLoaded`
* Exposes helper methods for re-initialization after DOM updates
* Handles Shopify Theme Editor events (`shopify:section:load`, etc.)

Example responsibilities:

* `B2B.init(root)`
* Re-run initializers after AJAX updates

---

### 2. Extract Tooltips Into a Single Component

Create a dedicated tooltip module that:

* Owns all tooltip creation, positioning, and cleanup
* Uses `data-tooltip` attributes as its only contract
* Renders tooltips via a **portal attached to `document.body`**
* Works inside quick view modals and overflow containers
* Exposes:

  ```js
  B2B.Tooltips.init(root)
  B2B.Tooltips.destroy(root)
  ```

Feature files must call this API instead of implementing tooltip logic themselves.

---

### 3. Update Feature Files to Use Component APIs

Refactor:

* `b2b-product-grid.js`
* `b2b-quick-view.js`
* Any other files that reference tooltips

So they:

* Do not create or style tooltips directly
* Only call `B2B.Tooltips.init(container)` after rendering HTML
* Do not assume tooltip DOM structure

---

### 4. Standardize Initialization Pattern

All components should follow the same pattern:

* Safe to call multiple times
* Scoped to a root element
* No duplicate event listeners
* No reliance on global document state

---

### 5. Preserve Existing Behavior

This refactor must:

* Not break cart, quick view, filters, or product grid behavior
* Continue working in Shopify Theme Editor
* Continue working with dynamically injected HTML
* Avoid introducing build steps or bundlers

---

## Constraints

* Do not introduce ES module imports
* Do not assume Webpack, Vite, or Rollup
* Do not rely on z-index hacks to fix tooltip issues
* Do not modify Liquid markup beyond adding or standardizing data attributes where needed

---

## Acceptance Criteria

* Reusable behaviors exist in exactly one place
* Feature files no longer contain duplicated UI logic
* Tooltips work in:

  * Product grid
  * Quick view modal
  * Any future modal or drawer
* Code structure is readable, maintainable, and Shopify-safe
* New components can be added without touching feature files

---

## Success Definition

After completion, the codebase should resemble a **professional Shopify agency theme**:

* Clear ownership of behaviors
* Predictable initialization
* No “magic” side effects
* Easy to extend without regressions