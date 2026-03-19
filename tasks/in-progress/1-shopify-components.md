Professional Shopify themes like Dawn treat a product page as a composition of reusable, isolated building blocks rather than a single monolithic template. The key idea is separation of concerns across three layers: sections for layout and orchestration, snippets for reusable UI units, and JavaScript modules for behavior. This is exactly the direction you want to migrate toward.

Below is how high quality Shopify themes structure these components and how you should translate your current design into Liquid cleanly and safely.

---

## 1. How professional Shopify themes think about a product page

### Product page = layout section + reusable subcomponents

In Dawn and similar themes:

* There is usually **one primary product section** that controls layout and data access.
* Everything inside it is composed of **snippets**.
* JavaScript is modular and scoped, never inline business logic inside templates.

The product page template itself is intentionally thin.

Example mental model:

* Template assigns the section
* Section orchestrates layout and data
* Snippets render UI
* JS handles behavior

---

## 2. Recommended file structure for your product overview page

This mirrors Dawn and scales cleanly.

### Templates

```
templates/product.json
```

This file should only declare sections.

### Sections

```
sections/product-main.liquid
sections/product-recommendations.liquid
```

`product-main.liquid` is the orchestration layer for everything above the description.

### Snippets

```
snippets/product-gallery.liquid
snippets/product-title.liquid
snippets/product-reviews.liquid
snippets/product-share.liquid
snippets/product-variant-picker.liquid
snippets/product-stock-alert.liquid
snippets/product-b2b-pricing.liquid
snippets/product-retail-pricing.liquid
snippets/product-quantity-form.liquid
snippets/product-pickup-availability.liquid
snippets/product-description.liquid
snippets/product-popular-upgrades.liquid
```

Each snippet:

* Receives only the data it needs
* Has no global assumptions
* Can be reused elsewhere

### JavaScript

```
assets/product-gallery.js
assets/product-variants.js
assets/product-b2b-pricing.js
assets/product-upgrades.js
```

Behavior is attached via data attributes, not DOM assumptions.

---

## 3. How Dawn specifically handles these concerns

### Image gallery (Swiper equivalent)

* Rendered in a snippet
* Uses Shopify media objects
* JS initialized via data attributes
* No inline JS

Dawn pattern:

* `media-gallery.liquid`
* `media-gallery.js`

Your Swiper integration should follow the same approach.

---

### Title, brand, reviews

* Rendered as plain Liquid
* Reviews are injected via app blocks or metafields
* No coupling to pricing or variants

Example:

* `product-title.liquid`
* `product-rating.liquid`

---

### Variant picker

Dawn treats variants as a first class primitive.

Key principles:

* Variant JSON embedded once using `product.variants | json`
* All variant dependent UI listens to `variant:change` events
* Picker is a snippet, not hardcoded into pricing or cart logic

Your picker snippet should:

* Emit events
* Never compute price math itself

---

### Pricing logic (B2B vs retail)

Professional themes always isolate pricing logic.

Recommended approach:

* One pricing wrapper snippet
* Two internal snippets

  * B2B pricing
  * Retail pricing

Example:

```
snippets/product-pricing.liquid
  -> renders product-b2b-pricing OR product-retail-pricing
```

Decision logic:

* Customer metafield
* Never URL params
* Never template branching scattered across files

All math lives in JS, not Liquid.

Liquid only outputs:

* Base price
* Compare at price
* Variant ID
* Upgrade product price references

---

### Popular upgrades

Handled as a standalone component.

Best practice:

* A product metafield referencing other products
* Render up to N items
* Each upgrade emits price delta events

Structure:

* `product-popular-upgrades.liquid`
* `product-upgrades.js`

Upgrades should never directly mutate pricing DOM. They emit events that pricing listens to.

---

### Stock alerts

Professional themes:

* Use inventory_quantity only as initial state
* Update via variant change events
* Avoid hardcoded messaging

Your approach is correct. Keep it isolated.

---

### Quantity + Add to cart

Handled as a single form component.

Best practice:

* One `<form>` element
* Quantity selector is a snippet
* Submit handled by JS for progressive enhancement

---

### Shop Pay and pickup availability

Dawn uses Shopify provided helpers.

* Pickup availability via `pickup-availability.liquid`
* Payment buttons via `{{ form | payment_button }}`

You should not reimplement these.

---

### Description and recommendations

These are separate sections in Dawn for performance reasons.

* Description can be inside main product section
* Recommendations should be a separate section with deferred loading

---

## 4. How to migrate what you already built

### Step 1: Identify reusable components

Anything that:

* Appears more than once
* Could appear elsewhere
* Has logic or behavior

Becomes a snippet.

### Step 2: Move logic out of HTML

* No pricing math in Liquid
* No conditionals beyond simple rendering
* No inline JS

### Step 3: Introduce event based communication

* Variant change events
* Upgrade selection events
* Pricing listens, not controls

This mirrors how Dawn works internally.

---

## 5. The most important rule

**Sections orchestrate. Snippets render. JavaScript computes.**

If a file does more than one of those, it will not scale.

---

## 6. Why this approach works long term

* You can reuse pricing in collections, quick views, and carts
* B2B logic stays isolated
* You can replace Swiper or pricing rules without touching templates
* Shopify updates are easier to merge