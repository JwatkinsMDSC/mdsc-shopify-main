# FEATURE ENHANCEMENT

### Apply PauseManager + Visibility Guards to `slider.js`

**Status:** Planned
**Priority:** Medium
**Blocking:** No

---

## Current Situation

`slider.js` currently:

* Uses Swiper autoplay
* Pauses on hover
* Does not coordinate:

  * viewport visibility
  * layout visibility
  * reduced motion
* Manages pause logic internally

This creates inconsistent behavior compared to `marquee.js`.

---

## Proposed Enhancement

Refactor `slider.js` autoplay behavior to use:

* `PauseManager`
* `visibility-observer`
* `layout-visibility`

---

## Target Behavior

Autoplay should pause when:

* Slider is offscreen
* Slider is inside hidden layout context
* User prefers reduced motion
* Slider is hovered (if enabled)

Autoplay should resume **only when all conditions clear**.

---

## Non-Goals

* No changes to Swiper API
* No markup changes
* No breaking behavior
* No UI redesign

---

## Notes

* PauseManager should coordinate autoplay start/stop
* Swiper autoplay API should be driven by pause state
* Visibility observers should attach per slider instance
* This brings parity with marquee behavior

---

## Why this matters

Consistency across animated UI:

* Better performance
* Better accessibility
* Fewer edge-case bugs
* Easier future maintenance