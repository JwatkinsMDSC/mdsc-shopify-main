Pofessional theme architecture separates **logic reuse** from **markup reuse**. The mistake most teams make is trying to force the same DOM everywhere.

Below is the industry standard way to handle this cleanly without creating an unmaintainable mess.

---

## 1. The core rule professionals follow

**Never force one DOM structure to serve multiple layouts.**

Instead:

* Reuse **data contracts**
* Reuse **JS controllers**
* Allow **multiple markup implementations**

This is why Dawn has multiple price snippets that all work with the same JS.

---

## 2. Separate three concerns explicitly

Every reusable component should be thought of as:

1. **Data source**
2. **Behavior (JS)**
3. **Markup (Liquid)**

You only reuse #1 and #2 universally.
Markup is allowed to diverge.

---

## 3. The “headless snippet” pattern (this is the key)

Create a **logic only snippet** that outputs no markup, only data attributes and JSON.
Then create multiple visual snippets that consume it.

### Example: pricing

#### Logic provider (shared)

```
snippets/product-pricing-data.liquid
```

```liquid
<div
  data-pricing-root
  data-product-id="{{ product.id }}"
  data-variant-id="{{ current_variant.id }}"
  data-price="{{ current_variant.price }}"
  data-compare-at="{{ current_variant.compare_at_price }}"
>
</div>
```

No UI. No layout. Just data.

---

## 4. Multiple visual implementations using the same logic

### PDP pricing layout

```
snippets/product-pricing-pdp.liquid
```

```liquid
<div class="pricing-pdp">
  <span data-base-price></span>
  <span data-compare-price></span>
  <span data-you-save></span>
</div>
```

### Card pricing layout

```
snippets/product-pricing-card.liquid
```

```liquid
<div class="pricing-card">
  <span data-base-price></span>
</div>
```

### B2B pricing layout

```
snippets/product-pricing-b2b.liquid
```

```liquid
<div class="pricing-b2b">
  <span data-regular-price></span>
  <span data-pro-price></span>
  <span data-you-save></span>
</div>
```

All of them rely on the same JS.

---

## 5. How this is wired together in a section

### Pricing wrapper

```liquid
{% render 'product-pricing-data',
  product: product,
  current_variant: current_variant
%}

{% case context %}
  {% when 'pdp' %}
    {% render 'product-pricing-pdp' %}
  {% when 'card' %}
    {% render 'product-pricing-card' %}
  {% when 'quick_view' %}
    {% render 'product-pricing-pdp' %}
{% endcase %}
```

JS:

* Finds `[data-pricing-root]`
* Updates any child elements with matching selectors

Markup can be wildly different.

---

## 6. Variant picker follows the same pattern

### Shared behavior

* Variant state
* Events
* Image updates
* Pricing updates

### Multiple DOMs

* Button grid on PDP
* Dropdown on cards
* Radio list in quick view

All emit the same event:

```js
variant:change
```

JS does not care how the user selected it.

---

## 7. Product images same idea

* PDP uses gallery
* Card uses single image
* Quick view uses compact gallery

All listen to:

```js
variant:change
```

---

## 8. Quantity and add to cart

Same principle:

### Quantity behavior

* Emits quantity:change

### Markup

* Inline on card
* Large on PDP
* Drawer style in quick view

Add to cart listens to state, not DOM structure.

---

## 9. Why this is the only scalable approach

If you try to:

* Add conditionals inside one snippet
* Toggle giant DOM blocks
* Share markup across radically different designs

You will end up rewriting everything later.

Shopify theme teams explicitly avoid this.

---

## 10. How Dawn actually does this

Dawn has:

* Multiple price snippets
* Multiple media snippets
* One JS controller per domain

Markup is duplicated where needed.
Logic is not.

---

## 11. Decision checklist

When deciding reuse strategy:

**Reuse the snippet if**

* DOM is nearly identical
* Only minor spacing or classes differ

**Create a new snippet if**

* Layout structure is different
* Hierarchy is different
* Accessibility requirements differ

But:

* Data attributes
* JS events
* State contracts

Must stay identical.

---

## 12. The mental model you want your team to adopt

> “We are building a headless product system with multiple skins.”

Once you think that way, reuse becomes obvious and safe.