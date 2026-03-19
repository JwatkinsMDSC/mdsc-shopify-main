# Shopify B2B Pricing Refactor

## Documentation Review Required Before Starting Phases:

* /home/playerreplay/projects/mdsc-shopify-theme/tasks/in-progress/1-shopify-components.md
* /home/playerreplay/projects/mdsc-shopify-theme/tasks/in-progress/2-shopify-product-main-skeleton.md
* /home/playerreplay/projects/mdsc-shopify-theme/tasks/in-progress/3-shopify-components-2.md
* /home/playerreplay/projects/mdsc-shopify-theme/tasks/in-progress/4-shopify-reuseable-contracts.md
* /home/playerreplay/projects/mdsc-shopify-theme/tasks/in-progress/5-shopify-blueprint.md

## B2B Components Already Started That Need Migrated For Shopify Theme (Leave the B2B files as is but migrate B2B prepended components, snippets, templates, layouts, etc...)


### B2B Snippets
* /home/playerreplay/projects/mdsc-shopify-theme/snippets/b2b-pagination.liquid
* /home/playerreplay/projects/mdsc-shopify-theme/snippets/b2b-product-card-quick-view.liquid
* /home/playerreplay/projects/mdsc-shopify-theme/snippets/b2b-product-card.liquid

- Note: Non B2B snippets will be replaced with our current approved designs. We need to make sure we have all of the B2B components migrated over first so that we don't lose any functionality. We need to remove all instances and remnants of Taillour Boilerplate Theme.

### B2B Layouts
* /home/playerreplay/projects/mdsc-shopify-theme/layout/b2b.liquid

- Note: b2b.liquid should be used as the default layout for all pages. This will allow us to use the same header/footer/etc... for all pages. We need to remove all instances and remnants of Taillour Boilerplate Theme.

### B2B Sections

* /home/playerreplay/projects/mdsc-shopify-theme/sections/b2b-above-footer-cta.liquid
* /home/playerreplay/projects/mdsc-shopify-theme/sections/b2b-cart-modal.liquid
* /home/playerreplay/projects/mdsc-shopify-theme/sections/b2b-countdown-timer.liquid
* /home/playerreplay/projects/mdsc-shopify-theme/sections/b2b-footer.liquid
* /home/playerreplay/projects/mdsc-shopify-theme/sections/b2b-header-filters.liquid
* /home/playerreplay/projects/mdsc-shopify-theme/sections/b2b-header.liquid
* /home/playerreplay/projects/mdsc-shopify-theme/sections/b2b-hero-collection-carousel.liquid
* /home/playerreplay/projects/mdsc-shopify-theme/sections/b2b-hero.liquid
* /home/playerreplay/projects/mdsc-shopify-theme/sections/b2b-product-grid.liquid

- Note: non B2B sections will be replaced with our current approved designs. We need to make sure we have all of the B2B sections migrated over first so that we don't lose any functionality. The other sections should be updated at minimal to use tailwind CSS v4 utility classes. We need to remove all instances and remnants of Taillour Boilerplate Theme.

### B2B Templates

* /home/playerreplay/projects/mdsc-shopify-theme/templates/index.b2b.json
* /home/playerreplay/projects/mdsc-shopify-theme/templates/page.b2b.json

- Note: These templates should remain as is. However, we may want to create a new template called index.b2b.liquid and page.b2b.liquid that extends the b2b.liquid layout. We need to remove all instances and remnants of Taillour Boilerplate Theme.

---

# PHASE 0 – Guardrails (one-time setup)

### Task 0.1 – Theme architectural ruleset

**Goal:** Prevent regressions into monolithic Liquid or inline JS.

**Instructions for agent:**

* Document and enforce these rules in a `THEME_ARCHITECTURE.md` file:

  * Sections orchestrate only
  * Snippets render markup only
  * JS owns state and logic
  * No pricing math in Liquid
  * No inline `<script>` in snippets
  * Product JSON emitted once per instance
* Add comments in new files referencing these rules.

**Outcome:**
Future work cannot accidentally violate the model.

---

# PHASE 1 – Product UI Engine (theme foundation)

This phase makes the theme “pricing-ready” even without real B2B logic.

---

### Task 1.1 – Implement canonical ProductState engine

**Goal:** Establish a shared, instance-safe product state system.

**Agent tasks:**

* Create `assets/product-state.js`
* Implement `ProductState` class exactly as defined
* Initialize state from `[data-product-json]`
* Attach state to nearest product root (`data-product-card` or `data-product-main`)

**Acceptance criteria:**

* Multiple product cards on one page do not leak state
* Variant, quantity, and pricing updates are isolated per product

(Reference architecture: )

---

### Task 1.2 – Implement event-driven controllers (no pricing yet)

**Goal:** Wire variant, quantity, image, and cart behavior without B2B logic.

**Agent tasks:**

* Create:

  * `product-variant-controller.js`
  * `product-quantity-controller.js`
  * `product-image-controller.js`
  * `product-cart-controller.js`
* All controllers must:

  * Listen to ProductState
  * Emit canonical events only
  * Never read pricing DOM

**Acceptance criteria:**

* Variant changes update images and inventory messaging
* Quantity changes update state only
* Add-to-cart uses state values

---

### Task 1.3 – Implement pricing controller (retail-only)

**Goal:** Prove pricing updates work before B2B exists.

**Agent tasks:**

* Create `product-pricing-controller.js`
* Compute:

  * base price
  * compare-at savings
* Emit `price:update` events
* Update `[data-base-price]`, `[data-compare-price]`, `[data-you-save]`

**Acceptance criteria:**

* Pricing updates correctly on variant change
* No Liquid math involved

---

# PHASE 2 – Modular Liquid structure

This phase makes the theme reusable across PDP, cards, quick view, and carousels.

---

### Task 2.1 – Product main section scaffold

**Goal:** Lock in Dawn-style orchestration.

**Agent tasks:**

* Implement `sections/product-main.liquid` exactly following the provided skeleton
* Ensure:

  * No pricing logic
  * No B2B branching
  * Product JSON emitted once

(Reference: )

---

### Task 2.2 – Product card primitive

**Goal:** Enable reuse everywhere.

**Agent tasks:**

* Create `snippets/product-card.liquid`
* Compose:

  * image
  * title
  * variant picker
  * pricing wrapper
  * quantity
  * add-to-cart
* Accept `context` param (`pdp`, `card`, `quick_view`)

(Reference: )

---

### Task 2.3 – Headless pricing data snippet

**Goal:** Separate pricing data from markup.

**Agent tasks:**

* Create `snippets/product-pricing-data.liquid`
* Output **only data attributes**, no visible UI
* Include:

  * product id
  * variant id
  * retail price
  * compare-at price

(Reference: )

---

### Task 2.4 – Pricing UI variants

**Goal:** Allow different markup without logic duplication.

**Agent tasks:**

* Create:

  * `product-pricing-retail.liquid`
  * `product-pricing-b2b.liquid` (UI only, no logic yet)
* Wrap them in `product-pricing.liquid`
* Use exclusive containers (never show both)

---

## PHASE 3 – Dummy B2B pricing simulation (demo-only)

This phase introduces a **Shopify-native, JS-only pricing resolver** that simulates the future B2B pricing service.

---

### Task 3.1 – Dummy B2B pricing resolver (Shopify-native JS)

**Goal:** Simulate future pricing service without backend dependency.

**Agent tasks:**

* Create `assets/b2b-pricing-dummy.js`
* Attach resolver to global namespace:

```js
window.B2B = window.B2B || {};
window.B2B.Pricing = window.B2B.Pricing || {};

window.B2B.Pricing.resolveDummy = function ({ productId, variantId, quantity }) {
  const MOCK = {
    eligible: true,
    tier: "professional",
    base_price: 900,
    compare_at_price: 1200,
    volume_pricing: [
      { min_qty: 10, unit_price: 850 },
      { min_qty: 25, unit_price: 800 }
    ],
    source: "collection_rule"
  };

  return new Promise(resolve => {
    setTimeout(() => resolve(MOCK), 300);
  });
};
```

* Add global feature flag:

```js
window.__USE_DUMMY_B2B__ = true;
```

**Acceptance criteria:**

* No ES modules
* No real API calls
* Deterministic demo output

---

### Task 3.2 – Integrate dummy resolver into pricing flow

**Goal:** Demonstrate future pricing integration using existing state-driven architecture.

**Agent tasks:**

* Extend ProductState during initialization:

```js
b2b: {
  enabled: true,
  eligible: false,
  pricing: null
}
```

* On variant or quantity changes:

  * Call `window.B2B.Pricing.resolveDummy` when flag is enabled
  * Store result in `state.b2b.pricing`
  * Update `state.b2b.eligible`

* Update pricing controller:

  * Remove hardcoded 15 percent logic
  * Render pricing exclusively from state
  * Toggle retail vs B2B visibility based on state

**Acceptance criteria:**

* B2B pricing updates dynamically
* Retail pricing remains fallback
* No checkout enforcement implied

---

### Task 3.3 – Demo-safe messaging

**Goal:** Prevent stakeholder confusion.

**Agent tasks:**

* Add static disclaimer text to B2B pricing UI:

  * “Demo pricing. Final price applied at checkout.”
* Ensure labels remain:

  * “Pro Price”
  * “You Save”

---

# PHASE 4 – Reuse validation (Corrected & gated)

> **Phase 4 is no longer a feature phase.**
> It is a **contract validation phase**.
> No new reuse surfaces are permitted until the engine is proven stable under real storefront conditions.

---

## Phase 4 entry criteria (MANDATORY)

Before starting **any** task below, the agent must confirm:

* Phase 1–3 engine is loaded in Shopify (via `global.js`)
* No Phase 4 feature files are present (carousel, grid, quick view)
* PDP behavior has been manually verified at least once
* Known legacy boilerplate is still present and untrusted

If any assumption is unclear, **stop and ask**.

---

## Task 4.0 – Product engine contract stabilization (BLOCKING)

### Goal

Eliminate false positives, legacy breakage, and undefined behavior **before** reuse is attempted.

This task must be completed fully before Task 4.1 is allowed.

---

### Task 4.0.1 – Formalize the product root contract

**Goal:** Make engine behavior explicit and safe.

#### Requirements

1. A valid product engine root **must** satisfy all:

   * Has `data-product-card` **or** `data-product-main`
   * Contains exactly one `[data-product-json]` child
2. Update `window.B2B.initProductUI(root)` so that:

   * Missing JSON → **skip initialization**
   * Log **one concise warning per root**
   * Never throw
3. Add an explicit opt-out:

   ```html
   data-product-engine="off"
   ```

   Roots with this attribute must be skipped silently.

#### Acceptance criteria

* No runtime errors from legacy markup
* Warnings are actionable, not spammy
* Engine never initializes a half-valid root

---

### Task 4.0.2 – Fix Shopify editor lifecycle for multi-root sections

**Goal:** Prevent leaks and partial cleanup.

#### Requirements

Update `product-ui-init.js` so that:

* `shopify:section:load`

  * Initializes **all** product roots in the section
* `shopify:section:unload`

  * Destroys **all** product roots in the section

No `querySelector` usage is allowed here. Only `querySelectorAll`.

#### Acceptance criteria

* No duplicate listeners after multiple editor reloads
* No lingering state after section removal

---

### Task 4.0.3 – Remove Taillour `ready()` dependency

**Goal:** Stop legacy JS from breaking modern execution.

#### Requirements

Locate any usage of `ready(...)` and replace with a safe wrapper:

```js
const onReady = (fn) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn);
  } else {
    fn();
  }
};
```

Legacy features (recently viewed, etc.) must:

* Not block page execution
* Fail silently if data is missing

#### Acceptance criteria

* `ready is not defined` error is fully eliminated
* Recently viewed does not break page load

---

### Task 4.0.4 – Quarantine legacy product card render paths

**Goal:** Prevent legacy HTML from poisoning validation.

#### Requirements

Identify all places that inject product markup, especially:

* `/products/:handle?view=card`
* recently viewed fetches
* legacy snippets that output `[data-product-card]`

For each path, do **one**:

* Migrate to Section Rendering API **with compliant markup**
* OR mark injected roots with:

  ```html
  data-product-engine="off"
  ```

#### Acceptance criteria

* No repeated `[data-product-json]` warnings on non-PDP pages
* All legacy markup is either compliant or explicitly opted out

---

### Task 4.0.5 – Add dev-only engine diagnostics

**Goal:** Make validation observable.

#### Requirements

Add a toggle in `global.js`:

```js
window.__ENGINE_DEBUG__ = true;
```

When enabled:

* Log init / destroy events with:

  * product id
  * context (card, main)
  * section id if available

When disabled:

* No logs except warnings/errors

#### Acceptance criteria

* Debugging is possible without permanent noise

---

## Task 4.1 – Controlled reuse validation (ONLY after Task 4.0)

> This task **may not start** until Task 4.0 is fully complete and verified.

---

### Task 4.1.1 – Single reuse surface (pilot)

**Goal:** Validate reuse in the smallest possible scope.

#### Requirements

Implement **one** of the following (not both):

* `sections/product-carousel.liquid`
  **or**
* `sections/collection-grid.liquid`

Rules:

* Must reuse existing `product-card` snippet
* No new JS controllers
* No layout logic inside JS
* Each card must initialize via the same root-based path as PDP

#### Verify

* Each card has isolated ProductState
* Variant and quantity changes do not leak
* Pricing updates affect only the active card

#### Acceptance criteria

* No shared state
* No JS errors with 10+ products
* Engine debug logs confirm clean init/destroy

---

## Task 4.2 – Quick view validation (FINAL)

**Goal:** Validate dynamic mount/unmount only after reuse is proven.

#### Requirements

* Implement `sections/quick-view.liquid`
* Reuse `product-card` snippet
* No new product logic
* Any modal JS must:

  * call `initProductUI` on open
  * call `destroyProductUI` before removal

#### Explicit validations

* Open → clean init
* Close → full destroy
* Reopen → fresh state
* No duplicated listeners

#### Acceptance criteria

* No stale state
* No assumptions about page context
* Clean lifecycle under repeated use

---

## Phase 4 exit criteria

Phase 4 is considered complete only when:

* PDP is stable
* One reuse surface is proven
* Quick view is validated
* No legacy boilerplate interferes
* Console is clean in normal operation

---

## Important note to agent

> **Do not “solve” architectural uncertainty by adding data or markup.**
> Phase 4 exists to **prove contracts**, not bypass them.

---

# PHASE 5 – Handoff & future-proofing

---

### Task 5.1 – Architecture handoff doc

**Goal:** Align team understanding.

**Agent tasks:**

* Write `THEME_PRODUCT_ENGINE.md`
* Explain:

  * ProductState
  * Event contracts
  * How dummy pricing will be replaced by App Proxy
* Include diagrams

---

### Task 5.2 – Dummy-to-real swap checklist

**Goal:** Make backend integration trivial later.

**Agent tasks:**

* Document exactly what will be replaced:

  * Dummy resolver → `/apps/b2b-pricing/resolve`
  * No UI changes
  * No state changes

---

# Why this task plan works

* Theme work starts immediately
* Stakeholders see B2B pricing behavior **without backend risk**
* Coding agent has **clear, considered boundaries**
* Nothing here is throwaway
* Dummy logic drops out cleanly when Node pricing service is ready

This is the **correct way to bootstrap a complex Shopify platform** without repeating past mistakes.
