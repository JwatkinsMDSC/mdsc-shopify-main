Here is **the cleanest, most efficient, coding-agent-ready specification format** for handing off your B2B homepage build.
This structure ensures:

* The coding agent understands *exactly* what needs to be built
* Every component is modular
* The layout is isolated inside `/b2b`
* JavaScript behavior is clearly scoped
* No retail conflicts
* No ambiguity about dependencies or expected outputs

Below is the **proper developer spec** you should pass to the coding agent.

---

# ✅ **B2B Homepage Implementation Specification (Coding-Agent Ready)**

**Project:** Player Replay — B2B Shopify Theme Module
**Page:** B2B Homepage
**Template:** `templates/index.b2b.json`
**Layout:** `b2b/layout/b2b.liquid`
**Sections prefix:** `b2b-*`
**Snippets prefix:** `b2b-*`
**Assets prefix:** `b2b-*`
**No retail theme assets or classes may be referenced.**

---

# ⭐ **1. Folder + File Structure the agent must follow**

```
/b2b/
  layout/
    b2b.liquid

  templates/
    index.b2b.json

  sections/
    b2b-header.liquid
    b2b-header-filters.liquid
    b2b-hero.liquid
    b2b-hero-collection-carousel.liquid
    b2b-product-grid.liquid
    b2b-above-footer-cta.liquid
    b2b-footer.liquid
    b2b-cart-modal.liquid
    b2b-countdown-timer.liquid

  snippets/
    b2b-product-card.liquid
    b2b-product-card-quick-view.liquid
    b2b-pagination.liquid

  assets/
    b2b-main.css
    b2b-components.css
    b2b-product-card.css
    b2b-cart.css
    b2b-countdown.css

    b2b-main.js
    b2b-filters.js
    b2b-quick-view.js
    b2b-cart.js
    b2b-countdown.js
```

---

# ⭐ **2. Template: `index.b2b.json`**

This template **must** load only B2B sections:

```json
{
  "layout": "b2b",
  "sections": {
    "header": { "type": "b2b-header" },
    "header_filters": { "type": "b2b-header-filters" },
    "hero": { "type": "b2b-hero" },
    "hero_collection_carousel": { "type": "b2b-hero-collection-carousel" },
    "product_grid": { "type": "b2b-product-grid" },
    "above_footer_cta": { "type": "b2b-above-footer-cta" },
    "footer": { "type": "b2b-footer" },
    "cart_modal": { "type": "b2b-cart-modal" },
    "countdown": { "type": "b2b-countdown-timer" }
  },
  "order": [
    "header",
    "header_filters",
    "hero",
    "hero_collection_carousel",
    "product_grid",
    "above_footer_cta",
    "footer",
    "cart_modal",
    "countdown"
  ]
}
```

---

# ⭐ **3. Functional Requirements (component-by-component)**

## **1. Header Navigation (`b2b-header.liquid`)**

* Standalone B2B header, no Shopify retail header reused
* Includes:

  * Logo
  * Main navigation links
  * Account link
  * Cart button (opens modal)
* Sticky behavior optional
* Required JS: none

---

## **2. Header Filters Navigation (`b2b-header-filters.liquid`)**

**Behavior:**

* Hidden by default
* Appears when product grid scrolls into viewport
* JS file: `b2b-filters.js` handles:

  * Scroll listener
  * IntersectionObserver detection
  * Toggle .visible class
* Provides filters (collection, tag, tier-compatible, discount-only, etc.)

---

## **3. Homepage Hero Section (`b2b-hero.liquid`)**

* Banner with headline, subheading, CTA button
* Optional background image metafield
* No retail styling reused

---

## **4. Homepage Hero Collection Swiper Carousel (`b2b-hero-collection-carousel.liquid`)**

**Requirements:**

* Uses Swiper.js (import inside `b2b-main.js`)
* Displays featured collections (metafield-driven or static admin config)
* Each slide: image, title, CTA → collection page

---

## **5. Homepage Product Grid (`b2b-product-grid.liquid`)**

**Requirements:**

* Accepts:

  * Collection handle
  * Number of products to display
* Displays:

  * Discounted products first
  * Non-discounted later
  * Uses snippet: `b2b-product-card.liquid`
* Accepts pagination inputs → uses `b2b-pagination.liquid`
* Calls `b2b-quick-view.js` when product card triggers quick view

---

## **6. Product Cards (`b2b-product-card.liquid`)**

**Fields + Behaviors:**

* Product image
* Title
* B2B price (computed via JS or metafield)
* Retail price (optional crossed-out)
* Discount percentage (if any)
* Quick View button → opens modal

**JS interaction:**

* Must expose product ID & variant ID via data attributes
* Quick view handled by `b2b-quick-view.js`

---

## **7. Product Card Quick View Modal (`b2b-product-card-quick-view.liquid`)**

**Requirements:**

* Loads product data via `/products/{{ handle }}.js`
* Shows:

  * Image gallery
  * Title
  * Price
  * Variant selector
  * Add to Cart (B2B cart modal)
  * Volume discount table (if applicable)
* JS:

  * `b2b-quick-view.js`
  * Must animate open/close

---

## **8. Pagination (`b2b-pagination.liquid`)**

**Requirements:**

* Minimal UI
* Next / Prev / page numbers
* JSON shape compatible with Shopify pagination object
* Pure B2B styling (no retail classes)

---

## **9. Above Footer CTA (`b2b-above-footer-cta.liquid`)**

A simple block that includes:

* Headline
* Subheadline
* CTA button
* Optional background image

Editable via the theme editor.

---

## **10. Footer (`b2b-footer.liquid`)**

Contains:

* Links
* Contact info
* Legal/privacy links
* B2B-specific styling

No retail footer reused.

---

## **11. Cart Modal (`b2b-cart-modal.liquid`)**

**Requirements:**

* Opens when cart button is clicked
* Shows cart line items
* B2B price calculations included
* “Proceed to Checkout” button
* Uses:

  * `b2b-cart.js`
  * Custom API calls for cart updates

---

## **12. Countdown Timer (`b2b-countdown-timer.liquid`)**

**Requirements:**

* Accepts start datetime + end datetime
* Displays:

  * Days / Hours / Minutes / Seconds
* Uses `b2b-countdown.js`
* Auto hides when expired

---

# ⭐ **4. Global JavaScript Requirements**

### `b2b-main.js`

Loads:

* Swiper
* Cart modal initialization
* Quick view initialization
* Global interactions

### `b2b-filters.js`

* Handles filter bar appearance on scroll
* Manages filter state
* Mutates product grid if needed

### `b2b-quick-view.js`

* Opens modal
* Fetches product
* Renders modal contents

### `b2b-cart.js`

* Adds items to cart
* Updates quantities
* Opens modal

### `b2b-countdown.js`

* Updates countdown timer every second

---

# ⭐ **5. Global CSS Requirements**

### `b2b-main.css`

* Reset
* Base typography
* B2B layout grid
* Colors, spacing, typography

### `b2b-components.css`

* Shared components
* Buttons
* Cards
* Forms

### `b2b-product-card.css`

* Dedicated styling for product cards

### `b2b-cart.css`

* Cart modal styling

### `b2b-countdown.css`

* Timer styling

---

# ⭐ **6. Delivery Requirements for the Coding Agent**

Provide this as the official brief:

---

## **CODING AGENT TASK BRIEF**

**Build the B2B Homepage System inside the `/b2b` directory with:**

### Templates

* `templates/index.b2b.json`

### Layout

* `b2b/layout/b2b.liquid`

### Sections

* Build all 12 homepage components:

  1. `b2b-header.liquid`
  2. `b2b-header-filters.liquid`
  3. `b2b-hero.liquid`
  4. `b2b-hero-collection-carousel.liquid`
  5. `b2b-product-grid.liquid`
  6. `b2b-product-card.liquid`
  7. `b2b-product-card-quick-view.liquid`
  8. `b2b-pagination.liquid`
  9. `b2b-above-footer-cta.liquid`
  10. `b2b-footer.liquid`
  11. `b2b-cart-modal.liquid`
  12. `b2b-countdown-timer.liquid`

### Snippets

* Any fragments needed (product card, quick view, pagination, price snippet)

### JavaScript

* `b2b-main.js`
* `b2b-filters.js`
* `b2b-quick-view.js`
* `b2b-cart.js`
* `b2b-countdown.js`

### CSS

* `b2b-main.css`
* `b2b-components.css`
* Component CSS files

### Integration Rules

* No retail assets may be used
* All sections/snippets/assets must be prefixed `b2b-`
* Code must be modular
* All Liquid files must support Shopify OS2.0 dynamic sections
* Section settings must be editable in the theme editor