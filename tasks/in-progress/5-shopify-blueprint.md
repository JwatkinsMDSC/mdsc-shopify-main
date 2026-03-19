Below is a full, production ready blueprint that ties everything together. This is the same mental model used by Shopify theme teams and high end agencies. You can hand this to an engineer and build confidently.

I will cover all four items in a strict, layered order so nothing is ambiguous.

---

## 1. Canonical Product UI Event + State Schema

This is the contract that every component obeys.
No component ever reaches into another component’s DOM.

### Global product UI state shape

```ts
ProductUIState = {
  productId: number,
  variantId: number,
  quantity: number,
  basePrice: number,
  compareAtPrice: number | null,
  upgrades: Array<{
    productId: number,
    variantId: number,
    price: number
  }>,
  inventoryQuantity: number | null,
  featuredImage: {
    src: string,
    alt: string
  }
}
```

This state exists in memory only. Liquid never mutates it.

---

### Canonical events

These are the only events allowed.

```txt
product:init
variant:change
quantity:change
upgrade:change
price:update
cart:add
```

If a feature does not fit into one of these events, it is implemented incorrectly.

---

### Event payloads

#### product:init

```js
{
  productId,
  initialVariant
}
```

#### variant:change

```js
{
  variantId,
  price,
  compareAtPrice,
  inventoryQuantity,
  featuredImage
}
```

#### quantity:change

```js
{
  quantity
}
```

#### upgrade:change

```js
{
  upgrades: [...]
}
```

#### price:update

```js
{
  basePrice,
  upgradeTotal,
  finalPrice,
  savings
}
```

---

## 2. Variant State Store Pattern (Shopify style)

This is the backbone.
Everything listens to this store.

### `assets/product-state.js`

```js
class ProductState {
  constructor(initialState) {
    this.state = initialState
    this.listeners = []
  }

  subscribe(fn) {
    this.listeners.push(fn)
  }

  setState(partial) {
    this.state = { ...this.state, ...partial }
    this.notify()
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state))
  }
}

window.ProductState = ProductState
```

---

### Initializing state per product instance

```js
document.querySelectorAll("[data-product-json]").forEach(el => {
  const product = JSON.parse(el.textContent)
  const initialVariant = product.variants.find(v => v.available) || product.variants[0]

  const state = new ProductState({
    productId: product.id,
    variantId: initialVariant.id,
    quantity: 1,
    basePrice: initialVariant.price,
    compareAtPrice: initialVariant.compare_at_price,
    upgrades: [],
    inventoryQuantity: initialVariant.inventory_quantity,
    featuredImage: initialVariant.featured_image
  })

  el.closest("[data-product-card], [data-product-main]").productState = state
})
```

Each card, PDP, quick view gets its own isolated state.

---

## 3. Pricing Controller JS Skeleton

Pricing is pure computation.
It never reads the DOM.

### `assets/product-pricing-controller.js`

```js
function setupPricingController(root) {
  const state = root.productState

  state.subscribe(current => {
    const upgradeTotal = current.upgrades.reduce(
      (sum, u) => sum + u.price,
      0
    )

    const finalPrice = current.basePrice + upgradeTotal
    const savings = current.compareAtPrice
      ? (current.compareAtPrice - current.basePrice)
      : 0

    root.dispatchEvent(new CustomEvent("price:update", {
      detail: {
        basePrice: current.basePrice,
        upgradeTotal,
        finalPrice,
        savings
      }
    }))
  })
}
```

---

### Pricing UI listener

This works for PDP, card, and quick view with zero changes.

```js
root.addEventListener("price:update", e => {
  const { basePrice, finalPrice, savings } = e.detail

  root.querySelectorAll("[data-base-price]").forEach(el => {
    el.textContent = formatMoney(basePrice)
  })

  root.querySelectorAll("[data-total-price]").forEach(el => {
    el.textContent = formatMoney(finalPrice)
  })

  root.querySelectorAll("[data-you-save]").forEach(el => {
    el.textContent = formatMoney(savings)
  })
})
```

---

## 4. Variant Picker Contract and JS

Markup can vary wildly.
Behavior is identical.

### Variant picker snippet requirement

```html
<div
  data-variant-picker
  data-variant-id="{{ variant.id }}"
></div>
```

---

### Variant picker JS

```js
function setupVariantPicker(root) {
  const state = root.productState

  root.querySelectorAll("[data-variant-picker]").forEach(el => {
    el.addEventListener("click", () => {
      const variantId = Number(el.dataset.variantId)
      const variant = findVariantById(variantId)

      state.setState({
        variantId: variant.id,
        basePrice: variant.price,
        compareAtPrice: variant.compare_at_price,
        inventoryQuantity: variant.inventory_quantity,
        featuredImage: variant.featured_image
      })

      root.dispatchEvent(new CustomEvent("variant:change", {
        detail: variant
      }))
    })
  })
}
```

---

## 5. Image Controller Pattern

Same logic everywhere.

### `assets/product-image-controller.js`

```js
function setupImageController(root) {
  root.addEventListener("variant:change", e => {
    const image = e.detail.featured_image
    if (!image) return

    root.querySelectorAll("[data-product-image]").forEach(img => {
      img.src = image.src
      img.alt = image.alt || ""
    })
  })
}
```

PDP gallery, card image, quick view image all work.

---

## 6. Quantity Controller

### `assets/product-quantity-controller.js`

```js
function setupQuantityController(root) {
  const state = root.productState

  root.querySelectorAll("[data-qty-increase]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.setState({ quantity: state.state.quantity + 1 })
    })
  })

  root.querySelectorAll("[data-qty-decrease]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.setState({ quantity: Math.max(1, state.state.quantity - 1) })
    })
  })
}
```

---

## 7. Add to Cart Controller

Same button everywhere.

### `assets/product-cart-controller.js`

```js
function setupCartController(root) {
  const state = root.productState

  root.querySelector("[data-add-to-cart]").addEventListener("click", () => {
    fetch("/cart/add.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: state.state.variantId,
        quantity: state.state.quantity
      })
    }).then(() => {
      root.dispatchEvent(new CustomEvent("cart:add"))
    })
  })
}
```

---

## 8. Wiring Everything Together

### `assets/product-ui-init.js`

```js
document.querySelectorAll("[data-product-card], [data-product-main]").forEach(root => {
  setupPricingController(root)
  setupVariantPicker(root)
  setupImageController(root)
  setupQuantityController(root)
  setupCartController(root)
})
```

---

## 9. Why this architecture works

* Markup can be completely different
* Behavior is shared
* State is isolated per instance
* No DOM coupling
* No Liquid math
* No duplication of logic

This is exactly how you reuse:

* PDP design
* Quick view design
* Card design
* Carousel design

Without compromises.

---

## 10. Final mental model

You are not building pages.

You are building a **headless product interaction engine** with multiple visual skins.

Once this clicks, everything else becomes obvious.