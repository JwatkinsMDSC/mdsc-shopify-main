Perfect. This is the **right moment to stop adding scope** and formalize it.

Below is a **clean, authoritative Feature / To-Do / Upgrade list** for the **UI Panels System (Dropdowns, Modals, Drawers)** as it exists today. This locks the work, documents intent, and gives you a clear boundary so you can confidently move on to the next JS UI Core components.

No implementation, no churn. Just a precise backlog.

---

# ✅ UI PANELS SYSTEM — FEATURE LOCK & BACKLOG

## Status: **Production-Ready Core**

All items below are **explicitly deferred**, not forgotten.

---

## ✅ CURRENTLY IMPLEMENTED (LOCKED)

These are considered **done** and should not be revisited unless bugs arise.

### Core Architecture

* Declarative data-attribute API (`data-dd-*`, `data-ui-*`)
* Dawn-grade lifecycle handling (`DOMContentLoaded`, `shopify:section:load`)
* ES module structure under `src/scripts/core/ui/`
* Single global entry via `global.js`

### Dropdowns

* Click-based open / close
* Outside click handling
* Escape key close
* Animation-safe (WAAPI)
* Spam-click safe
* Context-aware auto-close (IntersectionObserver + ResizeObserver)

### Modals

* Backdrop creation and teardown
* Animated open / close
* Scroll locking (stack-safe)
* Focus trapping (WCAG compliant)
* Escape + backdrop click close

### Drawers

* Left / right / bottom positioning
* Animated entry / exit
* Scroll locking
* Focus trapping
* Context-aware auto-close

### Utilities

* `scroll-lock.js` (reference-counted, iOS safe)
* `focus-trap.js` (stack-safe, focus restore)
* Route / visibility auto-close protection

---

## 🧭 FEATURE / UPGRADE BACKLOG (LOCKED FOR NOW)

These are **approved but intentionally deferred**.
No partial implementation. No scope creep.

---

### 1️⃣ Drawer Stack Animations (Slide-Over Depth)

**Goal**

* Visually communicate stacked drawers
* Improve spatial awareness for nested navigation

**Planned Behavior**

* Top drawer slides over previous
* Underlying drawer shifts slightly (scale or offset)
* Back navigation feels native

**Notes**

* Requires stack-aware animation orchestration
* Should not re-animate underlying drawer on reveal
* Needs careful z-index + transform coordination

---

### 2️⃣ Header Offset & Safe Area Handling

**Goal**

* Prevent drawers/modals from overlapping fixed headers
* Support iOS safe areas (`env(safe-area-inset-*)`)

**Planned Behavior**

* Panels respect header height dynamically
* Bottom drawers account for mobile browser chrome
* Configurable via CSS variables

**Notes**

* Needs integration with header component
* Likely shared utility for layout metrics

---

### 3️⃣ Accessibility Enhancements (ARIA & Roles)

**Goal**

* Pass automated accessibility audits
* Improve screen reader experience

**Planned Additions**

* `role="dialog"` / `aria-modal="true"` for modals
* `aria-labelledby` and `aria-describedby`
* Focus announcement on open
* Restore focus semantics refinement

**Notes**

* Must remain declarative
* No hardcoded IDs in JS

---

### 4️⃣ Debug Overlay for Active Stack

**Goal**

* Developer-only visibility into UI state
* Faster debugging during development

**Planned Behavior**

* Toggleable overlay showing:

  * active panel stack
  * panel types
  * scroll lock state
  * focus trap state

**Notes**

* Dev-only flag
* Never shipped to production
* Likely tied to environment config

---

### 5️⃣ Unify Dropdowns + Panels Under One Controller

**Goal**

* Reduce duplication
* Single mental model for all overlay UI

**Planned Direction**

* Shared base controller
* Dropdowns become a “non-modal panel type”
* Shared animation + lifecycle code paths

**Notes**

* Significant refactor
* Only worth doing once all UI patterns stabilize
* Not required for current roadmap

---

## 📌 EXPLICITLY OUT OF SCOPE (FOR THIS PHASE)

These are **not** part of the current UI Core effort:

* Gesture-based drawer dragging
* Physics-based animations
* Virtualized panel content
* Portal mounting to custom roots
* SSR-specific behavior
* Theming APIs for third-party extensions

---

## 🧱 WHY THIS IS A GOOD STOPPING POINT

You now have:

* A **solid, extensible UI foundation**
* Clear architectural patterns
* Production-safe behavior
* A documented backlog instead of loose ideas
* No unfinished “almost features”

This is exactly how high-quality systems are built.

---

## 🚀 NEXT STEP (AS AGREED)

Move on to building **additional JS UI Core components**, such as:

* Tabs
* Accordions
* Toasts / notifications
* Tooltips / popovers
* Form helpers
* Sliders / carousels
* Stepper / wizard patterns

Whenever you’re ready, tell me **which component is next**, and we’ll build it to the **same standard** without revisiting this scope.
