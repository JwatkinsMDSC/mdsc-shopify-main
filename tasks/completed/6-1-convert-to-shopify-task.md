# ⭐ **B2B HOMEPAGE SYSTEM — CODING AGENT PRD**

**Project:** B2B Micro-Theme for Shopify
**Scope:** Build the B2B Homepage and all supporting components
**Location:** `/b2b/` root directory inside main Shopify theme
**Goal:** Standalone B2B homepage with unique layout, sections, components, CSS, JS, and interactions — ZERO retail theme overlap.

---

# 0. HIGH-LEVEL OVERVIEW

The B2B homepage is part of a larger **isolated B2B micro-theme** that sits inside the primary Shopify theme.
This PRD describes:

* Template requirements
* Layout requirements
* Required sections
* Required snippets
* JS modules
* CSS modules
* Interactions
* Naming conventions
* Integration constraints

This B2B theme **must operate 100% independently** of the retail Shopify theme.

---

# 1. DIRECTORY STRUCTURE (MANDATORY)

All B2B code **must** live under `/b2b/`, except for the required Shopify root template loader files.

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

Retail theme assets, classes, or logic **cannot** be referenced.

---

# 2. TEMPLATE REQUIREMENTS

## 2.1 Template File

`templates/index.b2b.json` must define the B2B homepage sections:

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

# 3. LAYOUT REQUIREMENTS

## File: `/b2b/layout/b2b.liquid`

**Requirements:**

* Must NOT load any retail theme CSS or JS
* Must include the B2B access guard (prevents retail users from viewing B2B pages)
* Must load only B2B assets:

```liquid
{{ 'b2b-main.css' | asset_url | stylesheet_tag }}
{{ 'b2b-components.css' | asset_url | stylesheet_tag }}

<script src="{{ 'b2b-main.js' | asset_url }}" defer></script>
<script src="{{ 'b2b-filters.js' | asset_url }}" defer></script>
<script src="{{ 'b2b-quick-view.js' | asset_url }}" defer></script>
<script src="{{ 'b2b-cart.js' | asset_url }}" defer></script>
<script src="{{ 'b2b-countdown.js' | asset_url }}" defer></script>
```

---

# 4. HOMEPAGE SECTIONS — REQUIREMENTS

Each section must be fully editable in Shopify's Theme Editor.

---

## 4.1 Section: `b2b-header.liquid`

**Includes:**

* B2B-only header
* Logo
* Navigation
* Cart icon button
* Account access

Requirements:

* Sticky header optional
* No retail header code reused
* Must trigger cart modal only via B2B JS

---

## 4.2 Section: `b2b-header-filters.liquid`

**Behavior Requirements:**

* Hidden by default
* Becomes visible when product grid scrolls into view
* Controlled entirely by `b2b-filters.js`
* Must support:

  * Filter by collection
  * Filter by tag
  * Filter by discount status (tier-eligible products first)

---

## 4.3 Section: `b2b-hero.liquid`

**Editable fields:**

* Background image
* Headline
* Subheadline
* CTA Button text + URL

No retail hero reused.

---

## 4.4 Section: `b2b-hero-collection-carousel.liquid`

**Functional Requirements:**

* Uses SwiperJS
* Displays featured collections
* Each slide includes:

  * Collection image
  * Title
  * Shop CTA

JS import handled by `b2b-main.js`

---

## 4.5 Section: `b2b-product-grid.liquid`

**Core logic:**

* Accepts a collection handle
* Loads products dynamically
* Splits into:

1. **Tier-discounted products**
2. **Non-discounted products**

* Renders discounted products FIRST
* Uses snippet: `b2b-product-card.liquid`
* Supports pagination via `b2b-pagination.liquid` snippet

---

## 4.6 Snippet: `b2b-product-card.liquid`

**Displays:**

* Product image
* Title
* Retail vs tier price
* Discount badge
* Quick view button (data attributes required)

**Integration:**

* Must trigger modal in `b2b-quick-view.js`
* Must allow different discount percentages per user

---

## 4.7 Snippet: `b2b-product-card-quick-view.liquid`

**Modal Requirements:**

* Loads product details via Shopify product JSON API
* Displays:

  * Product title
  * Image gallery
  * Price (tier-adjusted)
  * Variant selector
  * Add to Cart button
* Controlled by `b2b-quick-view.js`

---

## 4.8 Snippet: `b2b-pagination.liquid`

**Requirements:**

* Next / Previous buttons
* Page index display
* Simple, lightweight markup
* Styling must be B2B-only

---

## 4.9 Section: `b2b-above-footer-cta.liquid`

Fields:

* Headline
* Subheadline
* CTA button

---

## 4.10 Section: `b2b-footer.liquid`

Requirements:

* Independent B2B footer
* Legal links
* Contact info
* Company info
* No retail footer reused

---

## 4.11 Section: `b2b-cart-modal.liquid`

**Functionality:**

* Modal slides in/out
* Shows items in cart
* Uses Shopify AJAX cart API
* Uses `b2b-cart.js` for:

  * Add to cart
  * Remove
  * Update quantity
  * Open/close modal

---

## 4.12 Section: `b2b-countdown-timer.liquid`

**Requirements:**

* Accepts start + end time
* Must render:

  * Days
  * Hours
  * Minutes
  * Seconds
* Logic handled by: `b2b-countdown.js`
* Auto-hides when expired

---

# 5. JAVASCRIPT MODULE REQUIREMENTS

All JS must be modular and live in `/b2b/assets/*`.

---

## 5.1 `b2b-main.js`

* Initializes Swiper
* Registers global listeners
* Imports: quick view, cart modal, countdown

---

## 5.2 `b2b-filters.js`

Handles:

* Showing header filter nav on scroll
* Using IntersectionObserver for performance
* Filtering product grid content (optional)

---

## 5.3 `b2b-quick-view.js`

Responsibilities:

* Attach listeners to product card quick-view buttons
* Fetch product JSON
* Render modal
* Handle variant switching
* Inject price updates

---

## 5.4 `b2b-cart.js`

Responsibilities:

* Open/close modal
* AJAX add-to-cart
* AJAX update/remove
* Sync B2B pricing

---

## 5.5 `b2b-countdown.js`

Responsibilities:

* Parse timestamp from section schema
* Update UI every second
* Handle auto-expire behavior

---

# 6. CSS MODULE REQUIREMENTS

**General rule:** No retail CSS may be referenced.

### Required files:

* `b2b-main.css` — base styles only
* `b2b-components.css` — shared classes
* `b2b-product-card.css`
* `b2b-cart.css`
* `b2b-countdown.css`

---

# 7. INTEGRATION REQUIREMENTS

### 7.1 No retail classes, selectors, snippets, or scripts allowed.

### 7.2 All B2B Liquid must use prefix `b2b-`

### 7.3 All B2B JS must use prefix `b2b-`

### 7.4 All B2B CSS must use prefix `b2b-`

### 7.5 Must work in Shopify's visual editor (OS 2.0)

---

# 8. DELIVERABLES FOR CODING AGENT

**The coding agent must produce:**

1. All `.liquid` files for required sections & snippets
2. The final `index.b2b.json`
3. The full `b2b.liquid` layout
4. All JS modules
5. All CSS modules
6. Functional product grid with quick-view modal
7. Fully interactive cart modal
8. Countdown timer component
9. Scroll-triggered filter bar animation
10. Complete homepage assembly as defined in template

---

# 9. ACCEPTANCE CRITERIA

The B2B homepage is considered **complete** when:

* Loads without any retail theme dependencies
* All JS modules function independently
* All B2B sections appear in Shopify's Visual Editor
* Quick view modal works across all products
* Cart modal fully functional
* Countdown timer operational
* Filters appear on scroll
* Product grid displays discounted products first
* Entire page fully responsive
* No errors in theme editor or browser console