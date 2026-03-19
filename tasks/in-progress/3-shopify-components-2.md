This is exactly where professional Shopify themes either become elegant or collapse under their own weight. Dawn and other serious themes solve this by treating **product UI as a portable system**, not page specific markup.

Below is the correct way to do this so the same components work across:

* Product page
* Product grid cards
* Swiper carousels
* Quick view drawers
* Cart line items
* B2B and retail contexts

Without duplication or conditionals leaking everywhere.

---

## 1. The core principle

**A product card is a self contained mini product page.**

That is how Shopify themes think about it.

This means:

* Same snippets
* Same data contracts
* Same JS events
* Different layout containers

Nothing in a component assumes it lives on the PDP.

---

## 2. Introduce a Product UI “primitive” layer

Professional themes separate **presentation components** from **layout containers**.

### Containers (sections)

* Grid
* Carousel
* Quick view
* PDP

### Primitives (snippets)

* Image
* Title
* Price
* Variant picker
* Quantity
* Add to cart

These primitives must work anywhere.

---

## 3. Recommended file structure

```
snippets/
  product-card.liquid
  product-image.liquid
  product-title.liquid
  product-variant-picker.liquid
  product-pricing.liquid
    ├─ product-b2b-pricing.liquid
    └─ product-retail-pricing.liquid
  product-quantity.liquid
  product-add-to-cart.liquid

sections/
  collection-grid.liquid
  product-carousel.liquid
  product-main.liquid
  quick-view.liquid
```

**Important**
There is exactly **one product card snippet**.
Everything else is composed into it.

---

## 4. The reusable product card (the keystone)

### `snippets/product-card.liquid`

This is the portable unit used everywhere.

```liquid
{% assign current_variant = product.selected_or_first_available_variant %}

<article
  class="product-card"
  data-product-card
  data-product-id="{{ product.id }}"
>

  {% render 'product-image',
    product: product,
    current_variant: current_variant,
    context: context
  %}

  {% render 'product-title',
    product: product
  %}

  {% render 'product-variant-picker',
    product: product,
    current_variant: current_variant,
    context: context
  %}

  {% render 'product-pricing',
    product: product,
    current_variant: current_variant
  %}

  {% render 'product-quantity',
    product: product,
    current_variant: current_variant
  %}

  {% render 'product-add-to-cart',
    product: product,
    current_variant: current_variant
  %}

</article>
```

This same file is used in:

* Grids
* Swipers
* Quick views
* Related products

No duplication.

---

## 5. Context aware rendering (without branching hell)

Instead of duplicating snippets, you pass a **context flag**.

Example contexts:

* `pdp`
* `card`
* `quick_view`
* `cart`

### Example: product image snippet

```liquid
{% case context %}
  {% when 'pdp' %}
    <img src="{{ current_variant.featured_image | image_url: width: 1200 }}">
  {% else %}
    <img src="{{ current_variant.featured_image | image_url: width: 600 }}">
{% endcase %}
```

This is acceptable because:

* Presentation only
* No business logic
* Single file

---

## 6. Shared variant selection logic

### Golden rule

**Variant selection works the same everywhere.**

So:

* Same variant picker snippet
* Same JS
* Same events

Variant picker emits:

```js
variant:change
```

Everything else listens.

### Product image updates

```js
document.addEventListener("variant:change", ({ detail }) => {
  updateImage(detail.featuredImage)
})
```

This works on:

* PDP gallery
* Product cards
* Quick views

---

## 7. Shared pricing logic (B2B + retail)

Pricing is never tied to layout.

### One pricing controller JS

* Listens to variant changes
* Computes price
* Emits updates

### Snippets only render placeholders

```html
<div
  data-pricing
  data-base-price
  data-compare-price
  data-you-save
></div>
```

Whether it’s:

* Grid card
* PDP
* Quick view

Pricing behaves identically.

---

## 8. Quantity and add to cart reuse

### Quantity snippet

* No cart logic
* Emits quantity change events

### Add to cart snippet

* Submits using:

  * Product ID
  * Variant ID
  * Quantity

Cart, quick view, and PDP all submit the same way.

---

## 9. Swiper and grid reuse

### Sections render containers only

#### `sections/product-carousel.liquid`

```liquid
<div class="swiper">
  {% for product in section.settings.products %}
    <div class="swiper-slide">
      {% render 'product-card',
        product: product,
        context: 'card'
      %}
    </div>
  {% endfor %}
</div>
```

The carousel doesn’t know anything about:

* Pricing
* Variants
* B2B

It just renders cards.

---

## 10. Quick view reuse

Quick view is just:

* A container
* Rendering product card
* Plus description and gallery

```liquid
{% render 'product-card',
  product: product,
  context: 'quick_view'
%}
```

No new logic.

---

## 11. Why this scales cleanly

* One variant system
* One pricing system
* One add to cart system
* One product card

This is exactly how Dawn avoids duplicating product logic across templates.

---

## 12. The most important mental shift

If you hear yourself saying:

> "This is just for the product page"

That component is already wrong.

Everything is portable.
