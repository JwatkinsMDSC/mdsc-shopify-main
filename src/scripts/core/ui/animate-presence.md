# Animate Presence System

**Unified enter/leave animation engine for all UI surfaces**

---

## Purpose

This system provides a **single animation lifecycle** for:

- Modals
- Drawers (side + bottom sheets)
- Dropdowns
- Backdrops
- Any future overlay UI

**One engine. One contract. Zero duplication.**

---

## Core Principle

> **JavaScript controls STATE only.**  
> **CSS controls MOTION only.**

This separation is **non-negotiable** and prevents:

- Animation logic duplication
- Inconsistent timing
- Snap-in behavior
- CSS/JS contract violations

---

## State Contract

### State Attributes

| Attribute | Purpose |
|-----------|---------|
| `[data-open]` | Element is visible/open |
| `[data-closed]` | Element is hidden/closed (target state for transitions) |
| `[data-enter]` | Entering transition in progress |
| `[data-leave]` | Leaving transition in progress |

### Visibility Contract

- **Controller owns `hidden` attribute**
- **Authors do NOT add `hidden` in markup**
- `animateIn` removes `hidden` before transition
- `animateOut` adds `hidden` after transition

### State Flow

```
hidden → [data-closed] → [data-enter] + [data-open] → idle → [data-leave] + [data-closed] → hidden
```

### State Definitions

#### `[data-closed]`
- **When**: Before open, after close
- **Purpose**: Initial hidden state
- **CSS**: `opacity: 0`, `transform: var(--ui-closed-transform)`

#### `[data-enter]`
- **When**: During opening animation
- **Purpose**: Apply enter transition
- **CSS**: Transition rules with ease-in

#### `[data-open]`
- **When**: Fully open
- **Purpose**: Final visible state
- **CSS**: `opacity: 1`, `transform: translate3d(0,0,0)`

#### `[data-leave]`
- **When**: During closing animation
- **Purpose**: Apply leave transition
- **CSS**: Transition rules with ease-out

---

## JavaScript API

### `animateIn(element)`

Animates element entrance.

**Lifecycle:**
1. Remove `hidden` attribute
2. Apply `[data-closed]` immediately
3. Wait one frame (allow CSS to apply)
4. Apply `[data-enter]` + `[data-open]`, remove `[data-closed]`
5. Listen for CSS transitionend event
6. Remove `[data-enter]` when animation completes

**Timing is controlled by CSS variables only.**

**Returns:** Promise that resolves when animation finishes

**Example:**
```js
import { animateIn } from './animate-presence';

const panel = document.getElementById('my-panel');

animateIn(panel).then(() => {
  console.log('Panel is fully open');
});
```

---

### `animateOut(element)`

Animates element exit.

**Lifecycle:**
1. Remove `[data-open]`
2. Apply `[data-closed]` + `[data-leave]`
3. Listen for CSS transitionend event
4. Remove `[data-leave]`, add `hidden` when animation completes

**Timing is controlled by CSS variables only.**

**Returns:** Promise that resolves when animation finishes

**Example:**
```js
animateOut(panel).then(() => {
  console.log('Panel is fully closed and hidden');
});
```

---

### `cancelAnimation(element)`

Immediately resets element to closed state.

**Actions:**
- Removes all animation attributes (`data-enter`, `data-leave`, `data-open`, `data-closed`)
- Cleans up `--ui-closed-transform` variable

**Example:**
```js
cancelAnimation(panel);
```

---

## CSS Contract

### Required Files

- **`animate-presence.css`** — Motion rules ONLY
- **Component CSS** — Appearance ONLY

### Motion Rules (animate-presence.css)

```css
/* Closed state - PANELS ONLY */
[data-ui-panel][data-closed],
[data-dd-panel][data-closed] {
  opacity: 0;
  transform: var(--ui-closed-transform, translateY(8px));
}

/* Open state - PANELS ONLY */
[data-ui-panel][data-open],
[data-dd-panel][data-open] {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

/* Enter transition */
[data-enter] {
  transition:
    opacity var(--ui-anim-in) var(--ui-ease-in),
    transform var(--ui-anim-in) var(--ui-ease-in),
    backdrop-filter var(--ui-anim-in) var(--ui-ease-in);
}

/* Leave transition */
[data-leave] {
  transition:
    opacity var(--ui-anim-out) var(--ui-ease-out),
    transform var(--ui-anim-out) var(--ui-ease-out),
    backdrop-filter var(--ui-anim-out) var(--ui-ease-out);
}

/* FOIC Prevention - panels hidden by default */
[data-ui-panel]:not([data-open]),
[data-dd-panel]:not([data-open]) {
  display: none;
}
```

### Appearance Rules (modal.css, etc.)

```css
/* ✅ CORRECT - No motion, only design */
.modal-panel {
  @apply flex w-full text-left text-base sm:my-8 sm:max-w-3xl;
}

/* ❌ WRONG - Motion belongs in animate-presence.css */
.modal-panel {
  transition: all 0.3s ease;
}
```

---

## Backdrop System

### Critical Rule

**Backdrops MUST NEVER receive transforms.**

This is enforced with:

```css
.ui-backdrop {
  transform: none !important;
}
```

### Why?

Backdrops are portaled to `<body>`, not nested in panels. They must:

- Only fade in/out
- Never translate
- Never scale
- Never rotate

### Backdrop States

```css
/* Closed */
.ui-backdrop[data-closed] {
  opacity: 0;
  backdrop-filter: blur(0);
}

/* Open */
.ui-backdrop[data-open] {
  opacity: 1;
  pointer-events: auto;
}
```

### Backdrop Variants

```css
.ui-backdrop[data-variant="dark"] {
  --ui-backdrop-bg: rgba(0, 0, 0, 0.75);
}

.ui-backdrop[data-variant="light"] {
  --ui-backdrop-bg: rgba(0, 0, 0, 0.35);
}

.ui-backdrop[data-variant="blur"] {
  --ui-backdrop-bg: rgba(0, 0, 0, 0.4);
  --ui-backdrop-filter: blur(16px);
}
```

---

## Motion Direction

### Helper Classes (Recommended)

**The preferred method for defining motion direction is CSS helper classes.**

Available classes in `animate-presence.css`:

```css
.ui-from-left   { --ui-closed-transform: translateX(-100%); }
.ui-from-right  { --ui-closed-transform: translateX(100%); }
.ui-from-bottom { --ui-closed-transform: translateY(100%); }
.ui-from-top    { --ui-closed-transform: translateY(-100%); }
.ui-scale-fade  { --ui-closed-transform: scale(0.96); }
```

**Usage:**

```html
<!-- Right drawer -->
<div data-ui-panel data-ui-type="drawer" class="ui-from-right">

<!-- Modal with scale -->
<div data-ui-panel data-ui-type="modal" class="ui-scale-fade">

<!-- Bottom sheet -->
<div data-ui-panel data-ui-type="drawer" class="ui-from-bottom">
```

### Custom Transforms (Advanced)

For non-standard motion, define `--ui-closed-transform` in component-scoped CSS:

```css
#special-panel[data-closed] {
  --ui-closed-transform: translateX(100%) rotate(5deg);
}
```

**NEVER set transforms via JavaScript.**

---

## Author Contract

**Authors do NOT:**
- Add `hidden` attribute in markup
- Add `data-open` or `data-closed` attributes
- Add `.is-open` or any state classes
- Define transitions in component CSS

**Authors DO:**
- Add `data-ui-panel` or `data-dd-panel` attribute
- Add motion direction class (e.g., `ui-from-right`)
- Define appearance styles only

**Example (correct):**
```html
<div 
    id="my-drawer"
    data-ui-panel
    data-ui-type="drawer"
    class="ui-from-right my-drawer-styles"
>
    <!-- Content -->
</div>
```

---

## Forbidden Patterns

### ❌ NEVER pass timing options to animation functions

```js
// WRONG
animateIn(panel, { durationIn: 260 });
animateOut(panel, { durationOut: 200 });
```

**Why:** Violates CSS-controlled timing contract

**Fix:** 
```js
// CORRECT
animateIn(panel);
animateOut(panel);
```

All timing must come from CSS variables.

---

### ❌ NEVER set transforms or timing via JavaScript

```js
// WRONG
panel.style.setProperty('--ui-closed-transform', 'translateX(100%)');
panel.style.transform = 'translateY(10px)';
panel.style.transition = '0.3s ease';
```

**Why:** Violates CSS-controlled motion contract

**Fix:** Use helper classes or component-scoped CSS

```html
<!-- CORRECT -->
<div data-ui-panel class="ui-from-right">
```

---

### ❌ NEVER add transitions in component CSS

```css
/* WRONG */
.my-modal {
  transition: all 0.3s ease;
}
```

**Why:** Creates duplicate/conflicting transitions

**Fix:** Use only `animate-presence.css` transitions

---

### ❌ NEVER use class-based state

```js
// WRONG
el.classList.add('is-open');
el.classList.remove('is-open');
```

**Why:** State must be data-attribute based

**Fix:** 
```js
// CORRECT - handled by animate-presence
animateIn(el);  // Sets data-open
animateOut(el); // Removes data-open
```

---

### ❌ NEVER add hidden in markup

```html
<!-- WRONG -->
<div data-ui-panel hidden>

<!-- CORRECT -->
<div data-ui-panel>
```

**Why:** Controller owns visibility via `hidden` attribute

---

### ❌ NEVER use unscoped `[data-closed]`

```css
/* WRONG */
[data-closed] {
  opacity: 0;
  transform: translateY(10px);
}
```

**Why:** Applies to backdrops, causing transform inheritance

**Fix:** Scope to panels only:
```css
[data-ui-panel][data-closed] { ... }
.ui-backdrop[data-closed] { opacity: 0; }
```

---

### ❌ NEVER set backdrop transforms

```css
/* WRONG */
.ui-backdrop {
  transform: translateY(100%);
}
```

**Why:** Backdrops must only fade, never move

**Fix:** Removed — enforced by `transform: none !important`

---

### ❌ NEVER use Web Animations API (WAAPI) directly

```js
// WRONG
el.animate([...], { duration: 300 });
```

**Why:** Bypasses unified lifecycle, creates inconsistency

**Fix:** Use `animateIn` / `animateOut` from `animate-presence.js`

---

## Gesture Exception

Bottom sheets with drag-to-dismiss are the **only** exception where JavaScript may temporarily modify `transform` and `opacity` during active gestures.

**Rules:**
1. Gesture logic lives in `modals-drawers.js`
2. After gesture ends, control returns to `animate-presence`
3. No permanent style modifications

---

## Debugging

### DevTools Inspection

Open panels will show:
```html
<div data-ui-panel data-open>
```

Closed panels will show:
```html
<div data-ui-panel hidden>
```

During animations:
```html
<!-- Opening -->
<div data-ui-panel data-enter data-open>

<!-- Closing -->
<div data-ui-panel data-leave data-closed>
```

### Common Issues

| Symptom | Cause | Fix |
|---------|-------|-----|
| No animation | Missing `[data-enter]`/`[data-leave]` CSS | Check animate-presence.css import |
| Flash on load | Missing FOIC prevention CSS | Add `[data-ui-panel]:not([data-open]) { display: none }` |
| Panel stuck open | Animation promise not resolving | Check for missing transitions on element |
| Backdrop visible | Missing `[data-closed]` styles | Check backdrop CSS rules |

---

## Migration from `.is-open`

If upgrading from class-based state:

1. Replace `.is-open` selectors with `[data-open]`
2. Remove `classList.add/remove('is-open')` calls
3. Remove `hidden` from markup
4. Use `animateIn`/`animateOut` for all state changes
