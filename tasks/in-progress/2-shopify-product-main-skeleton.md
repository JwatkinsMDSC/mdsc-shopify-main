Below is a clean, production grade Shopify style implementation that mirrors how Dawn and other top tier themes structure this exact page. This is intentionally opinionated and aligned with long term maintainability.

No filler, no magic, no shortcuts.

---

## 1. `sections/product-main.liquid` skeleton

This file orchestrates layout, data exposure, and snippet composition only.
No pricing math. No JS logic. No duplication.

```liquid
{% comment %}
Primary product orchestration section
Responsible for layout and data wiring only
{% endcomment %}

<section
  class="product-main"
  data-product-id="{{ product.id }}"
  data-section-id="{{ section.id }}"
>

  {%- assign current_variant = product.selected_or_first_available_variant -%}

  <!-- Product media -->
  {% render 'product-gallery',
    product: product,
    current_variant: current_variant
  %}

  <div class="product-main__content">

    <!-- Brand + title -->
    {% render 'product-title',
      product: product
    %}

    <!-- Reviews -->
    {% render 'product-reviews',
      product: product
    %}

    <!-- Social sharing -->
    {% render 'product-share',
      product: product
    %}

    <!-- Variant selector -->
    {% render 'product-variant-picker',
      product: product,
      current_variant: current_variant
    %}

    <!-- Stock alert -->
    {% render 'product-stock-alert',
      current_variant: current_variant
    %}

    <!-- Pricing wrapper -->
    {% render 'product-pricing',
      product: product,
      current_variant: current_variant
    %}

    <!-- Quantity + Add to cart -->
    {% render 'product-quantity-form',
      product: product,
      current_variant: current_variant
    %}

    <!-- Shop Pay -->
    {% render 'product-payment-buttons',
      product: product
    %}

    <!-- Pickup availability -->
    {% render 'product-pickup-availability',
      current_variant: current_variant
    %}

    <!-- Popular upgrades -->
    {% render 'product-popular-upgrades',
      product: product
    %}

    <!-- Description -->
    {% render 'product-description',
      product: product
    %}

  </div>

</section>

{% comment %}
Expose product JSON once
{% endcomment %}
<script type="application/json" data-product-json>
  {{ product | json }}
</script>
```

Key points:

* One section
* Snippets receive only what they need
* Product JSON emitted once
* No B2B branching here

---

## 2. Pricing architecture (wrapper pattern)

### `snippets/product-pricing.liquid`

This is the only place where B2B vs retail is decided.

```liquid
{% if customer and customer.metafields.custom.is_b2b == true %}
  {% render 'product-b2b-pricing',
    product: product,
    current_variant: current_variant
  %}
{% else %}
  {% render 'product-retail-pricing',
    product: product,
    current_variant: current_variant
  %}
{% endif %}
```

Everything below this is isolated.

---

## 3. Pricing event flow diagram (conceptual)

This is how professional themes decouple components.

```
[ Variant Picker ]
        |
        | emits
        v
"variant:change" event
        |
        v
[ Pricing Controller JS ]
        |
        | recalculates
        v
Base price
Compare price
Savings
Upgrade deltas
        |
        | emits
        v
"price:update" event
        |
        v
[ Pricing UI Snippets ]
```

### With upgrades added

```
[ Upgrade Selector ]
        |
        | emits
        v
"upgrade:change" event
        |
        v
[ Pricing Controller JS ]
        |
        | recompute totals
        v
Final price
Total savings
        |
        | emits
        v
"price:update"
```

Important:

* Variant picker never touches pricing DOM
* Upgrades never touch pricing DOM
* Pricing listens to events only

---

## 4. Data contract between snippets and JavaScript

This is critical. This is where most themes fail.

### Global product data

Emitted once by section:

```html
<script type="application/json" data-product-json>
  { product JSON }
</script>
```

JS responsibility:

* Parse
* Cache
* Never re-fetch

---

### Variant picker snippet contract

HTML responsibilities:

```html
<div
  data-variant-picker
  data-product-id="123"
>
```

JS emits:

```js
document.dispatchEvent(
  new CustomEvent("variant:change", {
    detail: {
      variantId,
      price,
      compareAtPrice,
      inventoryQuantity
    }
  })
)
```

---

### Upgrade selector contract

HTML:

```html
<div
  data-upgrade
  data-product-id="456"
  data-price="1299"
>
```

JS emits:

```js
document.dispatchEvent(
  new CustomEvent("upgrade:change", {
    detail: {
      upgrades: [
        { id, price }
      ]
    }
  })
)
```

---

### Pricing snippet contract

HTML expectations:

```html
<div
  data-pricing
  data-base-price
  data-compare-price
  data-total-price
  data-you-save
>
```

Pricing JS listens:

```js
document.addEventListener("variant:change", handler)
document.addEventListener("upgrade:change", handler)
```

Pricing JS emits:

```js
document.dispatchEvent(
  new CustomEvent("price:update", {
    detail: {
      basePrice,
      upgradeTotal,
      finalPrice,
      savings
    }
  })
)
```

---

### Stock alert contract

Listens only:

```js
document.addEventListener("variant:change", ({ detail }) => {
  updateStock(detail.inventoryQuantity)
})
```

No pricing dependency.

---

## 5. Why this mirrors Dawn level quality

* One source of truth
* Zero circular dependencies
* Components reusable in:

  * Quick view
  * Featured product
  * B2B landing pages
* No Liquid math
* No JS embedded in snippets

This is exactly how Shopify theme teams avoid technical debt.