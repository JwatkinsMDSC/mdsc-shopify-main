# Dropdowns - HTML Examples

## Animation System

**All dropdown animations are powered by `animate-presence.js`.**

### Strict Contract

- **JS controls state ONLY** (open/close lifecycle, attributes)
- **CSS controls motion ONLY** (transforms, transitions, easing, timing)
- **NO timing options allowed** in JavaScript
- **NO transforms set via JavaScript**

### State Contract

| Attribute | Purpose |
|-----------|---------|
| `[data-open]` | Panel is visible/open |
| `[data-closed]` | Panel is hidden/closed (target state) |
| `[data-enter]` | Entering transition in progress |
| `[data-leave]` | Leaving transition in progress |

### Visibility Contract

- **Controller owns `hidden` attribute**
- **Authors do NOT add `hidden` in markup**
- CSS hides panels by default via `[data-dd-panel]:not([data-open]) { display: none }`
- JS initializes state on page load

### Critical Rules

❌ **NEVER** pass options to `animateIn()` or `animateOut()`  
❌ **NEVER** set `style.transform` or `style.transition` in JS  
❌ **NEVER** set `--ui-closed-transform` via JavaScript  
❌ **NEVER** add `hidden` attribute in markup  
✅ **ALWAYS** define motion in CSS (default: `translateY(8px)`)

See [`animate-presence.md`](./animate-presence.md) for full animation contract

---

# 1) Minimal Requirements (Quick Reference)

Every dropdown uses:

### Trigger

```html
data-dd-trigger
aria-controls="PANEL_ID"
aria-expanded="false"
```

### Panel

```html
data-dd-panel
id="PANEL_ID"
```

> **Note:** Authors do NOT add `hidden` in markup. The controller manages visibility.

### Optional but recommended

```html
data-dd-anim   <!-- inner animated wrapper -->
data-dd-context <!-- layout/visibility context -->
```

### Animation Control (CSS ONLY)

Dropdown animation direction MUST be customized via CSS:

```html
<!-- Default: translateY(8px) -->
<div id="my-dropdown" data-dd-panel>

<!-- ✅ CORRECT: Custom via CSS -->
<style>
  #my-dropdown {
    --ui-closed-transform: translateY(-10px); /* slide from top */
  }
</style>

<!-- ❌ WRONG: Never via JavaScript -->
<script>
  dropdown.style.setProperty('--ui-closed-transform', 'translateY(-10px)');
</script>
```

**All motion and timing must be CSS-controlled.**

---

## Event Model (Pointerdown)

**All dropdown interactions use `pointerdown` events (not `click`).**

### Why Pointerdown?

The dropdown system uses `pointerdown` in capture phase because:

- **Timing Consistency**: Outside-dismiss detection runs on `pointerdown`, so triggers must also use `pointerdown` to prevent race conditions
- **Universal Support**: Works with mouse, touch, and pen input
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

All dropdowns automatically close when you interact **outside** the dropdown via the centralized `outside-dismiss.js` utility.

### Event Detection

Uses `pointerdown` in capture phase with `composedPath()` for layout-safe detection that works correctly with:

- Complex nested DOM structures
- SVG elements and icons
- Absolute/fixed positioning
- Shadow DOM

### Dismissal Logic

The dropdown closes when:

✅ User pointerdown outside the panel  
✅ User pointerdown outside the trigger  
✅ User presses `Escape`  
✅ Interaction is not inside panel or trigger (via composedPath)

The dropdown does NOT close when:

❌ Clicking inside the panel  
❌ Clicking the trigger (toggles instead)  
❌ Panel has `data-ui-no-outside-dismiss`

### Disable Outside-Click Dismissal

To prevent closing on outside clicks (rarely needed):

```html
<div 
  id="my-dropdown" 
  data-dd-panel 
  data-ui-no-outside-dismiss
>
  <!-- Must use explicit actions or Escape -->
</div>
```

**When to use:**
- Persistent filter panels that should stay open
- Inline editing modes
- Debugging/development

**Important:** Even with `data-ui-no-outside-dismiss`, users can still:
- Press `Escape` to close
- Click the trigger again to close

---

# 2) Basic Dropdown (Account Menu)

Use this for simple click-based dropdowns like account, language, currency.

```html
<div class="relative" data-dd-context>
  <button
    type="button"
    data-dd-trigger
    aria-controls="account-menu"
    aria-expanded="false"
    class="account-trigger"
  >
    Account
  </button>

  <div
    id="account-menu"
    data-dd-panel
    class="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded"
  >
    <div data-dd-anim class="p-4 space-y-2">
      <a href="/account" class="block">My Account</a>
      <a href="/orders" class="block">Orders</a>
      <a href="/logout" class="block">Log Out</a>
    </div>
  </div>
</div>
```

What this gives you:

* click to open
* click outside to close
* Escape to close
* auto-close if parent disappears (responsive/layout)

---

# 3) Full-Width Mega Menu (Header Navigation)

This is the **primary use case** you've been building toward.

```html
<li class="relative mega-menu-group" data-dd-context>
  <button
    type="button"
    data-dd-trigger
    aria-controls="desktop-mega-menu"
    aria-expanded="false"
    class="mega-menu-trigger"
  >
    Shop Products
  </button>

  <el-mega-menu
    id="desktop-mega-menu"
    data-dd-panel
    class="mega-menu-panel absolute left-0 right-0 top-full bg-white"
  >
    <div data-dd-anim class="mega-menu-inner">
      <div class="grid grid-cols-4 gap-8 p-8">
        <div>
          <h4 class="font-semibold mb-2">Compounds</h4>
          <a href="#" class="block">Cutting</a>
          <a href="#" class="block">Polishing</a>
        </div>

        <div>
          <h4 class="font-semibold mb-2">Pads</h4>
          <a href="#" class="block">Foam</a>
          <a href="#" class="block">Microfiber</a>
        </div>

        <!-- more columns -->
      </div>
    </div>
  </el-mega-menu>
</li>
```

Why this works cleanly:

* full-width panel anchored to header
* animation only happens on inner wrapper
* no layout jank
* closes if header/nav disappears on breakpoint change

---

# 4) Filters Dropdown (Viewport-Aware, Product Grid Context)

This matches the exact scenario you described earlier.

```html
<div id="product-grid-wrapper" data-dd-context>
  <button
    type="button"
    data-dd-trigger
    aria-controls="filters-panel"
    aria-expanded="false"
    class="filters-trigger"
  >
    Filters
  </button>

  <div
    id="filters-panel"
    data-dd-panel
    class="filters-panel absolute left-0 top-full bg-white shadow"
  >
    <div data-dd-anim class="p-6">
      <!-- filter checkboxes -->
      <label class="block">
        <input type="checkbox"> Ceramic Coatings
      </label>
      <label class="block">
        <input type="checkbox"> Compounds
      </label>
    </div>
  </div>
</div>
```

Behavior you get:

* opens on click
* closes when product grid scrolls out of view
* closes on orientation change
* closes when layout collapses on mobile

---

# 5) Multiple Dropdowns in One Context (Safe)

You can place multiple triggers inside the same context safely.

```html
<nav data-dd-context class="relative">
  <button
    data-dd-trigger
    aria-controls="nav-menu-1"
    aria-expanded="false"
  >
    Menu A
  </button>

  <button
    data-dd-trigger
    aria-controls="nav-menu-2"
    aria-expanded="false"
  >
    Menu B
  </button>

  <div id="nav-menu-1" data-dd-panel>
    <div data-dd-anim>Menu A Content</div>
  </div>

  <div id="nav-menu-2" data-dd-panel>
    <div data-dd-anim>Menu B Content</div>
  </div>
</nav>
```

The plugin ensures:

* only one menu is open at a time
* opening one closes the other
* both close if nav disappears

---

# 6) Notes for Liquid Authors (Important)

### Always:

* Match `aria-controls` with `id`
* Include `data-dd-context` on the layout container

### Authors do NOT:

* Add `hidden` attribute (controller owns this)
* Add `data-open` or state attributes
* Manually toggle visibility in Liquid
* Set animation transforms via JavaScript
* Use inline styles for motion control

### Optional:

* Use `el-mega-menu` or regular `div`
* Add Tailwind classes freely
* Nest complex markup inside `data-dd-anim`

### Avoid:

* Putting `pointer-events-none` on the panel itself
* Animating the positioned container instead of the inner wrapper
* Adding transitions in component CSS

---

# 7) Copy-Paste Checklist

If a dropdown does not work, check:

* [ ] Trigger has `data-dd-trigger`
* [ ] Trigger has `aria-controls`
* [ ] Panel `id` matches `aria-controls`
* [ ] Panel has `data-dd-panel`
* [ ] Context wrapper has `data-dd-context`
* [ ] Inner wrapper has `data-dd-anim` (recommended)
* [ ] NO `hidden` attribute in markup (controller handles this)

If all are true, it **will work**.

---

# 8) Debugging

### DevTools Inspection

Open panels will show:
```html
<div data-dd-panel data-open>
```

Closed panels will show:
```html
<div data-dd-panel hidden>
```

During animations:
```html
<!-- Opening -->
<div data-dd-panel data-enter data-open>

<!-- Closing -->
<div data-dd-panel data-leave data-closed>
```

### Common Issues

| Symptom | Cause | Fix |
|---------|-------|-----|
| Panel never shows | Missing `data-dd-panel` attribute | Add attribute |
| Panel visible on load | Using `hidden` in markup + CSS conflict | Remove `hidden` from markup |
| No animation | Missing animate-presence.css import | Check CSS imports |
| Click doesn't work | Wrong event type expected | System uses `pointerdown`, not `click` |
