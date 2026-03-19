## Task: Fix Quickview Tooltip Visibility by Portaling Tooltips Outside Clipping Containers

### Problem Summary

Tooltips for product variants are not visible when viewing a product in **quickview mode**.
Increasing `z-index` does not resolve the issue.

This occurs because the quickview modal introduces new stacking contexts and clipping via properties such as:

* `overflow: hidden | auto`
* `transform` (used for centering or animation)

As a result, tooltips rendered inside the product card are clipped and cannot escape their parent container regardless of z-index.

---

### Objective

Update the tooltip implementation so that **all tooltips render via a portal attached to `document.body`**, ensuring they are visible in quickview mode and not affected by modal overflow or transforms.

---

### Requirements

#### 1. Tooltip Rendering

* Tooltips must be **removed from their original DOM position** and rendered under `document.body`
* Use a dedicated tooltip container element (for example: `.tooltip-portal-root`)
* Tooltips must position themselves relative to their trigger element using viewport coordinates

#### 2. Positioning

* Tooltip position should be calculated using `getBoundingClientRect()` on the trigger element
* Positioning must account for:

  * Scroll offset
  * Viewport edges (prevent off-screen overflow if possible)
* Tooltip positioning strategy:

  * Default: centered above the trigger
  * Fallback: below the trigger if insufficient space

#### 3. Styling

* Tooltip container must use:

  * `position: fixed`
  * A sane but high `z-index` (for example: `z-index: 9999`)
  * `pointer-events: none` unless interaction is required
* Existing tooltip styles and animations should be preserved

#### 4. Behavior

* Tooltips must continue to:

  * Show on hover (desktop)
  * Hide on mouse leave
* Tooltip behavior should work consistently in:

  * Standard product page
  * Quickview modal
  * Any future modal or drawer

#### 5. Cleanup

* Ensure tooltips are removed from the DOM on:

  * Mouse leave
  * Component unmount
  * Quickview close
* Avoid memory leaks or orphaned tooltip nodes

---

### Constraints

* Do not remove or relax `overflow` or `transform` styles on the quickview modal
* Do not rely on extreme `z-index` values to solve the problem
* Do not introduce layout shifts in the product card

---

### Acceptance Criteria

* Tooltips are fully visible in quickview mode
* Tooltips are not clipped by the modal or scroll containers
* Tooltips behave identically across normal product pages and quickview
* Implementation follows portal-based best practices

---

### Notes for Implementation

This should mirror how mature UI libraries handle tooltips (MUI, Radix, Floating UI):

* Render once at the document root
* Position relative to trigger
* Ignore parent stacking contexts entirely