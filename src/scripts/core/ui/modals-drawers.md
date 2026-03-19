# UI Panels > Modals & Drawers - HTML Examples

## Core Concepts

This system provides:
- **Modals** - Centered overlays with backdrop
- **Drawers** - Side panels (left/right/top/bottom)
- **Bottom Sheets** - Mobile-optimized drawers with drag-to-dismiss
- **Stacking** - Multiple drawers can stack on top of each other
- **Declarative positioning** - JS applies layout positioning, CSS controls motion

## Animation System

**All animations are powered by `animate-presence.js`.**

### Strict Contract

- **JS controls state ONLY** (open/close lifecycle, attributes)
- **CSS controls motion ONLY** (transforms, transitions, easing, timing)
- **NO timing options allowed** in JavaScript
- **NO transforms set via JavaScript** (except during live gestures)

### Critical Rules

❌ **NEVER** pass options to `animateIn()` or `animateOut()`  
❌ **NEVER** set `style.transform` or `style.transition` in JS  
❌ **NEVER** set `--ui-closed-transform` via JavaScript  
✅ **ALWAYS** use CSS helper classes (`.ui-from-left`, `.ui-from-right`, etc.)  
✅ **ALWAYS** define custom motion in CSS, not JS

See [`animate-presence.md`](./animate-presence.md) for full animation contract

---

## Data Attributes Reference

### Required Attributes

- `data-ui-trigger` - Trigger button/element
- `data-ui-panel` - Panel container
- `data-ui-type="modal|drawer"` - Panel type
- `aria-controls="panel-id"` - Links trigger to panel (on trigger)
- `id="panel-id"` - Panel identifier

> **Note:** Authors do NOT add `hidden` in markup. The controller manages visibility.

### Optional Attributes

- `data-ui-position="left|right|bottom|top"` - Drawer position (affects layout placement)
- `data-ui-variant="side|sheet"` - Drawer variant (sheet = bottom drawer with backdrop)
- `data-ui-gesture` - Enable drag-to-dismiss (sheet only)
- `data-ui-stackable` - Allow drawer stacking
- `data-ui-anim` - Custom animation element (defaults to panel)
- `data-ui-lock-scroll` - Lock body scroll when open
- `data-ui-trap-focus` - Trap focus within panel
- `data-ui-back` - Back/close button within panel
- `data-ui-drawer-handle` - Drag handle element (for gestures)
- `data-ui-backdrop` - Force backdrop on (opt-in for side drawers)
- `data-ui-no-backdrop` - Force backdrop off (opt-out)
- `data-ui-backdrop-variant="dark|light|blur|custom"` - Backdrop appearance variant

### Animation Control (CSS ONLY)

**Animation direction MUST be controlled via CSS helper classes (preferred) or custom CSS:**

```html
<!-- ✅ CORRECT: Use helper classes -->
<div data-ui-panel class="ui-from-right">

<!-- ✅ CORRECT: Or define custom transform in CSS -->
<style>
  #my-panel {
    --ui-closed-transform: translateX(100%) rotate(5deg);
  }
</style>

<!-- ❌ WRONG: Never set via JavaScript -->
<script>
  panel.style.setProperty('--ui-closed-transform', 'translateX(100%)');
</script>
```

**Available helper classes (from `animate-presence.css`):**
- `.ui-from-left` - Slide in from left
- `.ui-from-right` - Slide in from right
- `.ui-from-top` - Slide in from top
- `.ui-from-bottom` - Slide in from bottom
- `.ui-scale-fade` - Scale + fade

---

## Backdrop System

### How Backdrops Work

Backdrops are **portaled to `document.body`** by JavaScript, not nested inside panels. This means:

❌ **Inline styles on panels DO NOT work:**
```html
<!-- This will NOT work - backdrop is not a child of panel -->
<div data-ui-panel style="--ui-backdrop-bg: red;">
```

✅ **Use `data-ui-backdrop-variant` instead:**
```html
<!-- This WILL work - JS reads variant and applies to backdrop -->
<div data-ui-panel data-ui-backdrop-variant="dark">
```

### Backdrop Control

**Default behavior:**
- Modals → backdrop enabled
- Sheet drawers → backdrop enabled
- Side drawers → no backdrop

**Override with:**
- `data-ui-backdrop` → Force backdrop on
- `data-ui-no-backdrop` → Force backdrop off

### Backdrop Variants

Use `data-ui-backdrop-variant` to control backdrop appearance via CSS:

```html
data-ui-backdrop-variant="dark"   <!-- Darker overlay -->
data-ui-backdrop-variant="light"  <!-- Lighter overlay -->
data-ui-backdrop-variant="blur"   <!-- Blurred backdrop -->
data-ui-backdrop-variant="custom" <!-- Your own CSS variant -->
```

**CSS Implementation:**
```css
.ui-backdrop {
  background: var(--ui-backdrop-bg, rgba(0,0,0,0.5));
  backdrop-filter: var(--ui-backdrop-filter, none);
}

.ui-backdrop[data-variant="dark"] {
  --ui-backdrop-bg: rgba(0,0,0,0.75);
}

.ui-backdrop[data-variant="blur"] {
  --ui-backdrop-bg: rgba(0,0,0,0.4);
  backdrop-filter: blur(8px);
}
```

---

## Event Model (Pointerdown)

**All modal and drawer interactions use `pointerdown` events (not `click`).**

### Why Pointerdown?

The system uses `pointerdown` in capture phase because:

- **Timing Consistency**: Outside-dismiss detection runs on `pointerdown`, so triggers and backdrops must also use `pointerdown` to prevent race conditions
- **Universal Support**: Works with mouse, touch, and pen input
- **Gesture Compatibility**: Fires before drag gestures, allowing proper gesture detection
- **Event Ordering**: Fires before focus changes and click synthesis
- **Modern Standard**: Industry best practice for 2025 UI systems

### Implementation Details

- Primary button only (`e.button === 0`)
- Capture phase (`{ capture: true }`)
- Prevents default to avoid double-toggle via click event
- Maintains proper `aria-expanded` state

---

## Outside-Click Dismissal

### How It Works

All modals and drawers automatically close when you interact **outside** the panel via the centralized `outside-dismiss.js` utility, including:

- Pointerdown anywhere on the page that's not the panel
- Pointerdown on the backdrop (if present)
- Pointerdown on non-UI elements

This provides intuitive UX without manual implementation.

### Event Detection

Uses `pointerdown` in capture phase with `composedPath()` for layout-safe detection that works correctly with:

- Complex nested DOM structures
- SVG elements and icons
- Absolute/fixed positioning
- Shadow DOM

### Dismissal Logic

The panel closes when:

✅ User pointerdown outside the panel  
✅ User pointerdown on the backdrop  
✅ User presses `Escape`  
✅ Interaction is not on the trigger (via composedPath)  
✅ No drag gesture is active

The panel does NOT close when:

❌ Clicking inside the panel  
❌ Clicking the trigger  
❌ Drag gesture is in progress  
❌ Panel has `data-ui-no-outside-dismiss`

### Disable Outside-Click Dismissal

To prevent closing on outside clicks (rarely needed):

```html
<div 
  data-ui-panel 
  data-ui-type="modal"
  data-ui-no-outside-dismiss
>
  <!-- Must use explicit close button or Escape -->
</div>
```

**When to use:**
- Critical confirmations where accidental dismissal would be problematic
- Multi-step wizards that require explicit completion
- Modals with unsaved form data

**Important:** Even with `data-ui-no-outside-dismiss`, users can still:
- Press `Escape` to close
- Click explicit close buttons (`[data-ui-back]`)

---

## A) Modal Example

```html
<button
  data-ui-trigger
  aria-controls="newsletter-modal"
>
  Open Modal
</button>

<div
  id="newsletter-modal"
  data-ui-panel
  data-ui-type="modal"
  data-ui-backdrop-variant="dark"
  data-ui-lock-scroll
  data-ui-trap-focus
  class="modal ui-scale-fade"
>
  <div
    data-ui-anim
    class="bg-white p-6 rounded shadow-lg w-full max-w-md"
  >
    <h2 class="text-lg font-semibold">Subscribe</h2>
    <p class="mt-2">Join our newsletter.</p>
  </div>
</div>
```

---

## B) Drawer (Right) - Declarative Animation

**No manual animation code required** - CSS handles motion via `.ui-from-right` helper class:

```html
<button
  data-ui-trigger
  aria-controls="cart-drawer"
>
  Open Cart
</button>

<div
  id="cart-drawer"
  data-ui-panel
  data-ui-type="drawer"
  data-ui-position="right"
  class="ui-from-right w-96 bg-white shadow-xl"
>
  <div class="p-6">
    Cart contents
  </div>
</div>
```

---

## C) Drawer (Left) - With Backdrop & Blur

Side drawers don't get backdrops by default. Use `data-ui-backdrop` to opt-in:

```html
<button
  data-ui-trigger
  aria-controls="nav-drawer"
>
  Open Navigation
</button>

<div
  id="nav-drawer"
  data-ui-panel
  data-ui-type="drawer"
  data-ui-position="left"
  data-ui-backdrop
  data-ui-backdrop-variant="blur"
  data-ui-stackable
  class="ui-from-left h-full w-80 bg-white"
>
  <div class="p-6">
    Navigation
  </div>
</div>
```

---

## D) Bottom Sheet (Mobile) - With Drag Gesture

Bottom sheets automatically get backdrop and support drag-to-dismiss:

```html
<button
  data-ui-trigger
  aria-controls="mobile-filters"
>
  Open Filters
</button>

<div
  id="mobile-filters"
  data-ui-panel
  data-ui-type="drawer"
  data-ui-variant="sheet"
  data-ui-backdrop-variant="light"
  data-ui-gesture
  data-ui-lock-scroll
  class="ui-from-bottom h-[75vh] bg-white rounded-t-xl"
>
  <div data-ui-drawer-handle class="flex justify-center py-3">
    <div class="w-12 h-1 bg-gray-300 rounded-full"></div>
  </div>
  
  <div class="p-6">
    Mobile Filters
  </div>
</div>
```

**Gesture behavior:**
- Drag down to dismiss
- Backdrop opacity follows drag
- Auto-dismisses if dragged beyond threshold or velocity exceeds limit
- Snaps back if released too early

---

## E) Stacked Drawers (Submenu Pattern)

```html
<div
  id="main-menu"
  data-ui-panel
  data-ui-type="drawer"
  data-ui-position="left"
  data-ui-stackable
  class="ui-from-left h-full w-80 bg-white"
>
  <button
    data-ui-trigger
    aria-controls="submenu"
  >
    Open Submenu →
  </button>
</div>

<div
  id="submenu"
  data-ui-panel
  data-ui-type="drawer"
  data-ui-position="left"
  data-ui-stackable
  class="ui-from-left h-full w-80 bg-white"
>
  <button data-ui-back>
    ← Back
  </button>
  <div class="p-6">
    Submenu Content
  </div>
</div>
```

---

## F) Custom Animations

Define custom closed transforms via CSS ONLY:

```html
<div
  id="custom-drawer"
  data-ui-panel
  data-ui-type="drawer"
  class="custom-drawer ui-from-right"
>
  <div class="bg-white h-full p-6">
    Custom animation
  </div>
</div>

<style>
  .custom-drawer {
    --ui-closed-transform: translateX(100%) rotate(5deg);
  }
</style>
```

### ❌ Forbidden

```js
// NEVER do this
panel.style.setProperty('--ui-closed-transform', 'translateX(100%)');
panel.style.transform = 'translateY(10px)';

// NEVER pass timing options
animateIn(panel, { durationIn: 260 });
```

**All motion and timing must be CSS-controlled.**

---

## Motion System

All animations follow the `animate-presence` lifecycle:

| State | Applied By | Purpose |
|-------|------------|---------|
| `[data-closed]` | JS | Closed state (target for transitions) |
| `[data-enter]` | JS | Enter transition in progress |
| `[data-open]` | JS | Final open state |
| `[data-leave]` | JS | Leave transition in progress |
| `hidden` | JS | Final hidden state (controller-owned) |

CSS defines the actual motion:

```css
/* Closed state */
[data-ui-panel][data-closed] {
  opacity: 0;
  transform: var(--ui-closed-transform, translateY(8px));
}

/* Open state */
[data-ui-panel][data-open] {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

/* Transitions */
[data-enter] {
  transition: opacity 260ms ease, transform 260ms ease;
}

[data-leave] {
  transition: opacity 200ms ease, transform 200ms ease;
}
```

See [`animate-presence.md`](./animate-presence.md) for full documentation.

---

## Gesture Configuration

Constants can be adjusted in `modals-drawers.js`:

```js
const GESTURE = {
  DISMISS_THRESHOLD: 100,      // px to drag before dismissing
  VELOCITY_THRESHOLD: 0.5,     // px/ms velocity threshold
  DRAG_RESISTANCE: 0.7,        // resistance factor (0-1)
};
```

---

## What You Now Have

* ✅ Unified animation system (via `animate-presence.js`)
* ✅ Declarative drawer positioning
* ✅ Bottom sheet variant with drag gestures
* ✅ Automatic backdrop management
* ✅ Drawer stacking support
* ✅ Focus trapping & scroll locking
* ✅ Dawn-grade lifecycle handling
* ✅ CSS-controlled motion (no JS animation logic)
* ✅ Clean HTML authoring
* ✅ Consistent behavior across all UI surfaces
