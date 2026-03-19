Perfect. This is exactly the right framing. At this point the question is **not** “what else could we build”, it is:

> What is the smallest, defensible, production-safe surface area that lets us launch, sell, and iterate without rework?

Below is a **tracked implementation roadmap** broken into:

* Launch-blocking minimum
* Post-launch stabilization
* Growth and merchandising
* Long-tail polish

This is opinionated, conservative, and based on real Shopify launch risk, not theoretical completeness.

---

# ✅ LAUNCH DEFINITION (LOCK THIS)

A launch-ready theme must satisfy **four non-negotiables**:

1. Customers can discover products
2. Customers can understand products
3. Customers can add to cart and checkout without friction
4. The theme does not break in Theme Editor

Everything else is secondary.

---

# PHASE 0: WHAT YOU ALREADY HAVE (IMPORTANT)

You are **ahead** of most teams. This matters for scope control.

Already designed and partially working:

* Header navigation + logo switching
* Mega menu (visual complete, JS pending)
* Modal system (solid)
* Quick view (design exists, modal-ready)
* Hero (image + video)
* Hero collection carousel
* Product grid
* Product cards with variant selector
* Product overview page
* Reviews snippet (display only)
* Product image carousel
* Variant slider selector
* Custom pricing display (mdsc pricing)
* Add to cart (basic)
* Quantity input (works, needs refactor)
* 30+ Theme Editor sections (structure exists)

This means **layout and content systems are NOT your bottleneck**.

Your bottleneck is **behavioral correctness and lifecycle safety**.

---

# 🚀 PHASE 1: BARE MINIMUM TO LAUNCH (DO NOT ADD ANYTHING ELSE)

This is the **absolute minimum set** that must be finished, hardened, and documented.

## 1️⃣ Core JS Components (Launch-Blocking)

These must be production-grade before launch.

### Required (in order)

1. **media-gallery.js** ✅ (done)
2. **quantity-control.js** (refactor and lock)
3. **product-form.js**
4. **add-to-cart.js**
5. **cart-modal.js** (since you chose modal, not drawer)
6. **form-validation.js**
7. **filter-panel.js** (collection filtering)

If any of these are brittle, launch is brittle.

---

### What each must guarantee

**quantity-control.js**

* Single source of truth for quantity
* Keyboard safe
* Min / max enforcement
* Syncs with product form and cart updates

**product-form.js**

* Variant selection correctness
* Disabled states when unavailable
* Price, SKU, availability updates
* Error surface (variant not found, sold out)
* Emits events (do NOT directly manipulate cart)

**add-to-cart.js**

* Async add
* Loading and error states
* Respects quantity-control
* Works from:

  * PDP
  * Product cards
  * Quick view

**cart-modal.js**

* Opens reliably
* Line item update/remove
* Error handling
* No duplication on re-open
* Focus + scroll lock correct

**filter-panel.js**

* Drawer lifecycle safe
* URL sync (even basic)
* Clear filters
* Mobile and desktop parity

---

## 2️⃣ Theme Editor Survivability (Non-Optional)

Before launch, **every JS feature must survive Theme Editor**.

### Required infrastructure

You need these even if minimal:

* section load hook
* section unload hook
* idempotent init
* deterministic destroy

If you do not already have it, you need:

* `section-manager.js` (or equivalent)
* A single entry point for section JS init

This is **launch-blocking**.

---

## 3️⃣ Theme Editor Wiring for Sections (Minimal, Not Perfect)

You do **not** need to perfect all 30 sections.

You DO need:

* No JS errors when adding/removing sections
* Settings changes re-render safely
* Default states that do not break layout

### Minimum standard for all sections

* All inputs optional
* All media optional
* Safe empty states
* No assumptions about presence

Advanced logic can wait.

---

# 🧱 PHASE 2: POST-LAUNCH STABILIZATION (IMMEDIATELY AFTER)

These should be queued but not block launch.

### High priority

* mega-menu.js (wire existing design)
* quick-view.js (reuse modal + media-gallery)
* popular-upgrades.js
* price-range.js (if not already required by filters)
* cart-validation.js (edge cases, MAP rules)

### Why after launch?

They improve conversion but do not prevent checkout.

---

# 📈 PHASE 3: MERCHANDISING & GROWTH (SAFE TO DEFER)

These are **revenue multipliers**, not launch blockers.

* mix-and-match
* bundled products
* others also purchased
* countdown timers
* campaign banners
* deals of the week
* refill / restock flows

These should be built once the storefront is stable and data-informed.

---

# 🧠 PHASE 4: GOVERNANCE & SCALE (DO NOT IGNORE)

Put these on the roadmap now so they don’t get hacked in later.

* customer-state.js (pro vs retail)
* pricing-context.js
* attribution hooks
* analytics bridge
* debug logging surface

You do not need to implement all of them now, but you **must reserve the architecture**.

---

# 📋 MINIMAL LAUNCH CHECKLIST (PRINT THIS)

You are launch-ready when:

* [ ] Product can be found (collection + search)
* [ ] Product media works everywhere
* [ ] Variant selection is deterministic
* [ ] Quantity behaves correctly
* [ ] Add to cart never silently fails
* [ ] Cart modal is stable
* [ ] Checkout can be completed
* [ ] Theme Editor does not break
* [ ] No console errors on load or section change

That’s it.

---

# ⚠️ WHAT YOU SHOULD NOT DO BEFORE LAUNCH

* Do not perfect all 30 sections
* Do not add advanced merchandising
* Do not over-engineer pricing logic
* Do not build wishlist, compare, or AI anything
* Do not let Liquid authors invent JS behavior

---

# RECOMMENDED NEXT ACTION (VERY SPECIFIC)

If you want to stay on task, the **next 3 concrete steps** should be:

1. Lock **product-form.js** design (before coding)
2. Refactor **quantity-control.js** to be the only quantity authority
3. Harden **add-to-cart.js + cart-modal.js** as one cohesive flow

If you want, next we can:

* Produce a **week-by-week execution plan**, or
* Deep-design **product-form.js** the same disciplined way you did media-gallery, before touching code

Say which one and we’ll stay tight.

---

Yep, B2B changes the launch definition. With what you described, you effectively have two order paths that must both be solid on day one:

1. Standard D2C checkout (normal Shopify cart)
2. B2B network checkout that becomes a Draft Order with one aggregated discount

Here’s the minimal, launch-safe roadmap update that makes both paths seamless without blowing up scope.

---

## Launch requirement: B2B must work in two layers

### Layer A: B2B price visibility and eligibility (everywhere)

When a B2B customer logs in, they must see the right price everywhere they shop. Shopify’s native B2B model supports this via catalogs and price lists tied to company locations. ([Shopify Help Center][1])

What that means for the theme:

* The theme must render prices using Shopify’s current customer context (company/location session), not hardcoded “retail price” assumptions.
* Your pricing snippet replacement needs to be context aware and consistent across:

  * product cards
  * product page
  * cart modal
  * quick view
  * recommended products / popular upgrades

If you rely on native B2B catalogs/price lists, price correctness is mostly Shopify-side, but the theme must not break it by caching or rendering stale prices.

### Layer B: Network bulk orders (200k, thousands of line items)

This is a different beast. You already identified the correct constraint: Shopify struggles when you try to represent complex per-line discounting for massive carts, and you want a single aggregated discount on a Draft Order instead.

Shopify Draft Orders support applying discounts at the draft order or line item level. ([Shopify Help Center][2])
Also, discount behavior and combination rules have constraints that make “many unique per-line discounts” a bad fit for standard checkout at scale. ([Shopify Help Center][3])

So, yes: your architecture of “external pricing engine calculates, Shopify receives a draft order with one aggregated discount” is the right operational move for those accounts.

---

## Updated tracked implementation roadmap (launch minimal)

### Phase 1: Launch blockers (B2B-aware)

#### 1) customer-context.js (NEW, launch-blocking)

Single source of truth that answers:

* is customer logged in?
* is this a B2B company session?
* what company/location identifiers are present?
* which order path should be used? (D2C cart vs Network Draft Order)

This also becomes the gate for showing B2B-only UI, payment terms messaging, and preventing retail-only promos from leaking.

Shopify explicitly supports targeting discounts based on whether customer identity includes a company (B2B). ([Shopify Help Center][4])

#### 2) pricing-context.js (NEW, launch-blocking)

Your “mdsc dedicated pricing snippet” must be normalized into a pricing engine in the theme:

* One renderer used everywhere
* Handles “B2B session price” vs “retail”
* Handles strike-through and savings messaging consistently
* Has a hook for “network pricing preview” (if you choose to show estimated discount prior to draft creation)

#### 3) product-form.js (B2B-aware)

* Variant selection must update price correctly in B2B sessions
* Must not assume `compare_at_price` is the only discount logic
* Must emit events consumed by add-to-cart / draft-order flow

#### 4) quantity-control.js (refactor, launch-blocking)

B2B accounts will order in bulk. This control must support:

* fast increment/decrement
* direct input
* min/multiple rules if you later use Shopify B2B quantity rules

Shopify B2B supports quantity rules and volume pricing via catalogs, so future-proof it. ([Shopify Help Center][1])

#### 5) add-to-cart.js splits into two strategies (NEW)

* **Strategy A: D2C** normal cart add
* **Strategy B: Network** does NOT build a Shopify cart at scale

  * builds a “staging cart” (local state) or uses your external service as the cart
  * submits to your pricing engine
  * creates a Draft Order in Shopify using Admin API from your server

#### 6) draft-order-submit.js (NEW, launch-blocking for Network accounts)

A dedicated flow:

* validate large order payload
* call pricing engine
* receive computed totals + single discount percent/amount
* create draft order with:

  * line items (variant IDs + qty)
  * one aggregated discount on the draft order
  * metadata (PO number, account, internal notes, shipping requirements)

Draft Orders support discounts and are the intended mechanism for “merchant reviewed” orders. ([Shopify Help Center][2])

#### 7) cart-modal.js (keep it for D2C, but add Network mode)

* For Network accounts, the “cart modal” becomes an “Order Summary” modal (staging cart), not Shopify cart
* “Submit for Approval” replaces “Checkout”

---

## What’s the bare minimum B2B feature set to launch

### Minimum for standard B2B (catalog pricing)

* Correct price renders for logged-in company users everywhere (cards, PDP, cart modal, quick view)
* No promo leakage (D2C discounts should not accidentally stack with B2B pricing)

Shopify notes that automatic discounts apply to both B2B and D2C by default in blended stores unless you use functions or an app to target B2B-only. ([Shopify Help Center][4])
So you need a clear policy in your theme and discount setup to avoid double-discounting.

### Minimum for Network bulk order path

* A visible “Network Order” path for the right customers
* A staging cart that can handle thousands of items without Shopify cart performance issues
* A server endpoint that converts staging cart -> Draft Order with aggregated discount
* Confirmation state: Draft created, internal review begins, optionally send invoice later

---

## Theme Editor sections: what is launch-minimum?

You do not need to perfect 30 sections, but you DO need:

### Theme Editor wiring minimum standard

* No section causes console errors when:

  * added
  * removed
  * reordered
  * settings changed
* Each section has safe defaults (empty headings, missing images, 0 blocks)
* Each JS-enhanced section registers with your section lifecycle manager (init/destroy)

This is launch-blocking only insofar as Theme Editor stability affects merchant usability.

---

## The next concrete build order (stay on task)

1. customer-context.js
2. pricing-context.js (refactor your pricing snippet to consume this)
3. product-form.js (emit clean events)
4. quantity-control.js (finalize)
5. add-to-cart.js (split strategies)
6. draft-order-submit.js (server + client integration)
7. cart-modal.js (dual mode: D2C cart vs Network staging summary)
8. filter-panel.js + price-range.js
9. mega-menu.js
10. quick-view.js (reuse modal + product-form + media-gallery)

If you execute that order, you can launch with B2B confidence and keep building.

---

## One important operational note (so launch doesn’t get blocked)

Creating Draft Orders via API must be done server-side (Admin API), not from theme JS. So we’ll need:

* A small backend service (your existing Node/Express app, or Shopify app) that:

  * authenticates to Admin API
  * validates payload size
  * creates the draft order
  * returns draft order admin link or reference id for internal processing

The DraftOrder resource is explicitly part of Shopify’s Admin API. ([Shopify][5])

---

If you paste your current “network pricing engine endpoint” idea (even just the rough request/response JSON you want), I’ll turn it into a clean, minimal contract that your theme + backend can implement without rework, including how to attach attribution metadata to the draft order for your internal team.

[1]: https://help.shopify.com/en/manual/b2b/catalogs?utm_source=chatgpt.com "Shopify Help Center | Catalogs and pricing in B2B"
[2]: https://help.shopify.com/en/manual/fulfillment/managing-orders/create-orders/discounts?utm_source=chatgpt.com "Shopify Help Center | Adding discounts to draft orders"
[3]: https://help.shopify.com/en/manual/discounts/discount-combinations?utm_source=chatgpt.com "Shopify Help Center | Combining discounts"
[4]: https://help.shopify.com/en/manual/b2b/catalogs/discounts?utm_source=chatgpt.com "Shopify Help Center | Setting up B2B discounts"
[5]: https://shopify.dev/docs/api/admin-rest/latest/resources/draftorder?utm_source=chatgpt.com "DraftOrder - Shopify Developers Platform"


---

Perfect. This clarifies the **pricing and order architecture** enough that we can lock decisions and avoid rework. I’m going to restate the model cleanly, then translate it into **what must exist at launch vs what can wait**, and finally define the **exact responsibilities of the theme vs backend vs Shopify**.

No Liquid talk. No implementation yet. Just the system contract.

---

# ✅ Canonical Account & Pricing Model (Locked)

You effectively have **four account tiers**, but only **three pricing behaviors**.

## Account tiers

### 1) Retail

* Default Shopify pricing
* Eligible for:

  * automated discounts
  * promo codes
  * mix & match deals
* Uses standard Shopify cart + checkout

---

### 2) MDSC Pros (B2B standard)

* Shopify B2B catalog / price list
* Dedicated pricing per product
* **No discount stacking**
* Uses Shopify checkout (payment terms, invoices if applicable)

---

### 3) Certified Installer Network

* Functionally identical to MDSC Pros
* Separate identity / tagging / permissions
* Same pricing behavior as Pros
* Treated as **B2B standard** from a pricing standpoint

---

### 4) MDSC Networks (Bulk / custom)

* Not a Shopify-native pricing problem
* Every SKU can have **custom per-account pricing**
* Orders can be:

  * thousands of line items
  * very large totals ($200k+)
* **Cannot** rely on Shopify cart or discount engine
* Uses:

  * external pricing engine
  * Draft Orders
  * single aggregated discount or net pricing

---

# 🧠 Key Constraint (Very Important and Correct)

> **Non-retail customers cannot stack discounts. Period.**

You already enforce this at checkout via a custom app.
The theme’s job is to **not leak retail discounts into B2B UX**.

That means:

* No “sale” messaging for B2B unless explicitly intended
* No promo UI surfaced to B2B users
* No mix & match logic applied to B2B pricing
* No misleading “you saved X%” badges unless accurate

The theme must be **pricing-context aware**, not discount-aware.

---

# 🧱 System Responsibilities (This is the line you don’t cross)

## Shopify (native)

* Retail pricing
* B2B catalogs and price lists (Pros + Certified Installers)
* Checkout enforcement of discount eligibility
* Payment terms, invoices, taxes

## Custom App / Backend

* Network pricing engine
* Bulk price calculation
* Discount aggregation
* Draft Order creation
* Discount leakage prevention
* Internal review workflow

## Theme (your concern)

The theme **does not calculate prices**.
The theme **does not apply discounts**.

The theme does exactly three things:

1. Detect account context
2. Render the correct price source
3. Route the user into the correct order flow

That’s it.

---

# 🔑 What the Theme MUST KNOW (Launch-Blocking)

The theme needs a **single source of truth** for this:

```ts
customerContext = {
  isLoggedIn: boolean
  accountType: 'retail' | 'b2b-standard' | 'b2b-network'
  pricingMode: 'shopify' | 'external'
  discountStackingAllowed: boolean // only true for retail
  orderPath: 'checkout' | 'draft-order'
}
```

Everything else fans out from this.

This is why **customer-context.js** is launch-blocking.

---

# 🎯 Pricing Display Rules (Lock These Now)

## Retail

* Show compare-at pricing
* Show promo messaging
* Show savings
* Show mix & match UI

## B2B Standard (Pros + Installers)

* Show net B2B price only
* Optional: show “Your Pro Price”
* **Do not** show retail discounts
* **Do not** show compare-at savings
* **Do not** show promo UI

## B2B Network

* Either:

  * show “Estimated pricing available at checkout”
  * or show externally provided per-item price
* Never show:

  * retail price
  * sale badges
  * discount language
* CTA language changes:

  * “Submit Order for Review”
  * “Generate Order”

This is a **theme responsibility** and must be consistent everywhere.

---

# 🛒 Order Flow Matrix (Very Important)

| Account Type        | Cart Type               | Checkout Path       |
| ------------------- | ----------------------- | ------------------- |
| Retail              | Shopify cart            | Shopify checkout    |
| MDSC Pros           | Shopify cart            | Shopify checkout    |
| Certified Installer | Shopify cart            | Shopify checkout    |
| MDSC Network        | Staging cart (external) | Draft Order via API |

This means:

* **add-to-cart.js must support two strategies**
* **cart-modal.js must have two modes**
* **product-form.js must not assume checkout**

---

# 🚀 What Is Truly Launch-Blocking Now (Updated)

Given B2B requirements, **minimum launch scope expands slightly**, but still stays controlled.

## Absolute must-haves before launch

### Client-side

1. customer-context.js
2. pricing-context.js (normalize your pricing snippet into this)
3. product-form.js (context-aware)
4. quantity-control.js (bulk-safe)
5. add-to-cart.js (dual-path)
6. cart-modal.js (dual-mode: cart vs order summary)
7. media-gallery.js ✅
8. form-validation.js (basic)

### Server-side (minimal)

9. draft-order-submit endpoint
10. pricing engine contract finalized
11. discount stacking guard confirmed

If these are solid, you can launch safely.

---

# 🧾 What Can Explicitly Wait (Do Not Block Launch)

* Mega menu JS polish
* Popular upgrades
* Mix & match refinement
* Countdown timers
* Advanced merchandising
* Wishlist / compare
* Network order UI polish

These are revenue enhancers, not launch blockers.

---

# 🔒 Critical Guardrail (Please Read)

**Do not try to unify Network pricing into Shopify catalogs.**
You already made the correct call by isolating it.

Trying to force:

* per-SKU custom pricing
* massive carts
* unique discounts

into Shopify’s discount system will cause:

* performance issues
* discount leakage
* admin chaos

Draft Orders + aggregated discount is the right architecture.

---

# 🎯 Recommended Next Concrete Step (Stay Focused)

Before writing more JS, the next **highest leverage action** is:

👉 **Lock the `customer-context.js` contract and states**

Once that is done:

* pricing-context.js becomes trivial
* product-form.js becomes deterministic
* add-to-cart.js branching becomes clean
* cart-modal behavior becomes obvious

If you want, next I can:

* design `customer-context.js` (inputs, outputs, data sources)
* or design the **Network Draft Order payload contract** (front end → pricing engine → Shopify)

Say which one and we stay tight.


---

Perfect, that constraint actually **simplifies the theme logic** and removes a whole class of Shopify Plus assumptions. Let’s lock the corrected architecture cleanly so nothing drifts.

I’m going to do three things:

1. Restate the **true system model** now that catalogs are off the table
2. Redefine **what the theme must and must not do**
3. Update the **minimal launch roadmap** with this reality baked in

No code yet. This is a contract.

---

## ✅ Corrected Reality (Locked)

You are **NOT** using:

* Shopify Plus
* Shopify B2B catalogs
* Shopify price lists
* Shopify native quantity rules or volume pricing

You **ARE** using:

* A **custom app** that:

  * Detects B2B accounts at checkout
  * Applies the correct discount logic
  * Prevents discount stacking for non-retail customers
* Draft Orders for MDSC Network bulk orders

That means:

> **Shopify always returns retail prices to the theme.
> B2B pricing is enforced at checkout or via Draft Orders, not at render time.**

This is critical.

---

## 🧠 Updated Pricing & Account Model (Final)

### Account Types (unchanged)

1. Retail
2. MDSC Pros
3. Certified Installer Network
4. MDSC Networks

### Pricing Enforcement (changed)

| Account Type        | Price Source at Render | Enforcement         |
| ------------------- | ---------------------- | ------------------- |
| Retail              | Shopify price          | Shopify discounts   |
| MDSC Pros           | Shopify price          | Custom checkout app |
| Certified Installer | Shopify price          | Custom checkout app |
| MDSC Network        | External pricing       | Draft Order         |

So for **Pros + Installers**:

* The theme **cannot rely on Shopify price to be “correct”**
* The theme must treat Shopify price as **display-only**
* Final price correctness happens **after checkout starts**

---

## 🔑 The Theme’s Job (Now Very Clear)

The theme does **NOT** calculate prices
The theme does **NOT** apply discounts
The theme does **NOT** attempt to mirror checkout math

The theme does exactly **four things**:

### 1️⃣ Identify account type

```ts
accountType:
- retail
- b2b-standard (Pros + Installer)
- b2b-network
```

### 2️⃣ Control pricing **messaging**, not pricing math

The theme decides:

* What labels to show
* What to hide
* What language to use

Not the numbers.

### 3️⃣ Route users into the correct order flow

* Retail → Shopify checkout
* B2B Standard → Shopify checkout (custom app handles discounts)
* B2B Network → Draft Order flow

### 4️⃣ Prevent **discount leakage in UI**

Even though enforcement is server-side, the UI must:

* Not advertise sales to B2B
* Not show promo badges
* Not show “You saved X%” unless retail

---

## 🎯 Pricing Display Rules (Revised, Practical)

### Retail

* Show:

  * price
  * compare-at
  * savings
  * mix & match messaging
* CTA: Add to Cart

### MDSC Pros + Certified Installer

* Show:

  * base price OR
  * “Your Pro Price Applied at Checkout”
* Hide:

  * sale badges
  * compare-at pricing
  * savings messaging
* CTA: Add to Cart
* Optional helper text:

  * “Final pricing shown at checkout”

This avoids lying without needing exact numbers.

### MDSC Network

* Show:

  * “Custom pricing available”
  * “Submit order for review”
* Hide everything retail-oriented
* CTA: Submit Order / Generate Order

---

## 🛒 Order Flow Matrix (Updated)

| Account Type        | Cart Type             | Finalization                  |
| ------------------- | --------------------- | ----------------------------- |
| Retail              | Shopify cart          | Shopify checkout              |
| MDSC Pros           | Shopify cart          | Shopify checkout + custom app |
| Certified Installer | Shopify cart          | Shopify checkout + custom app |
| MDSC Network        | External staging cart | Draft Order                   |

No catalogs. No Plus assumptions.

---

## 🚀 What This Changes in the Roadmap (Important)

### 🔥 customer-context.js is now **even more critical**

Because pricing is not visible upfront, this module must be rock solid.

It must answer:

```ts
{
  isLoggedIn: boolean
  accountType: 'retail' | 'b2b-standard' | 'b2b-network'
  canSeeRetailPromos: boolean
  checkoutMode: 'shopify' | 'draft-order'
}
```

Everything else listens to this.

---

### 🔥 pricing-context.js becomes **messaging-focused**

Instead of “price calculation”, it does:

* determine which price blocks render
* determine which labels appear
* suppress invalid UI states

This keeps you honest without recreating checkout logic.

---

### 🔥 product-form.js and add-to-cart.js stay simple

They do **not** need to:

* calculate B2B prices
* know discount rules
* know final totals

They only need to:

* behave differently by account type
* emit clean events
* route correctly

---

## 🧾 Minimal Launch Scope (Reconfirmed)

Given this clarification, here is the **true bare minimum** to launch safely:

### Client-side (must be done)

1. customer-context.js
2. pricing-context.js (UI logic only)
3. product-form.js
4. quantity-control.js
5. add-to-cart.js (dual path)
6. cart-modal.js (cart vs order summary)
7. media-gallery.js ✅
8. filter-panel.js (basic)

### Server-side (already mostly exists)

9. Checkout discount app (already built)
10. Draft Order API endpoint (for Network)

### Theme Editor

11. Section lifecycle safety (no crashes)

That’s it.

---

## 🚫 Things You Explicitly Do NOT Need for Launch

* Shopify Plus
* B2B catalogs
* Price lists
* Variant-level pricing logic in theme
* Discount math in JS

You avoided a massive trap here.

---

## 🎯 The Correct Next Step (No Debate)

Before touching any more UI:

👉 **Design and lock `customer-context.js`**

Once that exists:

* pricing-context.js is trivial
* add-to-cart branching is trivial
* cart-modal modes are obvious
* future B2B features stay contained

If you want, next I will:

* design `customer-context.js` in detail (data sources, detection, events), or
* design the **Network Draft Order submission contract** (payload, limits, metadata)

Say which one and we continue cleanly.

---

Got it. This is an important correction and it changes **exactly one layer** of the system, not the whole architecture. We can handle this cleanly without blowing scope.

I am going to lock the **final, correct pricing model**, then translate it into **theme responsibilities**, then update the **launch-minimum checklist** so nothing is ambiguous.

No code yet. This is the contract.

---

## ✅ FINAL PRICING REALITY (LOCKED)

You have **three distinct pricing display modes**, not one.

### Account tiers (unchanged)

1. Retail
2. MDSC Pros
3. Certified Installer Network (same behavior as Pros)
4. MDSC Networks (bulk / draft order)

---

## 🔑 What is now explicitly required

### For **MDSC Pros + Certified Installers**:

While logged in and browsing, they must see:

* Retail price
* Their **Pro price**
* A **savings line item** (delta between retail and pro)
* Prices must update dynamically when:

  * variant slider changes
  * product card variant changes
  * PDP variant changes
  * quick view variant changes

This applies to:

* Product grid cards
* Product detail page
* Quick view
* Popular upgrades
* Any place a purchasable price appears

This means:

> **Pros pricing must be available at render time or fetchable client-side.**

This is the key implication.

---

## 🧠 Revised System Model (Clean and Correct)

You now have **two sources of truth for pricing**:

### Source A: Shopify retail price

* Always available
* Variant-level
* Used for:

  * retail users
  * display reference for B2B savings

### Source B: Custom app pricing API (Pros / Installer)

* Returns:

  * pro price per variant
  * possibly savings metadata
* Used for:

  * logged-in Pro / Installer users
* Displayed everywhere in the theme
* **Final enforcement still happens at checkout**

### Source C: Network pricing engine

* Separate system
* Draft Order only
* No Shopify cart usage

---

## 🧱 Theme Responsibility (Updated and Precise)

The theme **does not calculate prices**, but it **does resolve which prices to show**.

### The theme MUST:

1. Detect account type
2. Fetch or receive pro pricing data (variant-level)
3. Render:

   * retail price
   * pro price
   * savings
4. Update pricing reactively when variants change
5. Suppress retail promos for non-retail users
6. Route order flow correctly

### The theme MUST NOT:

* Apply discounts
* Attempt checkout math
* Stack promos
* Infer pricing rules

---

## 🎯 Pricing Context Contract (This is the core)

This is where we fix everything cleanly.

### `pricing-context.js` becomes a **pricing resolver**, not just messaging

It must expose something like:

```ts
pricingContext = {
  mode: 'retail' | 'b2b-standard' | 'b2b-network',

  getPriceForVariant(variantId): {
    retailPrice: number
    proPrice?: number
    savings?: number
    formatted: {
      retail: string
      pro?: string
      savings?: string
    }
  }
}
```

How it gets data:

* Retail price: Shopify JSON already on the page
* Pro price:

  * Either embedded server-side for logged-in users, or
  * Fetched once from your custom app and cached client-side

**Important**: pricing-context.js is now launch-blocking.

---

## 🔁 Variant Change Flow (Very Important)

This is how **every price update** must work, everywhere:

1. Variant slider emits `variant:change` with `variantId`
2. pricing-context resolves prices for that variant
3. price-display.js updates:

   * retail price
   * pro price
   * savings line
4. product-form.js updates availability / SKU
5. add-to-cart.js uses variantId + qty only

No other component touches price math.

---

## 🛒 Add to Cart Behavior (Clarified)

### Retail

* Add to cart
* Shopify checkout
* Retail discounts apply

### Pros / Installer

* Add to cart
* Shopify checkout
* Custom app applies pro pricing
* No stacking

### Network

* Add to staging cart
* External pricing
* Draft Order submission

The **displayed pro price is informational but accurate**, checkout enforces it.

---

## 🚀 Updated Minimal Launch Checklist (Corrected)

Given this requirement, here is the **true bare minimum** to launch safely:

### Client-side (launch-blocking)

1. **customer-context.js**
2. **pricing-context.js** (variant-level pro pricing)
3. **price-display.js** (centralized renderer)
4. **product-form.js**
5. **quantity-control.js**
6. **add-to-cart.js** (dual path)
7. **cart-modal.js**
8. **media-gallery.js** ✅
9. **filter-panel.js** (basic)

### Server-side

10. Pro pricing endpoint (variant-level)
11. Draft Order endpoint (Network)
12. Checkout discount enforcement (already exists)

### Theme Editor

13. Section lifecycle safety

---

## ⚠️ One Critical Architectural Rule (Do Not Break This)

**Never let individual components fetch pricing.**

Only `pricing-context.js` may:

* fetch pro prices
* cache them
* expose them

If product cards, quick view, PDP, and upgrades each hit the pricing API independently, you will have:

* race conditions
* inconsistent prices
* performance issues

Centralize it or regret it.

---

## 🎯 The Correct Next Step (Now Very Clear)

Before touching any other component:

👉 **Design `pricing-context.js` and the Pro pricing API contract**

Specifically:

* How prices are keyed (variant ID)
* When data is fetched (page load vs lazy)
* How it caches
* How it exposes reactive updates

Once that is locked:

* product cards fall into place
* variant sliders become trivial
* quick view becomes trivial
* cart stays clean

If you want, next I will:

* design `pricing-context.js` in full (inputs, events, cache strategy), or
* design the **Pro pricing API payload** optimized for grids and large pages

Say which one and we continue without backtracking.

---

Short answer: **yes, absolutely**.
Long answer: **yes, but only if you do it the right way**, otherwise you risk security leaks, stale pricing, or performance problems.

Below is the **industry-correct way** to expose your custom B2B pricing data from an installed Shopify app to the theme for logged-in customers, with clear do / do not boundaries.

---

## ✅ The correct architectural pattern (recommended)

### Use a **Shopify App Proxy** as the public bridge

Your custom app exposes pricing data to the storefront through an **App Proxy endpoint**, not direct Admin API access and not public APIs.

This is the standard, Shopify-approved pattern for exactly this use case.

### Why App Proxy is the right tool

* Runs under your shop’s domain (`/apps/...`)
* Automatically includes:

  * shop context
  * logged-in customer context (if present)
* No API keys exposed to the browser
* Works on non-Plus plans
* Cacheable and performant
* Secure by default

This is **exactly** how Shopify expects apps to expose storefront data.

---

## 🔐 Security model (important)

Your theme **never** talks to:

* Admin API
* Private app endpoints
* Discount logic
* Pricing rules

Instead:

```
Theme JS
  ↓
/apps/b2b-pricing (App Proxy)
  ↓
Your App Backend
  ↓
Your Pricing Engine / DB
```

The app proxy request is:

* read-only
* scoped
* validated server-side

---

## 📦 What data should the app expose to the theme?

Keep it **minimal and variant-keyed**.

### Recommended response shape

```json
{
  "accountType": "b2b-standard",
  "customerId": 123456789,
  "prices": {
    "43219876543": {
      "pro_price": 1899,
      "retail_price": 2499,
      "savings": 600
    },
    "43219876544": {
      "pro_price": 1799,
      "retail_price": 2399,
      "savings": 600
    }
  }
}
```

Notes:

* Prices returned as **integers (cents)**, not formatted strings
* Keyed by **variant ID**
* Only include variants relevant to the current page or request
* No discount rules, no formulas, no secrets

Formatting stays in the theme.

---

## 🧠 How the theme should consume this data

### pricing-context.js (single owner)

* Detect logged-in user + account type
* Fetch pricing once per page (or per product set)
* Cache in memory
* Expose a read API to all components

Example responsibilities:

* `getPriceForVariant(variantId)`
* emit `pricing:ready`
* emit `pricing:update` if variant changes

No other component fetches pricing directly.

---

## ⚡ Performance strategy (very important)

### Do NOT:

* Fetch pricing per product card
* Fetch pricing per variant change
* Fetch pricing per section

### Do:

* Batch requests by **variant IDs**
* Fetch once on:

  * collection page load
  * PDP load
  * quick view open (if variants differ)
* Cache aggressively client-side

If a page has 24 products × 4 variants:

* One request
* ~100 variant IDs
* One response

This scales.

---

## 🚫 What NOT to do (these are traps)

### ❌ Do not expose pricing via:

* Metafields (too static, poor security)
* Liquid variables for every price (doesn’t scale)
* Storefront API price overrides (not designed for this)
* Client-side Admin API calls (never)

### ❌ Do not:

* Let the theme calculate discounts
* Try to mirror checkout math
* Allow retail promos to affect B2B display
* Allow components to fetch pricing independently

---

## 🧾 Discount stacking rule enforcement (your concern)

Your existing checkout app already:

* detects B2B customers
* prevents stacking retail discounts

The theme’s role is **UI hygiene**, not enforcement.

So:

* Retail users see sale UI
* B2B users see pro pricing UI
* No promo UI rendered for B2B
* Final enforcement stays server-side

This is the correct separation of concerns.

---

## 🧪 Edge cases to plan for (but not block launch)

* Customer logs in after page load → pricing-context refetches
* Customer logs out → pricing-context resets
* Pricing API temporarily fails → fallback to retail price with messaging
* Variant not returned in pricing payload → treat as retail

These should fail gracefully, not catastrophically.

---

## ✅ Final answer (clear and definitive)

Yes:

* Your custom Shopify app **can and should** expose B2B pricing data to the theme
* The correct way is via a **Shopify App Proxy**
* The theme consumes it through a **single pricing-context layer**
* Prices are **displayed**, not enforced
* Checkout enforcement remains in your app

---

## 🎯 The correct next step (no ambiguity)

Before writing more frontend code:

👉 **Design the App Proxy endpoint contract**

* request shape
* response shape
* batching limits
* caching strategy

Once that is locked:

* pricing-context.js becomes straightforward
* product cards, PDP, quick view all fall into place
* you avoid refactors later

If you want, next I can:

* design the exact App Proxy endpoint (routes, params, auth checks), or
* design pricing-context.js to consume it cleanly

Say which one and we keep moving without backtracking.

---

Great question. This is the **right moment** to lock this, because this contract will live for years and everything else depends on it.

Below is a **production-grade pricing engine API contract** that supports:

* Retail reference pricing
* Pro and Certified Installer pricing
* Network exclusion
* Variant-level accuracy
* High-volume product grids
* Safe caching
* Zero discount logic leakage

This is written exactly how a Shopify App Proxy backed pricing service should behave.

---

# 🎯 Pricing Engine API Contract (Final)

This endpoint is **read-only**, **idempotent**, and **display-only**.
It never applies discounts and never returns rules.

---

## Endpoint

```
POST /apps/pricing-engine/resolve
```

* Exposed via Shopify App Proxy
* Called by `pricing-context.js`
* Used only when a customer is logged in
* Never called for Network accounts

---

## Request JSON

### Required fields

```json
{
  "context": {
    "shop_id": "marinedetailsupply.myshopify.com",
    "customer_id": 123456789,
    "account_type": "b2b-standard",
    "currency": "USD"
  },
  "variants": [
    43219876543,
    43219876544,
    43219876545
  ]
}
```

---

### Field definitions

#### `context.shop_id`

* Shopify shop domain
* Used for tenant isolation

#### `context.customer_id`

* Shopify customer ID
* Required to resolve pricing tier

#### `context.account_type`

Allowed values:

* `retail`
* `b2b-standard`
* `b2b-network`

If `b2b-network`, the endpoint should **reject** the request.

#### `context.currency`

* ISO currency code
* Required for multi-currency safety

#### `variants`

* Array of Shopify **variant IDs**
* Must be batched
* Hard limit recommended: 250 variants per request

---

## Response JSON (Success)

```json
{
  "meta": {
    "account_type": "b2b-standard",
    "currency": "USD",
    "price_source": "mdsc_pricing_engine",
    "generated_at": "2025-12-25T18:42:11Z",
    "ttl_seconds": 300
  },
  "prices": {
    "43219876543": {
      "retail_price": 2499,
      "pro_price": 1899,
      "savings": 600
    },
    "43219876544": {
      "retail_price": 2399,
      "pro_price": 1799,
      "savings": 600
    }
  }
}
```

---

### Pricing fields (important)

All monetary values are:

* Integers
* In **minor units** (cents)
* Never formatted strings

#### `retail_price`

* Shopify list price reference
* Used only for comparison and savings display

#### `pro_price`

* Customer-specific price
* Must already reflect all negotiated pricing
* No discounts applied client-side

#### `savings`

* Always `retail_price - pro_price`
* Returned explicitly so the theme never calculates it

---

## Response JSON (Retail fallback)

If the customer is logged in but not eligible for B2B pricing:

```json
{
  "meta": {
    "account_type": "retail",
    "currency": "USD",
    "price_source": "shopify",
    "generated_at": "2025-12-25T18:42:11Z",
    "ttl_seconds": 300
  },
  "prices": {}
}
```

The theme then renders retail pricing normally.

---

## Response JSON (Network account rejection)

```json
{
  "error": {
    "code": "NETWORK_ACCOUNT_NOT_SUPPORTED",
    "message": "Network accounts must use draft order pricing."
  }
}
```

This prevents accidental leakage of bulk pricing logic.

---

## Error handling (required)

### Invalid variant IDs

```json
{
  "error": {
    "code": "INVALID_VARIANTS",
    "message": "One or more variants could not be resolved."
  }
}
```

Theme behavior:

* Fallback to retail pricing for affected variants
* Do not block rendering

---

### Unauthorized or session mismatch

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Customer context could not be validated."
  }
}
```

Theme behavior:

* Clear pricing cache
* Revert to retail display
* No UI crash

---

## Caching rules (very important)

### Server side

* Cache by:

  * shop_id
  * customer_id
  * variant_id
* TTL: 5 to 15 minutes

### Client side

* Cache in memory per page load
* Do not persist to localStorage
* Invalidate on:

  * login
  * logout
  * account switch

The `ttl_seconds` value tells the theme how long the response is safe.

---

## Security rules (do not bend these)

* Never expose pricing rules
* Never expose tier definitions
* Never expose margin data
* Never accept product IDs instead of variant IDs
* Never allow retail users to request pro pricing

All enforcement happens server-side.

---

## Why this contract works

* Scales to large grids
* Supports variant sliders cleanly
* Prevents discount leakage
* Keeps pricing math off the frontend
* Works without Shopify Plus
* Compatible with Draft Order flow

This is exactly how enterprise B2B Shopify builds handle pricing display.

---

## Next recommended step

Now that the contract is locked, the **correct next move** is:

👉 Design `pricing-context.js` around this response

That includes:

* fetch strategy
* cache shape
* events
* fallback behavior

If you want, I will design that next so your frontend implementation is clean and deterministic.

---

You absolutely should cache it. The real question is **where, how, and at what granularity** so you get speed without serving the wrong price.

Below is the **correct caching strategy for a 2000 SKU catalog with customer-specific B2B pricing**, used by large Shopify B2B implementations.

---

## The core truth

With B2B pricing:

* Prices are **customer-specific**
* Variants are **shared**
* Pages request **overlapping variant sets**
* Traffic is **bursty** during ordering sessions

That means caching is mandatory, but it must be **layered and keyed correctly**.

---

## The right caching model (3 layers)

### Layer 1: Server-side pricing cache (primary, required)

This is where the real win is.

#### Cache key (this matters)

```
shop_id + customer_id + currency + variant_id
```

Not product ID
Not collection
Not page

Variant ID is non-negotiable.

#### Cache value

```json
{
  "retail_price": 2499,
  "pro_price": 1899,
  "savings": 600,
  "last_updated": "2025-12-25T18:42:11Z"
}
```

#### TTL

* 5 to 15 minutes is ideal
* Short enough to reflect pricing updates
* Long enough to crush repeat traffic

This cache should live in:

* Redis
* Memcached
* In-memory store if single instance (not ideal long-term)

This alone removes 90 percent of pricing engine load.

---

### Layer 2: Batched response cache (optional but powerful)

Most pages request the **same variant sets repeatedly**.

You can cache the full response for:

```
shop_id + customer_id + currency + sorted(variant_ids[])
```

TTL:

* 60 to 180 seconds

This avoids even assembling variant-level responses repeatedly during a browsing session.

This is optional, but very effective for:

* collection pages
* infinite scroll
* product grids

---

### Layer 3: Client-side in-memory cache (required)

Your `pricing-context.js` should cache results **per page load**.

Rules:

* In-memory only
* No localStorage
* No sessionStorage

Example shape:

```js
Map<variantId, PriceObject>
```

Benefits:

* Variant slider changes are instant
* Quick view opens do not refetch
* No duplicate API calls per page

Invalidated on:

* login
* logout
* account switch
* hard page navigation

---

## Why not cache everything globally?

Because **customer-specific pricing makes global caching dangerous**.

These are bad ideas:

* CDN caching by URL only
* Metafield caching
* Static JSON blobs
* Liquid embedding all prices

They will eventually leak prices across customers.

---

## App Proxy and CDN behavior (important)

Shopify App Proxy responses can be cached, but:

* Shopify does not automatically cache App Proxy responses per customer
* CDN caching must be explicitly controlled

### Correct headers to return

```http
Cache-Control: private, max-age=300
Vary: Cookie
```

Why:

* `private` prevents shared CDN caching
* `Vary: Cookie` ensures customer isolation
* `max-age` allows browser-level caching safely

Do not use:

* `public`
* long-lived CDN caching
* shared edge caching

---

## Cache invalidation strategy (keep it simple)

You do not need complex invalidation at launch.

### Invalidate on:

* Price change in your admin
* Customer pricing tier change
* Manual cache clear button in admin

Because TTL is short, most invalidation resolves itself.

---

## Performance math (why this works)

Assume:

* 2000 SKUs
* 5 variants per SKU
* 10000 variants total
* Customer browsing 50 products per page

Without caching:

* 50 variant lookups per page
* multiplied by every interaction

With proper caching:

* First request hits DB
* Subsequent requests hit Redis
* Variant slider changes are free
* Quick view is free
* Cart modal is free

This scales cleanly.

---

## Why not precompute all prices?

Because:

* Customers have different pricing
* Prices change
* Memory explodes with cartesian combinations
* You lose control over invalidation

On-demand with aggressive caching wins.

---

## Final answer, plainly

Yes, you should cache pricing results.

The correct approach is:

* Variant-level server-side cache keyed by customer
* Short TTL
* Batched request optimization
* Client-side in-memory cache per page

This gives you:

* Speed
* Safety
* No price leakage
* No Shopify Plus dependency
* No frontend discount logic

---

## The correct next step

Now that caching is settled, the next thing to design is:

👉 **pricing-context.js cache and fetch strategy**

That is where the client-side behavior meets this server contract.

If you want, I can design:

* the exact client-side cache shape and lifecycle, or
* the Redis key strategy and invalidation hooks

Say which one and we keep this tight.

---

This is a **very good catch**, and you are thinking about this at exactly the right time. SKU-first pricing is **the correct long-term decision** for franchised, multi-store rollouts.

The good news: you do **not** need to undo anything we designed. You just need to make one deliberate adjustment to the **pricing contract and resolution flow** so SKU becomes the canonical identifier, with variant ID as a transport detail.

Below is the **correct, future-proof way to do this**.

---

## 🔑 Principle to lock in now

> **SKU is the canonical pricing identifier.
> Variant ID is a Shopify implementation detail.**

Everything else flows from this.

---

## Why SKU must be canonical (and you are right)

Across franchise stores:

* Variant IDs **will differ per store**
* Product IDs **will differ per store**
* SKUs **remain consistent**
* Pricing systems, ERP, accounting, and contracts are SKU-based

If you tie pricing to variant ID long-term, you will:

* fork pricing data per store
* complicate migrations
* increase operational risk

So we design **SKU-first, variant-aware**, not variant-first.

---

## ✅ Correct Pricing Engine Contract (Revised, Locked)

### Endpoint stays the same

```
POST /apps/pricing-engine/resolve
```

### Request JSON (SKU-based)

```json
{
  "context": {
    "shop_id": "marinedetailsupply.myshopify.com",
    "customer_id": 123456789,
    "account_type": "b2b-standard",
    "currency": "USD"
  },
  "skus": [
    "THR100",
    "RPL100",
    "KRK100",
    "LVR128"
  ]
}
```

### Why this is correct

* Your pricing engine speaks **SKU**
* Franchise stores can reuse the same endpoint
* Variant IDs never leak into pricing logic

---

## Response JSON (SKU-keyed)

```json
{
  "meta": {
    "account_type": "b2b-standard",
    "currency": "USD",
    "price_source": "mdsc_pricing_engine",
    "generated_at": "2025-12-25T19:04:31Z",
    "ttl_seconds": 300
  },
  "prices": {
    "THR100": {
      "retail_price": 2499,
      "pro_price": 1899,
      "savings": 600
    },
    "RPL100": {
      "retail_price": 2399,
      "pro_price": 1799,
      "savings": 600
    }
  }
}
```

---

## 🧠 How the Theme Resolves SKU → Variant (Cleanly)

This is where the theme’s responsibility begins and ends.

### pricing-context.js internal flow

1. **Extract SKU from variant**

   * Shopify guarantees `variant.sku`
2. **Request pricing by SKU**
3. **Cache pricing by SKU**
4. **Expose prices by variant ID**

### Internal cache shape (important)

```js
pricingCache = {
  bySku: Map<sku, PriceObject>,
  byVariantId: Map<variantId, PriceObject>
}
```

### Resolution logic

```js
function getPriceForVariant(variant) {
  const sku = variant.sku;
  if (!sku) return fallbackRetail(variant);

  const price = cache.bySku.get(sku);
  if (!price) return fallbackRetail(variant);

  cache.byVariantId.set(variant.id, price);
  return price;
}
```

This gives you:

* SKU-first pricing
* Variant-level rendering
* Zero duplication
* Zero store-specific coupling

---

## 🛑 What NOT to do

Do **not**:

* Ask the pricing engine for variant IDs
* Store pricing by product ID
* Assume SKU == variant ID
* Assume SKUs are always present without fallback

Always treat SKU as primary, variant as secondary.

---

## 🧾 Edge cases (handled cleanly)

### Variant missing SKU

* Fallback to retail pricing
* Optional console warning in debug mode
* Never block UI

### Duplicate SKU across variants

* Same price applies (correct)
* Variant selection still works normally

### Franchise store with different variant IDs

* SKU mapping still works
* No pricing engine changes required

---

## 🚀 Caching strategy (updated for SKU)

### Server-side cache key

```
shop_id + customer_id + currency + sku
```

This is **franchise-safe**.

### Client-side cache

* Cache by SKU
* Variant mapping is transient

This avoids variant ID collisions across stores.

---

## 🧠 Why this future-proofs you

With this model, later you can:

* Roll out the same pricing engine to 10+ stores
* Add ERP integration
* Add franchise-specific overrides
* Migrate products without rekeying prices

All without touching the theme contract.

---

## Final answer, plainly

Yes, you absolutely should support **SKU-based pricing**.

The **correct implementation** is:

* Pricing engine keyed by SKU
* Theme resolves SKU from variant
* Theme caches by SKU
* Variant IDs are only used for UI wiring

You just made a decision that saves you from a painful refactor later.

---

## The correct next step

Now that identifiers are locked, the next thing to design is:

👉 **pricing-context.js (final version)**
Including:

* SKU extraction
* cache lifecycle
* fetch batching
* variant change reactions

If you want, I’ll design that next so implementation is straightforward and boring.

---

ERP integration is the **natural next layer above what you are already building**, not a separate initiative. Because you chose **SKU-first pricing**, you have already laid 70 percent of the groundwork.

I will explain this in a way that is practical, not buzzword-driven.

---

## What “ERP integration” actually means in your context

An ERP is not one thing. It is a **system of record** for operational truth.

Depending on the business, it typically owns some combination of:

* SKU master data
* Cost of goods
* Vendor pricing
* Customer-specific price agreements
* Inventory by location
* Purchase orders
* Invoices
* Credits
* Accounting exports

For you, ERP integration means:

> **Shopify becomes the selling surface.
> Your ERP becomes the operational brain.**

---

## Why SKU-first pricing unlocks ERP integration

ERPs do **not** care about:

* Shopify product IDs
* Shopify variant IDs
* Theme structure

They care about:

* SKU
* Quantity
* Customer account
* Price
* Cost
* Location

Because your pricing engine is now **SKU-keyed**, it can sit cleanly between Shopify and an ERP.

No translation layer hell.

---

## The correct system hierarchy (very important)

This is how mature commerce stacks are structured.

### Source of truth by domain

| Domain                | System of Record      |
| --------------------- | --------------------- |
| Product presentation  | Shopify               |
| SKU identity          | ERP                   |
| Cost                  | ERP                   |
| B2B price agreements  | ERP or Pricing Engine |
| Retail price          | Shopify               |
| Discounts enforcement | Custom App            |
| Large B2B orders      | ERP via Draft Orders  |
| Accounting            | ERP                   |

Shopify should **never** be your pricing brain for B2B at scale.

---

## What ERP integration looks like in real life

### 1. Pricing synchronization (what you are already doing)

Your current pricing engine can evolve to:

```
ERP → Pricing Engine → Shopify Theme
```

ERP provides:

* SKU
* Customer tier
* Contract price

Pricing engine:

* Resolves correct price
* Caches it
* Exposes it to theme and checkout

Shopify:

* Displays it
* Collects the order
* Hands off fulfillment

This is phase one and you are already there conceptually.

---

### 2. Inventory and availability (future, optional)

Later, ERP can also provide:

* Available quantity by warehouse
* Backorder status
* Lead times

Theme usage:

* Show availability messaging
* Prevent impossible orders
* Guide large customers before checkout

This is **not launch blocking**, but it becomes powerful for network accounts.

---

### 3. Network orders and Draft Orders (where ERP really shines)

For MDSC Network customers:

Flow becomes:

```
Theme → Pricing Engine → ERP
ERP validates:
- Pricing
- Credit limits
- MOQ
- Shipping constraints
ERP returns:
- Approved pricing
- Order reference
Theme submits:
- Draft Order to Shopify
Internal team:
- Reviews
- Converts to order
ERP:
- Creates invoice
- Handles fulfillment
```

At this point Shopify is just a sales channel, not the order brain.

This is exactly how large distributors operate.

---

### 4. Post-order reconciliation

Once integrated, ERP handles:

* Invoice generation
* Partial shipments
* Credits
* Returns
* Tax reconciliation

Shopify order IDs and ERP order IDs are linked via metadata.

---

## What ERP integration does NOT mean

It does **not** mean:

* Replacing Shopify
* Rewriting the theme
* Putting business logic in JavaScript
* Making the frontend smart

It means **centralizing business rules where they belong**.

---

## Why this matters for franchises

When you roll this theme out to franchise stores:

* Each store has its own Shopify instance
* Each store has its own variant IDs
* SKUs stay consistent
* ERP pricing stays consistent
* Pricing engine does not change
* Theme does not change

That is the real win.

---

## Phased ERP integration roadmap (practical)

### Phase 1 (you are here)

* SKU-based pricing engine
* App Proxy exposure
* Theme consumes prices

### Phase 2

* ERP feeds pricing engine
* Customer price agreements live in ERP
* Shopify checkout enforces pricing

### Phase 3

* ERP validates large orders
* Draft Orders created programmatically
* Internal approval workflow

### Phase 4

* Inventory visibility
* Credit limits
* Automated invoicing

Each phase builds on the previous one. No rewrites.

---

## Why most Shopify stores fail at ERP integration

They:

* Tie pricing to variant IDs
* Encode logic in Liquid
* Let themes calculate prices
* Treat ERP as an export-only tool

You are explicitly avoiding all of that.

---

## Bottom line

ERP integration for you means:

* SKU is the contract
* Pricing lives outside Shopify
* Shopify renders and sells
* ERP decides what is allowed and at what price
* Draft Orders bridge high-complexity cases

You are not “adding ERP later”.
You are **designing so ERP fits naturally when you are ready**.

---

## The next logical design step

If you want to keep momentum without overreaching, the next clean step is:

👉 **Final design of `pricing-context.js` with SKU-first resolution and caching**

That becomes the seam where ERP-backed pricing drops in later without touching UI code.

If you want, I can walk through that next, or outline how ERP data would map into your existing pricing engine schema.

---

Perfect. Brightpearl as the **system of truth (SoT)** actually tightens the architecture you are already moving toward. Nothing we designed breaks. It just becomes more concrete and operationally correct.

Below is the **Brightpearl-specific interpretation** of everything we discussed, translated into **what is true now, what must exist at launch, and what becomes future leverage**.

---

## Brightpearl’s role in your stack (locked)

Brightpearl is your **operational master**, not Shopify.

### Brightpearl is SoT for

* SKU master list
* Cost of goods
* Inventory by location
* Customer price lists and contracts
* Customer groups (Pros, Installers, Networks)
* Bulk pricing agreements
* Fulfillment reality

### Shopify is SoT for

* Product presentation
* Merchandising
* Content
* Customer login surface
* Checkout UI
* Order capture

Your **pricing engine is the bridge**, not Shopify.

---

## Updated system hierarchy (with Brightpearl)

This is the correct mental model:

```
Brightpearl
  ↓ (SKU, cost, customer pricing, inventory)
Pricing Engine
  ↓ (resolved prices, cached)
Shopify Theme (display)
  ↓
Shopify Checkout
  ↓
Custom Checkout App (enforcement)
  ↓
Brightpearl (order + fulfillment)
```

Brightpearl never talks to the theme directly.
The theme never talks to Brightpearl directly.

That separation is what keeps this sane.

---

## What this means for pricing (very important)

### Brightpearl already solves the hardest problem

Brightpearl already knows:

* SKU = identity
* Customer = pricing context
* Price agreements = truth

So your pricing engine is really doing three things:

1. Translating Brightpearl data into storefront-safe pricing
2. Caching aggressively
3. Exposing only what the UI needs

That is exactly what we designed.

---

## How Brightpearl maps to your pricing API (concretely)

### Brightpearl → Pricing Engine (internal)

Brightpearl provides:

* SKU
* Customer ID or customer group
* Net unit price
* Optional MSRP or retail reference

Pricing engine stores or computes:

```json
{
  "sku": "THR100",
  "customer_id": 12345,
  "retail_price": 2499,
  "pro_price": 1899
}
```

### Pricing Engine → Theme (App Proxy)

What the theme sees stays exactly as defined:

```json
{
  "prices": {
    "THR100": {
      "retail_price": 2499,
      "pro_price": 1899,
      "savings": 600
    }
  }
}
```

No Brightpearl concepts leak into the frontend.

---

## Inventory visibility (Brightpearl future leverage)

This is **not launch-blocking**, but Brightpearl enables it cleanly later.

Because pricing is SKU-keyed, you can later add:

```json
{
  "inventory": {
    "THR100": {
      "available": 412,
      "backorder": false,
      "lead_time_days": 0
    }
  }
}
```

Theme usage (later):

* Low stock messaging
* Backorder notices
* Network order constraints

No API redesign required.

---

## Network bulk orders + Brightpearl (this is where it shines)

For **MDSC Network** accounts, Brightpearl should be the **gatekeeper**.

Correct flow:

1. Theme builds staging cart (SKU + qty)
2. Pricing engine sends payload to Brightpearl
3. Brightpearl validates:

   * customer credit
   * SKU availability
   * contract pricing
   * fulfillment constraints
4. Brightpearl returns:

   * approved pricing
   * internal order reference
5. Pricing engine:

   * aggregates discount if needed
   * creates Shopify Draft Order
6. Internal team reviews
7. Brightpearl fulfills

This keeps Shopify from being abused as a bulk order engine.

---

## Franchise rollout (Brightpearl makes this easy)

Because Brightpearl is SoT:

* Franchise stores can have:

  * different Shopify product IDs
  * different variant IDs
* SKUs remain consistent
* Pricing engine does not change
* Theme does not change
* Brightpearl contracts do not change

This is **exactly how multi-store operators scale**.

---

## What must exist at LAUNCH (Brightpearl-aware)

### Required now

* SKU-first pricing engine
* App Proxy endpoint
* pricing-context.js
* Variant → SKU resolution in theme
* Checkout enforcement app
* Draft Order flow for Network accounts

### Explicitly NOT required at launch

* Live inventory sync to theme
* Brightpearl credit checks in UI
* Warehouse selection
* Partial shipment UI
* ERP error surfacing in frontend

Those are phase-2 and phase-3.

---

## Data sync strategy (keep it simple)

You do **not** need real-time sync everywhere.

Recommended:

* Pricing engine pulls or receives Brightpearl updates on:

  * price change
  * contract update
* Cache TTL covers browsing sessions
* Checkout always re-validates price via your app

This avoids drift without overengineering.

---

## Why this architecture is correct for Brightpearl

Brightpearl is:

* SKU-centric
* Customer-centric
* Contract-centric

Your theme and pricing engine now match that worldview.

Most Shopify implementations fail because they try to make Shopify the SoT.
You are doing the opposite, which is why this will scale.

---

## Bottom line

Using Brightpearl as your master inventory and pricing SoT:

* Validates the SKU-first decision
* Strengthens the pricing engine role
* Simplifies franchise rollout
* Makes Network orders sane
* Avoids Shopify Plus dependency
* Avoids frontend business logic

You are aligned with how real distributors run commerce.

---

## Next clean step (no scope creep)

Now that Brightpearl is confirmed, the next **concrete design task** should be:

👉 **Finalize `pricing-context.js` (SKU-first, cache-aware, Brightpearl-ready)**

That becomes the seam where Brightpearl feeds in today or tomorrow without touching UI components.

If you want, next I can:

* design pricing-context.js line-by-line, or
* outline Brightpearl → pricing engine sync patterns (webhooks vs polling)

Say which one and we’ll keep this disciplined.

---

Short answer: **yes, Brightpearl can absolutely manage customer groups with dedicated pricing**.
Long answer: **it can do this in a few different ways**, and one of them maps *perfectly* to the architecture you are already building.

I’ll be precise and practical, not salesy.

---

## What Brightpearl can do natively (relevant to you)

Brightpearl is very strong at **customer-specific pricing**, even if you are **not** using it for fulfillment yet.

### Brightpearl supports all of the following:

### 1. Customer groups

You can group customers by:

* Account type (Pros, Installers, Networks)
* Franchise
* Region
* Contract tier

These groups are first-class entities in Brightpearl.

---

### 2. Price lists (SKU-based)

Brightpearl supports **price lists keyed by SKU**, which is exactly what you want.

A price list can be:

* Assigned to a customer
* Assigned to a customer group
* Different from retail/MSRP
* Maintained independently of Shopify

Example:

* Retail price list
* MDSC Pros price list
* Certified Installer price list
* Network Contract A price list
* Network Contract B price list

This already aligns with:

* SKU-first pricing
* Franchise rollout
* ERP-style contracts

---

### 3. Customer-specific overrides

On top of price lists, Brightpearl allows:

* Customer-specific price overrides
* Contract pricing per SKU
* Tiered or negotiated pricing

This is especially important for:

* MDSC Networks
* Large negotiated accounts
* Edge cases that do not fit a clean tier

---

## What Brightpearl does *not* do (and this is good)

Brightpearl does **not**:

* Care about Shopify variant IDs
* Care about theme logic
* Enforce storefront checkout behavior
* Handle Shopify discount stacking rules

That separation is exactly why it works well as a SoT.

---

## How this maps cleanly to your current architecture

You already have the right abstraction in place:

```
Brightpearl
  ↓ (SKU + customer pricing)
Pricing Engine
  ↓ (App Proxy, cached)
Shopify Theme (display)
  ↓
Shopify Checkout (still used)
```

### Brightpearl’s role

* Owns:

  * customer groups
  * SKU pricing
  * contracts
* Exports pricing truth

### Pricing engine’s role

* Translates Brightpearl data into storefront-safe pricing
* Applies caching
* Enforces which account types can request pricing

### Theme’s role

* Displays:

  * retail price
  * pro / installer price
  * savings
* Routes user to correct order flow

No system is overreaching.

---

## Important nuance: “customer groups” vs “Shopify customer tags”

Brightpearl customer groups are **not the same** as Shopify tags.

You have two clean options:

### Option A (recommended)

* Brightpearl owns customer grouping
* Pricing engine resolves group based on:

  * Shopify customer ID
  * mapping table (Shopify customer ↔ Brightpearl customer)
* Theme never sees group names, only pricing output

This is the most robust and future-proof.

---

### Option B (acceptable but weaker)

* Sync Brightpearl group → Shopify customer tag
* Theme infers account type from tag
* Pricing engine still validates server-side

This works but introduces duplication and sync risk.

---

## How this works without Brightpearl fulfillment (your current state)

Even if Brightpearl is **not** fulfilling orders yet:

* It can still:

  * maintain customer groups
  * maintain price lists
  * maintain contract pricing
* Shopify can still:

  * take orders
  * handle fulfillment
  * handle shipping
* Your checkout app:

  * enforces final pricing
  * prevents discount stacking

There is **no dependency** on Brightpearl fulfillment for pricing to work.

---

## Example real-world setup (this matches your needs)

### In Brightpearl

* Customer Group: `MDSC_PRO`

  * Assigned price list: `PRO_2025`
* Customer Group: `CERT_INSTALLER`

  * Assigned price list: `INSTALLER_2025`
* Customer Group: `NETWORK_A`

  * Assigned contract pricing per SKU

### In pricing engine

* Request comes in with:

  * Shopify customer ID
* Pricing engine:

  * maps to Brightpearl customer
  * resolves price list
  * returns SKU pricing

### In theme

* Logged-in user sees:

  * retail price
  * pro price
  * savings
* Variant change updates prices instantly

---

## Why this is the *right* way to do it

If you later decide to:

* switch fulfillment to Brightpearl
* add credit limits
* add inventory checks
* add franchise-specific rules

You **do not touch**:

* pricing-context.js
* product cards
* PDP UI
* theme logic

Only backend wiring evolves.

That is what “future-proof” actually looks like.

---

## Direct answer to your question

> Can Brightpearl create our customer groups with their own dedicated pricing?

**Yes. Fully. Natively. SKU-based. At both group and customer level.**
And it fits your Shopify + custom app + pricing engine architecture extremely well, even before you move fulfillment.

---

## The next smart design decision

Now that this is confirmed, the next thing worth locking is:

👉 **How Shopify customers are mapped to Brightpearl customers**

Once that mapping is clear:

* pricing engine logic becomes trivial
* caching keys are stable
* franchise rollout is painless

If you want, next I can:

* outline Shopify ↔ Brightpearl customer mapping strategies, or
* show how Brightpearl price lists map cleanly into your existing pricing engine schema

---

That is the **correct choice**. Using **customer metafields instead of tags** is the cleanest, safest, and most future-proof way to do this. You are aligning with how serious Shopify builds handle identity and entitlements.

Below is the **locked, production-grade approach**, including *what to store*, *why*, *how it syncs*, and *how the theme and pricing engine consume it*.

---

## Why customer metafields are the right primitive (and tags are not)

### Tags are:

* Flat strings
* Unscoped
* Mutable by humans
* Hard to validate
* Easy to leak into UI logic accidentally

### Metafields are:

* Typed
* Namespaced
* Structured
* Validatable
* API-first
* Safe for long-term logic

For pricing, **tags are a liability**.
Metafields are a contract.

---

## The correct metafield model (LOCK THIS)

You want **one canonical namespace** owned by your app or integration.

### Namespace

```
mdsc
```

### Core customer metafields

#### 1. Account type (required)

```json
namespace: "mdsc"
key: "account_type"
type: "single_line_text_field"
value: "retail" | "b2b_standard" | "b2b_network"
```

This is the **single most important field**.

The theme and pricing engine both depend on it.

---

#### 2. Brightpearl customer reference (required for B2B)

```json
namespace: "mdsc"
key: "brightpearl_customer_id"
type: "single_line_text_field"
value: "BP-123456"
```

This is how you bridge Shopify → Brightpearl cleanly.

No guessing. No fuzzy matching.

---

#### 3. Pricing tier (optional but powerful)

```json
namespace: "mdsc"
key: "pricing_tier"
type: "single_line_text_field"
value: "PRO_2025" | "INSTALLER_2025" | "NETWORK_A"
```

This allows:

* tiered contracts
* future promotions
* franchise-specific overrides

Even if Brightpearl resolves pricing internally, this is useful metadata.

---

#### 4. Network eligibility flag (optional clarity)

```json
namespace: "mdsc"
key: "network_enabled"
type: "boolean"
value: true | false
```

This prevents accidental routing into the wrong order flow.

---

## What NOT to store in metafields

Do **not** store:

* Prices
* Discounts
* Percentages
* Rules
* Calculations
* Inventory counts

Metafields are **identity and entitlement**, not data payloads.

---

## How the sync should work (Brightpearl → Shopify)

This is a **one-way sync** for authority.

### Brightpearl is SoT for:

* customer grouping
* pricing eligibility

### Shopify customer metafields are:

* a cached projection of that truth
* used by:

  * theme
  * pricing engine
  * checkout app

### Sync triggers (recommended)

* Customer created in Brightpearl
* Customer group changes
* Contract changes
* Manual admin sync

This can be:

* webhook-driven
* scheduled
* or hybrid

No real-time requirement.

---

## How the THEME should consume this (important)

### customer-context.js logic

The theme should only read:

```js
customer.metafields.mdsc.account_type
```

From that it derives:

```js
{
  isRetail,
  isB2BStandard,
  isNetwork,
  canSeeRetailPromos,
  checkoutMode
}
```

The theme does **not**:

* infer pricing tiers
* guess eligibility
* read tags
* read Brightpearl IDs

It reacts to **one field**.

That is how you avoid UI drift.

---

## How the PRICING ENGINE uses metafields

The pricing engine:

1. Receives Shopify customer ID (from App Proxy session)
2. Reads customer metafields
3. Extracts:

   * account_type
   * brightpearl_customer_id
   * pricing_tier
4. Resolves pricing from Brightpearl
5. Returns SKU pricing

If metafields are missing or invalid:

* pricing engine rejects or falls back
* theme gracefully shows retail pricing

No silent failures.

---

## Why this is franchise-safe

When you roll this theme to franchise stores:

* Shopify store IDs change
* Variant IDs change
* Product IDs change
* **Customer metafields stay structurally identical**
* Pricing engine logic stays identical
* Brightpearl stays SoT

You do not re-architect anything.

---

## Security implications (positive)

Metafields:

* Cannot be edited by customers
* Are not exposed unless you explicitly expose them
* Are readable by your app and theme safely

This is much safer than tags.

---

## Final answer, directly

> “I’d rather sync to customer object metafield not tags”

That is **exactly the right call**.

The correct setup is:

* Brightpearl owns customer grouping and pricing eligibility
* Your app syncs identity data into **namespaced customer metafields**
* The theme and pricing engine read metafields
* Tags are ignored entirely for pricing logic

This is how you build something that survives:

* growth
* franchises
* ERP expansion
* multiple pricing models

---

## Next clean step (no scope creep)

The next thing worth locking is:

👉 **The exact `customer-context.js` contract**, now that metafields are confirmed

That becomes the foundation for:

* pricing-context
* cart routing
* discount hygiene
* future ERP expansion

If you want, I can design that next in a very tight, implementation-ready way.
