Perfect. We’ll do this **methodically and lock it in** before writing a single line of `slider.js`. This is exactly how you avoid rework later.

Below is **Step 1 and Step 2 only**, as requested.

---

# STEP 1: DATA ATTRIBUTE API (AUTHORING CONTRACT)

This is the **public contract** that Liquid, content authors, and future developers rely on. Once locked, we do not casually change it.

---

## Core principles for the Slider API

* Declarative
* No JSON blobs in HTML
* One slider per root element
* Preset-driven with optional overrides
* Breakpoint-aware
* Shopify-safe
* Extensible without breaking changes

---

## Required Attributes (Minimum Viable Slider)

These are **non-negotiable**.

```html
data-slider
data-slider-type
```

### Example

```html
<div
  data-slider
  data-slider-type="hero-collection"
>
```

---

## Optional Attributes (Overrides)

These allow **section-level customization** without changing JS.

### Slides per view

```html
data-slides-mobile="1"
data-slides-tablet="2"
data-slides-desktop="4"
```

Defaults are defined in the preset.

---

### Spacing (spaceBetween)

```html
data-spacing-mobile="12"
data-spacing-tablet="16"
data-spacing-desktop="24"
```

---

### Looping

```html
data-slider-loop
```

Boolean attribute:

* present → `true`
* absent → preset default

---

### Autoplay (future-safe)

```html
data-slider-autoplay="5000"
```

* Value is delay in ms
* Absent → no autoplay

---

### Centered slides (optional)

```html
data-slider-centered
```

---

### Initial slide (edge cases)

```html
data-slider-initial="2"
```

---

## Navigation & Pagination (structure-driven, not config-driven)

We **do not** expose selectors via data attributes.

Instead, we standardize DOM structure.

### Navigation buttons

```html
<button data-slider-prev>Previous</button>
<button data-slider-next>Next</button>
```

### Pagination container

```html
<div data-slider-pagination></div>
```

This keeps:

* Liquid clean
* JS in control
* Section IDs out of Swiper config

---

## Accessibility Attributes (JS-managed)

These are **not authored manually**:

* `aria-live`
* `aria-roledescription`
* keyboard behavior

Handled centrally in `slider.js`.

---

## Final Attribute Reference Table

| Attribute                | Required | Purpose                  |
| ------------------------ | -------- | ------------------------ |
| `data-slider`            | Yes      | Marks slider root        |
| `data-slider-type`       | Yes      | Selects preset           |
| `data-slides-mobile`     | No       | Override slides per view |
| `data-slides-tablet`     | No       | Override slides per view |
| `data-slides-desktop`    | No       | Override slides per view |
| `data-spacing-mobile`    | No       | Override spacing         |
| `data-spacing-tablet`    | No       | Override spacing         |
| `data-spacing-desktop`   | No       | Override spacing         |
| `data-slider-loop`       | No       | Enable looping           |
| `data-slider-autoplay`   | No       | Enable autoplay          |
| `data-slider-centered`   | No       | Center slides            |
| `data-slider-initial`    | No       | Initial slide index      |
| `data-slider-prev`       | No       | Previous button          |
| `data-slider-next`       | No       | Next button              |
| `data-slider-pagination` | No       | Pagination container     |

This API is **locked unless you explicitly decide otherwise**.

---

# STEP 2: SLIDER PRESETS (STARTING WITH HERO COLLECTION)

Presets define **opinionated defaults**.
Liquid only supplies values.
JS owns behavior.

---

## Preset Philosophy

* Presets encode *intent*, not layout
* Presets define safe defaults
* Overrides are allowed but minimal
* Presets are reusable across sections

---

## `hero-collection` Preset (Authoritative v1)

This maps directly to your existing Hero Collection Carousel.

```js
const SLIDER_PRESETS = {
  'hero-collection': {
    slidesPerView: {
      mobile: 1,
      tablet: 2,
      desktop: 4,
    },

    spaceBetween: {
      mobile: 12,
      tablet: 16,
      desktop: 24,
    },

    loop: true,
    speed: 600,
    centeredSlides: false,

    pagination: {
      enabled: true,
      clickable: true,
    },

    navigation: {
      enabled: true,
    },

    a11y: {
      enabled: true,
    },
  },
};
```

---

## Why this preset is correct

* Matches your current Liquid schema
* Supports all breakpoints cleanly
* Keeps Swiper complexity out of Liquid
* Easy to evolve later
* Safe default looping behavior
* Explicit accessibility support

---

## Example: How Liquid will consume this

```html
<div
  data-slider
  data-slider-type="hero-collection"
  data-slides-mobile="{{ section.settings.mobile_slides }}"
  data-slides-tablet="{{ section.settings.tablet_slides }}"
  data-slides-desktop="{{ section.settings.desktop_slides }}"
  data-spacing-mobile="{{ section.settings.mobile_spacing }}"
  data-spacing-tablet="{{ section.settings.tablet_spacing }}"
  data-spacing-desktop="{{ section.settings.desktop_spacing }}"
>
```

No JSON.
No Swiper knowledge in Liquid.
No repeated logic.

---

## Presets we can add later (no design needed now)

Just to show scalability:

```js
'logo-marquee'
'product-gallery'
'product-thumbnails'
'testimonials'
'upsell-carousel'
'collection-grid'
```

Each one becomes a **single object**, not a new JS file.

---

# LOCKED DECISIONS (IMPORTANT)

These are now considered **final unless explicitly reopened**:

* No JSON config in HTML
* Presets define defaults
* Data attributes only override
* Navigation is structural, not selector-based
* Swiper remains the engine
* `slider.js` is the only Swiper integration point

---

# HTML Markup Examples

Complete, copy-paste-ready examples for each slider preset type.

---

## Example 1: Hero Collection (Basic)

Typical hero or collection carousel with multiple slides, navigation, and pagination.

```html
<div 
  class="swiper"
  data-slider
  data-slider-type="hero-collection"
>
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      <img src="https://picsum.photos/seed/hero1/800/400" alt="Hero 1">
    </div>
    <div class="swiper-slide">
      <img src="https://picsum.photos/seed/hero2/800/400" alt="Hero 2">
    </div>
    <div class="swiper-slide">
      <img src="https://picsum.photos/seed/hero3/800/400" alt="Hero 3">
    </div>
    <div class="swiper-slide">
      <img src="https://picsum.photos/seed/hero4/800/400" alt="Hero 4">
    </div>
  </div>

  <!-- Navigation -->
  <button type="button" data-slider-prev aria-label="Previous slide">Prev</button>
  <button type="button" data-slider-next aria-label="Next slide">Next</button>

  <!-- Pagination -->
  <div data-slider-pagination></div>
</div>
```

**Features enabled by preset:**
- Navigation: Yes
- Pagination: Yes (bullets, clickable)
- Loop: Yes
- Slides per view: 1 (mobile), 2 (tablet), 4 (desktop)
- Spacing: 12px (mobile), 16px (tablet), 24px (desktop)

---

## Example 2: Hero Collection (With Overrides)

Same preset, but with custom slides-per-view and autoplay enabled.

```html
<div 
  class="swiper"
  data-slider
  data-slider-type="hero-collection"
  data-slides-mobile="1"
  data-slides-tablet="3"
  data-slides-desktop="5"
  data-slider-autoplay="4000"
>
  <div class="swiper-wrapper">
    <div class="swiper-slide">Slide 1</div>
    <div class="swiper-slide">Slide 2</div>
    <div class="swiper-slide">Slide 3</div>
    <div class="swiper-slide">Slide 4</div>
    <div class="swiper-slide">Slide 5</div>
  </div>

  <button type="button" data-slider-prev>←</button>
  <button type="button" data-slider-next>→</button>
  <div data-slider-pagination></div>
</div>
```

**Overrides applied:**
- Autoplay: 4 seconds delay
- Slides: 1/3/5 across breakpoints

---

## Example 3: Product Gallery (Media Main + Thumbs)

Complete media gallery with main viewer, thumbnail navigation, and modal integration.

```html
<!-- Gallery Container -->
<div 
  data-media-gallery 
  data-media-gallery-type="product"
  data-media-modal-mode="main+thumbs"
  class="max-w-4xl"
>
  <!-- Main Slider -->
  <div 
    class="swiper relative"
    data-slider
    data-slider-type="media-main"
  >
    <div class="swiper-wrapper">
      <div class="swiper-slide">
        <img src="https://picsum.photos/seed/a/900/600" alt="Product image A">
      </div>
      <div class="swiper-slide">
        <img src="https://picsum.photos/seed/b/900/600" alt="Product image B">
      </div>
      <div class="swiper-slide">
        <img src="https://picsum.photos/seed/c/900/600" alt="Product image C">
      </div>
      <div class="swiper-slide">
        <img src="https://picsum.photos/seed/d/900/600" alt="Product image D">
      </div>
    </div>

    <!-- Navigation -->
    <div class="flex justify-between absolute left-0 right-0 top-1/2 -translate-y-1/2 z-30">
      <button 
        class="btn btn-secondary" 
        type="button" 
        data-slider-prev 
        aria-label="Previous media"
      >Prev</button>
      <button 
        class="btn btn-secondary" 
        type="button" 
        data-slider-next 
        aria-label="Next media"
      >Next</button>
    </div>
  </div>

  <!-- Thumbnail Slider -->
  <div
    class="swiper mt-4"
    data-slider
    data-slider-type="media-thumbs"
  >
    <div class="swiper-wrapper">
      <div class="swiper-slide cursor-pointer">
        <img src="https://picsum.photos/seed/a/120/120" alt="">
      </div>
      <div class="swiper-slide cursor-pointer">
        <img src="https://picsum.photos/seed/b/120/120" alt="">
      </div>
      <div class="swiper-slide cursor-pointer">
        <img src="https://picsum.photos/seed/c/120/120" alt="">
      </div>
      <div class="swiper-slide cursor-pointer">
        <img src="https://picsum.photos/seed/d/120/120" alt="">
      </div>
    </div>
  </div>

  <!-- Open Modal Button -->
  <button 
    type="button" 
    class="btn btn-primary mt-4" 
    data-ui-trigger 
    data-media-open 
    aria-controls="pdp-media-modal"
  >
    View Full Gallery
  </button>
</div>

<!-- Modal Panel -->
<div 
  id="pdp-media-modal" 
  data-ui-panel 
  data-ui-type="modal" 
  hidden
  class="inset-0 flex items-center justify-center"
>
  <div 
    data-ui-anim 
    data-from="translateY(20px)" 
    class="bg-primary-950/90 p-6 w-full max-w-full h-full max-h-full"
  >
    <!-- Close Button -->
    <button 
      type="button" 
      data-ui-trigger 
      data-media-close 
      aria-controls="pdp-media-modal"
      aria-label="Close gallery"
      class="btn btn-ghost"
    >Close</button>

    <!-- Modal Gallery Root (media-gallery.js clones gallery here) -->
    <div data-media-gallery-modal-root></div>
  </div>
</div>
```

**Features:**
- Main slider: Single-slide viewer with navigation
- Thumbs: 4-column thumbnail rail
- Modal: Clones both main + thumbs into modal on open
- Sync: Clicking thumbs updates main slider
- Cleanup: Modal sliders destroyed on close

---

## Example 4: Media Main Only (Simple Gallery)

Single-slide media viewer without thumbnails.

```html
<div 
  class="swiper"
  data-slider
  data-slider-type="media-main"
>
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      <img src="https://picsum.photos/seed/1/800/600" alt="Image 1">
    </div>
    <div class="swiper-slide">
      <img src="https://picsum.photos/seed/2/800/600" alt="Image 2">
    </div>
    <div class="swiper-slide">
      <img src="https://picsum.photos/seed/3/800/600" alt="Image 3">
    </div>
  </div>

  <button type="button" data-slider-prev>Previous</button>
  <button type="button" data-slider-next>Next</button>
</div>
```

**Features enabled by preset:**
- Navigation: Yes
- Pagination: No
- Loop: No
- Single-slide view (always)
- No spacing between slides

---

## Example 5: Media Main with Lazy Loading

Optimized gallery with lazy image loading (Swiper v12).

```html
<div 
  class="swiper"
  data-slider
  data-slider-type="media-main"
  data-slider-lazy
>
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      <img 
        data-lazy-src="https://picsum.photos/seed/lazy1/1200/800"
        loading="lazy"
        alt="Image 1"
      >
    </div>
    <div class="swiper-slide">
      <img 
        data-lazy-src="https://picsum.photos/seed/lazy2/1200/800"
        loading="lazy"
        alt="Image 2"
      >
    </div>
    <div class="swiper-slide">
      <img 
        data-lazy-src="https://picsum.photos/seed/lazy3/1200/800"
        loading="lazy"
        alt="Image 3"
      >
    </div>
  </div>

  <button type="button" data-slider-prev>Prev</button>
  <button type="button" data-slider-next>Next</button>
</div>
```

**Lazy loading (Swiper v12+):**
- **Important:** Native browser lazy loading doesn't work well with Swiper carousels because all slides are at the same vertical position (just translated horizontally). The browser sees all slides as "near viewport" and loads them immediately.
- **Solution:** When `data-slider-lazy` is present, the slider system implements **manual lazy loading** that loads images based on Swiper slide change events
- Intelligently loads images for **all visible slides** (based on `slidesPerView`) **+ 1 buffer slide** on each side
- Works with single-view sliders (main gallery showing 1 slide) and multi-view sliders (thumbnails showing 4+ slides)
- Images load on-demand as you swipe through the carousel
- **Usage:** Use `data-lazy-src` instead of `src` in your HTML: `<img data-lazy-src="..." loading="lazy" alt="...">`
- The manual loading system will set the `src` attribute when the slide becomes visible
- Swiper config includes `preloadImages: false` to prevent automatic loading
- Works across all browsers (no browser-specific lazy loading support required)

---

## Example 6: Media Main with Zoom

Media gallery with zoom capability (pinch/double-tap/click to zoom).

**IMPORTANT:** Zoom only works on `media-*` slider types and requires `.swiper-zoom-container` markup.

```html
<div 
  class="swiper"
  data-slider
  data-slider-type="media-main"
  data-slider-zoom
>
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      <div class="swiper-zoom-container">
        <img src="https://picsum.photos/seed/zoom1/1600/1200" alt="Zoomable image 1">
      </div>
    </div>
    <div class="swiper-slide">
      <div class="swiper-zoom-container">
        <img src="https://picsum.photos/seed/zoom2/1600/1200" alt="Zoomable image 2">
      </div>
    </div>
    <div class="swiper-slide">
      <div class="swiper-zoom-container">
        <img src="https://picsum.photos/seed/zoom3/1600/1200" alt="Zoomable image 3">
      </div>
    </div>
  </div>

  <button type="button" data-slider-prev>Prev</button>
  <button type="button" data-slider-next">Next</button>
</div>
```

**Zoom safety guards:**
1. Only enabled on `media-main` or `media-thumbs` sliders
2. Requires `.swiper-zoom-container` wrapper around each image
3. Will log debug warning if zoom requested but conditions not met

**Zoom controls:**
- Desktop: Click to zoom in, click again to zoom out
- Mobile: Pinch to zoom, double-tap to toggle
- Keyboard: Not supported by default

---

## Example 7: Media Main with Lazy + Zoom

Combined lazy loading and zoom for optimal performance.

```html
<div 
  class="swiper"
  data-slider
  data-slider-type="media-main"
  data-slider-lazy
  data-slider-zoom
>
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      <div class="swiper-zoom-container">
        <img 
          src="https://picsum.photos/seed/lz1/1600/1200"
          loading="lazy"
          alt="High-res image 1"
        >
      </div>
    </div>
    <div class="swiper-slide">
      <div class="swiper-zoom-container">
        <img 
          src="https://picsum.photos/seed/lz2/1600/1200"
          loading="lazy"
          alt="High-res image 2"
        >
      </div>
    </div>
  </div>

  <button type="button" data-slider-prev>Prev</button>
  <button type="button" data-slider-next>Next</button>
</div>
```

**Best for:**
- High-resolution product images
- Multi-image galleries where performance matters
- Mobile-first experiences

---

## Example 8: Slide Labels

Display contextual labels on slider images for better user understanding.

```html
<div 
  class="swiper"
  data-slider
  data-slider-type="media-main"
  data-slider-show-labels
>
  <div class="swiper-wrapper">
    <div class="swiper-slide" data-slider-label="Front View">
      <img 
        src="https://picsum.photos/800/800?random=1"
        alt="Product front view"
      >
    </div>
    <div class="swiper-slide" data-slider-label="Side View">
      <img 
        src="https://picsum.photos/800/800?random=2"
        alt="Product side view"
      >
    </div>
    <div class="swiper-slide" data-slider-label="Detail">
      <img 
        src="https://picsum.photos/800/800?random=3"
        alt="Product detail close-up"
      >
    </div>
  </div>

  <button type="button" data-slider-prev>Prev</button>
  <button type="button" data-slider-next>Next</button>
</div>
```

**How it works:**
- Add `data-slider-show-labels` to the slider root
- Add `data-slider-label="Your text"` to individual slides
- Labels appear as subtle overlays in the top-left corner
- Production-safe (not a debug feature)

**Best for:**
- Product galleries with multiple angles
- Before/after comparisons
- Size variant displays
- Instructional/tutorial sliders
- Multi-product carousels

**Styling:**
Labels use a semi-transparent dark background with white text. Customize via CSS:

```css
[data-slider-show-labels] .swiper-slide[data-slider-label]::before {
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 4px 8px;
  font-size: 11px;
}
```

---

## Example 9: Scoped Controls

Controls scoped to a specific region (useful when multiple sliders exist on page).

```html
<div data-slider-scope>
  <div 
    class="swiper"
    data-slider
    data-slider-type="hero-collection"
  >
    <div class="swiper-wrapper">
      <div class="swiper-slide">Slide 1</div>
      <div class="swiper-slide">Slide 2</div>
      <div class="swiper-slide">Slide 3</div>
    </div>
  </div>

  <!-- These controls are scoped to THIS slider only -->
  <button type="button" data-slider-prev>Prev</button>
  <button type="button" data-slider-next>Next</button>
  <div data-slider-pagination></div>
</div>
```

**Scoping behavior:**
- Without `data-slider-scope`: Controls search entire document
- With `data-slider-scope`: Controls only search within scope container
- Prevents crosstalk between multiple sliders on same page

---

## Example 9: Debugging

Enable debug logging for troubleshooting.

```html
<div 
  class="swiper"
  data-slider
  data-slider-type="media-main"
  data-slider-debug
>
  <div class="swiper-wrapper">
    <div class="swiper-slide">Image 1</div>
    <div class="swiper-slide">Image 2</div>
  </div>

  <button type="button" data-slider-prev>Prev</button>
  <button type="button" data-slider-next>Next</button>
</div>
```

**Debug output includes:**
- Preset loaded
- Controls found (prev, next, pagination, scrollbar)
- Button click events
- Feature enablement (lazy, zoom, autoplay)
- Safety warnings (zoom disabled, pagination missing, etc.)

Open browser console to see `[Slider Debug]` logs.

---

## Preset Quick Reference

| Preset Type      | Use Case                    | Loop | Navigation | Pagination | Slides/View      |
| ---------------- | --------------------------- | ---- | ---------- | ---------- | ---------------- |
| `hero-collection`| Carousels, collections      | Yes  | Yes        | Yes        | 1/2/4 (m/t/d)    |
| `media-main`     | Product galleries (main)    | No   | Yes        | No         | 1 (all screens)  |
| `media-thumbs`   | Thumbnail navigation        | No   | No         | No         | 4/5/4 (m/t/d)    |

---

## Optional Features Summary

| Feature              | Attribute              | Works With           | Notes                          |
| -------------------- | ---------------------- | -------------------- | ------------------------------ |
| Lazy loading         | `data-slider-lazy`     | All presets          | Use `loading="lazy"` on images |
| Zoom                 | `data-slider-zoom`        | `media-*` only       | Requires zoom container markup |
| Autoplay             | `data-slider-autoplay`    | All presets          | Value = delay in ms            |
| Loop override        | `data-slider-loop`        | All presets          | Boolean attribute              |
| Centered slides      | `data-slider-centered`    | All presets          | Boolean attribute              |
| Initial slide        | `data-slider-initial`     | All presets          | Numeric index (0-based)        |
| Show slide labels    | `data-slider-show-labels` | All presets          | Shows labels from `data-slider-label` on slides |
| Debug logging        | `data-slider-debug`       | All presets          | Browser console output         |

---

## Modal Clone Modes (Media Gallery)

When using `data-media-gallery` with modals, control what gets cloned:

| Mode           | Attribute Value                  | Clones           | Use Case                     |
| -------------- | -------------------------------- | ---------------- | ---------------------------- |
| Main only      | `data-media-modal-mode="main-only"` | Main slider only | Clean, minimal modal         |
| Main + Thumbs  | `data-media-modal-mode="main+thumbs"` | Main + thumbnails | Full gallery experience      |
| Main Zoom      | `data-media-modal-mode="main-zoom"` | Reserved (future) | Future zoom implementation   |

**Legacy support:**
- `data-media-modal-thumbs` (no value) = `main+thumbs` mode

---

## Lazy Loading Debug System

Monitor lazy loading behavior in real-time with the built-in debug system.

### Enabling Debug Mode

Add `data-media-gallery-debug` to your gallery root:

```html
<div 
  data-media-gallery
  data-media-gallery-debug
>
  <!-- Gallery sliders -->
</div>
```

### Console Output

Debug mode automatically logs to browser console:
- Image discovery and initial state
- Slide positions relative to viewport
- Image load events with timing
- IntersectionObserver viewport events
- Network request timing (via PerformanceObserver)

### Visual Debug Panel (Optional)

Create a visual debug panel by adding a `data-media-debug-output` element anywhere on the page:

```html
<div class="debug-panel">
  <h2>Debug Monitor</h2>
  <div data-media-debug-output class="debug-log"></div>
</div>
```

The system will automatically display timestamped, color-coded logs in this element when debug mode is active.

### Debug Output Examples

```
[2:30:15 PM] 📊 Found 10 images with data-lazy-src
[2:30:15 PM] 📐 Slide 1: 668px from viewport bottom
[2:30:15 PM] ⏳ A - Waiting to load...
[2:30:15 PM] 🖼️ A - Loaded! (Manual (Swiper event), in viewport: false) [Total: 1/10]
[2:30:16 PM] 🌐 Network request: LevelR (66ms)
[2:30:16 PM] 👁️ C - Entered viewport
```

### Use Cases

- **Development**: Verify lazy loading works correctly
- **Performance testing**: Monitor image load timing and network requests  
- **Debugging**: Troubleshoot why images aren't loading
- **QA**: Validate lazy loading behavior across devices

---

## Shopify Section Integration

Example of how to integrate with Shopify section settings:

```liquid
{% schema %}
{
  "name": "Product Gallery",
  "settings": [
    {
      "type": "checkbox",
      "id": "enable_lazy",
      "label": "Enable lazy loading",
      "default": true
    },
    {
      "type": "checkbox",
      "id": "enable_zoom",
      "label": "Enable zoom",
      "default": false
    },
    {
      "type": "select",
      "id": "modal_mode",
      "label": "Modal gallery mode",
      "options": [
        { "value": "main-only", "label": "Main only" },
        { "value": "main+thumbs", "label": "Main + Thumbnails" }
      ],
      "default": "main+thumbs"
    }
  ]
}
{% endschema %}

<div 
  data-media-gallery
  data-media-gallery-type="product"
  data-media-modal-mode="{{ section.settings.modal_mode }}"
>
  <div 
    class="swiper"
    data-slider
    data-slider-type="media-main"
    {% if section.settings.enable_lazy %}data-slider-lazy{% endif %}
    {% if section.settings.enable_zoom %}data-slider-zoom{% endif %}
  >
    <!-- Slider markup -->
  </div>
</div>
```

This gives merchants control over slider behavior without touching code.