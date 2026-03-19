# ✅ LAYOUT VISIBILITY — CORE UI UTILITY

## Design intent (locked)

`layout-visibility` determines whether an element is **currently visible within the active layout context**.

This utility answers a different question than `IntersectionObserver`:

> Is this element actually visible in the document layout right now?

It is designed to detect visibility issues caused by:

* `display: none`
* `visibility: hidden`
* collapsed mega menus
* closed drawers
* inactive tabs
* detached layout contexts

---

## Why this utility exists

IntersectionObserver alone is **not sufficient** for modern UI systems because:

* Elements can intersect the viewport while being hidden
* Mega menus and drawers are often mounted but inactive
* Tabs and accordions hide content without removing it from the DOM

This utility fills that gap.

---

## What this utility does

* Walks up the DOM tree
* Checks for CSS visibility blockers
* Verifies layout participation
* Returns a synchronous boolean result
* Performs no observation or mutation

---

## What this utility does NOT do

* Does NOT observe viewport intersection
* Does NOT listen for scroll or resize
* Does NOT track mutations
* Does NOT cache results
* Does NOT check opacity or z-index

It is intentionally **simple and deterministic**.

---

## API

### `isLayoutVisible(element)`

Returns `true` if the element is currently visible in the layout tree.

#### Checks performed

* Element exists and is an HTMLElement
* No ancestor has `display: none`
* No ancestor has `visibility: hidden`
* Element participates in layout (`offsetParent !== null`)

#### Returns

* `true` → element is layout-visible
* `false` → element is hidden or detached

---

## Usage example

```js
import { isLayoutVisible } from './utils/layout-visibility';

if (!isLayoutVisible(rootElement)) {
  pauseAnimation();
}
```

---

## Intended usage pattern

This utility is meant to be used as a **hard gate**, typically in combination with:

* `visibility-observer` (viewport signal)
* reduced-motion checks
* manual pause conditions (hover, focus, etc.)

Example logic:

```js
if (!isLayoutVisible(root) || !isInViewport) {
  state.paused = true;
}
```

---

## Performance characteristics

* Synchronous
* O(depth of DOM tree)
* Extremely cheap
* Safe to call inside animation guards

---

## File location

```
src/scripts/core/ui/utils/layout-visibility.js
```

---

## Final architectural note

Together, these two utilities establish a **correct visibility model** for your UI system:

* `visibility-observer` answers: *Can the user scroll to this?*
* `layout-visibility` answers: *Can the user actually see this right now?*

Controllers should **combine both**, never rely on one alone.