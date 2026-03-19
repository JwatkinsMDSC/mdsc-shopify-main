## The correct mental model

**Swiper is an engine.
`media-gallery.js` is a product feature.**

You already solved the hardest part: you now have a **battle-tested, Dawn-grade Swiper foundation**. Reusing it is not only acceptable, it’s the *right* architectural move.

What we do **not** do is let product templates wire Swiper directly.

---

## What `media-gallery.js` actually is

`media-gallery.js` is a **composed component** that orchestrates multiple primitives:

* Slider (Swiper, via your `slider.js`)
* Modal (your modal system)
* Focus trap
* Scroll lock
* Optional thumbnails
* Optional zoom / fullscreen
* Optional video handling

It does **not** reimplement:

* slide physics
* touch handling
* breakpoints
* pagination logic
* navigation logic

Those are already solved and stable.

---

## Why using Swiper again is the correct call

### 1. Consistency across the theme

Using Swiper for:

* hero sliders
* product media galleries
* carousels
* thumbnail rails

means:

* one mental model
* one dependency
* one performance profile
* one accessibility baseline

This matters a lot long-term.

---

### 2. Shopify product galleries are not special snowflakes

A product media gallery is still:

* a slider
* with a known layout
* with predictable behaviors

What makes it *feel* special is the orchestration, not the engine.

---

### 3. You already solved the hard Swiper problems

You already handled:

* external navigation
* lifecycle safety
* section reloads
* preset isolation
* autoplay guards
* reduced motion
* debug tooling

Rewriting that for a gallery would be wasted effort and more bugs.

---

## So what *is* custom about `media-gallery.js`?

Everything above the slider layer.

### Responsibilities of `media-gallery.js`

* Instantiate **one or more sliders** using your existing `slider.js`
* Coordinate state between them:

  * main gallery ↔ thumbnail gallery
* Handle **fullscreen modal open / close**
* Manage focus and scroll lock when modal is open
* Decide when to destroy / re-init sliders (modal lifecycle)
* Handle media types:

  * image
  * video
  * external embeds (later)

### Things it does NOT do

* It does not talk to Swiper directly
* It does not import Swiper modules
* It does not parse breakpoints
* It does not manage navigation wiring

That stays centralized.

---

## The right architecture (clean and future-proof)

```
media-gallery.js
│
├── uses slider.js
│   ├── preset: product-gallery
│   ├── preset: product-thumbnails
│
├── uses modal.js
├── uses focus-trap.js
├── uses scroll-lock.js
│
└── coordinates state between them
```
---

Perfect. We’ll do this **the same disciplined way** you did `slider.js`:
small API, preset-driven, no Swiper leakage, Dawn-grade, future-proof.

Below is **Step 1 for `media-gallery`**:
👉 **Design the presets + data-attribute API (no JS yet)**

---

# 🎯 What `media-gallery` is responsible for (re-stated clearly)

`media-gallery` is a **composed feature**, not a primitive.

It coordinates:

* Main media slider
* Thumbnail slider (optional)
* Fullscreen / modal view (optional)
* Focus trapping
* Scroll locking
* Media type handling (image, video, external later)

It **does not**:

* Configure Swiper directly
* Expose Swiper options to Liquid
* Duplicate slider logic

---

# 🧱 Core design principle (lock this in)

> **Liquid describes structure and intent.
> Presets define behavior.
> JavaScript orchestrates state.**

So we define:

1. **Very small data-attribute API**
2. **Opinionated presets**
3. **Predictable DOM structure**

---

# 1️⃣ Data-attribute API (authoring contract)

This is the **only** API Liquid authors interact with.

## Required

```html
data-media-gallery
data-media-gallery-type="product"
```

---

## Optional feature flags

Boolean attributes only. No JSON. No enums.

```html
data-media-gallery-thumbs       <!-- enable thumbnail rail -->
data-media-gallery-zoom         <!-- enable click-to-zoom -->
data-media-gallery-fullscreen   <!-- enable fullscreen modal -->
data-media-gallery-video        <!-- gallery may contain video -->
```

These describe **capabilities**, not configuration.

---

## Optional state / behavior overrides

Only where merchant control makes sense.

```html
data-media-initial="0"           <!-- starting media index -->
data-media-loop                 <!-- allow looping -->
```

That’s it.
No breakpoints.
No slide counts.
No effect configs.

---

# 2️⃣ DOM structure (canonical, enforced)

This structure is **required**.
`media-gallery.js` will assume it.

---

## Base gallery (no thumbnails)

```html
<div
  data-media-gallery
  data-media-gallery-type="product"
>
  <div
    class="swiper"
    data-slider
    data-slider-type="media-main"
  >
    <div class="swiper-wrapper">
      <div class="swiper-slide">
        <img src="image-1.jpg" alt="">
      </div>
      <div class="swiper-slide">
        <img src="image-2.jpg" alt="">
      </div>
    </div>

    <button data-slider-prev>Prev</button>
    <button data-slider-next>Next</button>
  </div>
</div>
```

---

## With thumbnails

```html
<div
  data-media-gallery
  data-media-gallery-type="product"
  data-media-gallery-thumbs
>
  <!-- MAIN -->
  <div
    class="swiper"
    data-slider
    data-slider-type="media-main"
  >
    <div class="swiper-wrapper">
      <!-- slides -->
    </div>

    <button data-slider-prev></button>
    <button data-slider-next></button>
  </div>

  <!-- THUMBS -->
  <div
    class="swiper"
    data-slider
    data-slider-type="media-thumbs"
  >
    <div class="swiper-wrapper">
      <!-- thumbnail slides -->
    </div>
  </div>
</div>
```

---

## With fullscreen modal

```html
<button data-media-open>Open gallery</button>

<div
  data-media-gallery-modal
  hidden
>
  <!-- cloned or separate gallery markup -->
</div>
```

The modal itself is handled by your **existing modal system**.

---

# 3️⃣ Slider presets (owned by `slider.js`)

`media-gallery` does **not** configure Swiper directly.
It only **requests** these presets.

---

## Preset: `media-main`

```js
'media-main': {
  modules: [Navigation, Pagination, A11y],

  slidesPerView: 1,
  spaceBetween: 0,

  loop: false,
  speed: 300,

  navigation: { enabled: true },
  pagination: { enabled: false },
}
```

Notes:

* Always single-slide
* No grid
* No autoplay
* No effects (fade can be added later as a new preset)

---

## Preset: `media-thumbs`

```js
'media-thumbs': {
  modules: [A11y],

  slidesPerView: 5,
  spaceBetween: 8,

  loop: false,
  speed: 200,
  centeredSlides: false,
}
```

Notes:

* No navigation
* No pagination
* Click handling is done by `media-gallery.js`, not Swiper

---

## Optional future presets (already compatible)

You won’t implement these yet, but this design supports them cleanly:

* `media-main-fade`
* `media-main-zoom`
* `media-thumbs-vertical`
* `media-thumbs-mobile-drawer`

No API changes required later.

---

# 4️⃣ Responsibilities split (important)

### `slider.js`

* Initializes Swiper
* Owns Swiper presets
* Manages lifecycle
* Handles navigation binding

### `media-gallery.js`

* Finds galleries
* Locates main + thumb sliders
* Syncs slide index
* Opens / closes fullscreen modal
* Locks scroll
* Traps focus
* Delegates slider behavior to `slider.js`

This separation keeps everything sane.

---

# 5️⃣ Why this design is correct

* Minimal Liquid API
* No Swiper leakage
* Predictable markup
* Easy to document
* Easy to test
* Easy to extend
* No refactors later

This is exactly how **Shopify’s own Dawn gallery should have been built**.

---

# ✅ Step 1 complete

We have now locked:

* Media Gallery purpose
* Data-attribute API
* DOM structure
* Slider presets
* Responsibility boundaries

---

## Next step (Step 2)

👉 **Implement `media-gallery.js`**

* Fully commented
* Uses existing modal, focus trap, scroll lock
* Syncs main + thumbs
* Section lifecycle safe
* Zero Swiper imports

When you’re ready, say:

**“Proceed to build `media-gallery.js`”**
---

```
<!-- Thumbnails in both inline gallery AND modal -->
<div 
  data-media-gallery 
  data-media-gallery-type="product" 
  data-media-modal-thumbs
>
  <!-- main + thumbs -->
</div>

<!-- Thumbnails ONLY in inline gallery (cleaner modal) -->
<div 
  data-media-gallery 
  data-media-gallery-type="product"
>
  <!-- main + thumbs -->
</div>
```