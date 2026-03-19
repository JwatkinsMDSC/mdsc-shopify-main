# ✅ VISIBILITY OBSERVER — CORE UI UTILITY

## Design intent (locked)

`visibility-observer` is a **thin, explicit wrapper** around the native `IntersectionObserver` API.

Its sole responsibility is to answer one question:

> Is this element currently intersecting the viewport (or a custom root)?

It is intentionally **not a component**, **not stateful**, and **not opinionated** about behavior.

This utility exists to provide **viewport-based visibility signals** to higher-level UI controllers such as:

* marquee
* slider (autoplay)
* media gallery
* future scroll-aware UI primitives

---

## What this utility does

* Creates a single `IntersectionObserver` instance
* Normalizes `onEnter` / `onExit` callbacks
* Delegates all decisions to the caller
* Avoids global state
* Avoids DOM mutation
* Avoids side effects

---

## What this utility does NOT do (by design)

* Does NOT observe elements automatically
* Does NOT manage animation state
* Does NOT pause or resume anything
* Does NOT detect layout visibility
* Does NOT handle `display: none` or hidden parents
* Does NOT attach lifecycle listeners

Those responsibilities belong to **controllers**, not utilities.

---

## Typical use cases

This utility is appropriate when you need to:

* Pause animation when an element scrolls out of view
* Resume work shortly before an element becomes visible
* Defer expensive operations until content is near the viewport
* Coordinate animation behavior with scroll position

---

## API

### `createVisibilityObserver(options)`

Creates a new `IntersectionObserver` with normalized callbacks.

#### Options

| Option       | Type                 | Default  | Description                              |
| ------------ | -------------------- | -------- | ---------------------------------------- |
| `root`       | `Element \| null`    | `null`   | Root element for intersection checks     |
| `rootMargin` | `string`             | `100px`  | Margin around the root for early entry   |
| `threshold`  | `number \| number[]` | `0`      | Intersection ratio(s)                    |
| `onEnter`    | `Function`           | optional | Called when element becomes intersecting |
| `onExit`     | `Function`           | optional | Called when element stops intersecting   |

---

## Usage example

```js
import { createVisibilityObserver } from './utils/visibility-observer';

const observer = createVisibilityObserver({
  onEnter: () => {
    resumeAnimation();
  },
  onExit: () => {
    pauseAnimation();
  },
});

observer.observe(element);
```

---

## Lifecycle responsibility (important)

The caller **must**:

* Call `observer.observe(element)`
* Call `observer.disconnect()` when cleaning up (for example on section unload)

This mirrors the lifecycle ownership patterns used throughout `core/ui`.

---

## Architectural notes

* One observer per context is preferred
* Do not reuse observers across unrelated components
* Combine with `layout-visibility` for correct behavior in menus, tabs, and drawers
* Treat this utility as a **signal provider**, not a source of truth

---

## File location

```
src/scripts/core/ui/utils/visibility-observer.js
```