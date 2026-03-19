Below is a **clean, production-grade marquee controller spec** that matches your existing JS philosophy and can be dropped into your core UI layer alongside `slider.js`, `tabs.js`, etc. This is not a one-off script. It is a **reusable marquee engine** with a declarative HTML API, lifecycle safety, accessibility guards, and extensibility.

---

## 1. Component Philosophy (Aligned With Your Stack)

**What this is**

* A low-level **animation controller**, not a slider
* RAF-driven, zero dependencies
* Works for logos, text, testimonials, announcements, badges, etc.

**What this is not**

* Not Swiper
* Not CSS-only (needs measurement + cloning)
* Not opinionated about markup beyond a strict internal contract

---

## 2. Declarative HTML Contract (Authoring API)

```html
<div
  data-marquee
  data-marquee-direction="left"
  data-marquee-speed="40"
  data-marquee-pause-on-hover
  data-marquee-gap="32"
  data-marquee-repeat="auto"
>
  <div data-marquee-viewport>
    <div data-marquee-content>
      <!-- arbitrary children -->
      <img src="logo1.svg" alt="Brand 1">
      <img src="logo2.svg" alt="Brand 2">
      <span>Free shipping on orders over $99</span>
    </div>
  </div>
</div>
```

### Required Elements

| Attribute               | Purpose              |
| ----------------------- | -------------------- |
| `data-marquee`          | Root controller hook |
| `data-marquee-viewport` | Masking container    |
| `data-marquee-content`  | Items to animate     |

---

## 3. Supported Data Attributes (Core)

### Direction

```text
data-marquee-direction
```

| Value   | Axis | Meaning      |
| ------- | ---- | ------------ |
| `left`  | X    | Right → Left |
| `right` | X    | Left → Right |
| `up`    | Y    | Bottom → Top |
| `down`  | Y    | Top → Bottom |

---

### Speed

```text
data-marquee-speed="40"
```

* Units: **pixels per second**
* Direction-agnostic
* Fully deterministic and resolution-independent

---

### Gap Between Items

```text
data-marquee-gap="32"
```

* Injected as logical spacing between cloned items
* Prevents relying on margin hacks in authored markup

---

### Pause on Hover

```text
data-marquee-pause-on-hover
```

* Automatically pauses RAF loop
* No JS listeners needed per item
* Pointer-safe, touch-safe

---

### Repeat Strategy

```text
data-marquee-repeat
```

| Value            | Behavior                           |
| ---------------- | ---------------------------------- |
| `auto` (default) | Clone until content ≥ viewport × 2 |
| `once`           | Single pass, no looping            |
| `fixed`          | Use exact authored count           |

---

## 4. Accessibility & Motion Safety (Non-Negotiable)

Built-in guards:

* Honors `prefers-reduced-motion`
* Removes alt text from cloned images
* Never announces repeated content to screen readers
* Uses transform-only animation (no layout thrash)

Behavior when reduced motion is enabled:

* Marquee **does not initialize**
* Content remains static and readable

---

## 5. Internal State Model (Consistent With Your Codebase)

```js
const STATE = new WeakMap();
/*
{
  root,
  viewport,
  content,
  axis,        // 'x' | 'y'
  dir,         // -1 | 1
  speed,
  gap,
  pos,
  cycleSize,
  rafId,
  paused
}
*/
```

* WeakMap prevents leaks
* Fully instance-isolated
* Shopify section reload safe

---

## 6. Core Logic Highlights (What Matters)

### Direction Normalization

```js
const AXIS_MAP = {
  left:  { axis: 'x', dir: -1 },
  right: { axis: 'x', dir:  1 },
  up:    { axis: 'y', dir: -1 },
  down:  { axis: 'y', dir:  1 },
};
```

---

### Seamless Wrapping (No Jank)

* Track a **single cycle size**
* Reset position when threshold crossed
* Never reset to zero blindly

```js
if (dir === -1 && pos <= -cycleSize) pos += cycleSize;
if (dir ===  1 && pos >= 0)         pos -= cycleSize;
```

---

### Transform Application

```js
el.style.transform =
  axis === 'x'
    ? `translate3d(${pos}px,0,0)`
    : `translate3d(0,${pos}px,0)`;
```

---

## 7. Recommended Enhancements (Future-Proofing)

These make sense **in your ecosystem**:

### 1. Start Offset

```text
data-marquee-offset="50%"
```

* Useful for staggered rows or hero treatments

---

### 2. Sync Groups

```text
data-marquee-group="logos-a"
```

* Multiple marquees share a single RAF clock
* Perfect for stacked logo rows

---

### 3. Hover Direction Reverse

```text
data-marquee-hover-reverse
```

* Subtle premium UX
* Common in luxury brand marquees

---

### 4. Visibility Observer

* Pause animation when off-screen
* Matches your dropdown / modal context observers

---

## 8. When NOT to Use This

Use **Swiper** instead when:

* You need pagination
* You need user-driven navigation
* You need snapping or discrete slides

Use **Marquee** when:

* Content is ambient
* Motion is decorative or informational
* Infinite continuity matters