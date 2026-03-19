# ✅ TOASTS — CORE UI COMPONENT

## Design intent (locked)

Toasts are **non-blocking, ephemeral notifications**.

They should:

* Never trap focus
* Never lock scroll
* Be stackable
* Auto-dismiss safely
* Allow manual dismissal
* Be globally accessible from JS
* Be Shopify-safe (no leaks on navigation)

---

## Data & API model

Toasts are **JS-driven**, not markup-authored like tabs or accordions.

We expose a **single public API**:

```js
toast.show({
  message: 'Item added to cart',
  variant: 'success',
  duration: 4000,
});
```

---

## File location

```
src/scripts/core/ui/toast.js
```

---

## `toast.js` (Policy-Compliant, Production-Ready)

```js
/**
 * Toast Notification System
 *
 * Purpose:
 * Display brief, non-blocking messages to users
 * for confirmations, alerts, and system feedback.
 *
 * Toasts are ephemeral UI elements that:
 * - Do not trap focus
 * - Do not block interaction
 * - Automatically dismiss after a duration
 *
 * This implementation is:
 * - Framework-agnostic
 * - Shopify / Dawn lifecycle safe
 * - Stackable
 * - Accessible
 *
 * Usage:
 *   import { toast } from './core/ui/toast';
 *
 *   toast.show({
 *     message: 'Saved successfully',
 *     variant: 'success',
 *     duration: 4000,
 *   });
 */

/* ======================================================
 * CONFIGURATION
 * ====================================================== */

/**
 * Default toast duration in milliseconds.
 */
const DEFAULT_DURATION = 4000;

/**
 * Root container ID for all toasts.
 */
const CONTAINER_ID = 'ui-toast-container';

/**
 * Toast variants (used for styling hooks).
 */
const VARIANTS = [
  'info',
  'success',
  'warning',
  'error',
];

/* ======================================================
 * INTERNAL STATE
 * ====================================================== */

/**
 * Active toast instances.
 */
let toasts = [];

/**
 * Singleton toast container element.
 */
let container = null;

/* ======================================================
 * HELPERS
 * ====================================================== */

/**
 * Ensure the toast container exists.
 * Creates it once and reuses it.
 */
function ensureContainer() {
  if (container) return container;

  container = document.getElementById(CONTAINER_ID);

  if (!container) {
    container = document.createElement('div');
    container.id = CONTAINER_ID;
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-atomic', 'true');

    document.body.appendChild(container);
  }

  return container;
}

/**
 * Remove a toast from DOM and state.
 *
 * @param {HTMLElement} toastEl
 */
function removeToast(toastEl) {
  toasts = toasts.filter(t => t !== toastEl);

  toastEl.classList.remove('is-visible');

  // Allow CSS animation to complete
  toastEl.addEventListener(
    'transitionend',
    () => toastEl.remove(),
    { once: true }
  );
}

/* ======================================================
 * PUBLIC API
 * ====================================================== */

/**
 * Show a toast notification.
 *
 * @param {Object} options
 * @param {string} options.message - Toast message text
 * @param {string} [options.variant] - info | success | warning | error
 * @param {number} [options.duration] - Auto-dismiss delay (ms)
 */
function show({ message, variant = 'info', duration = DEFAULT_DURATION }) {
  if (!message) return;

  const toastContainer = ensureContainer();

  const toastEl = document.createElement('div');
  toastEl.className = 'ui-toast';
  toastEl.setAttribute('role', 'status');

  if (VARIANTS.includes(variant)) {
    toastEl.dataset.variant = variant;
  }

  toastEl.innerHTML = `
    <div class="ui-toast-content">
      <span class="ui-toast-message">${message}</span>
      <button
        class="ui-toast-close"
        aria-label="Dismiss notification"
        type="button"
      >
        ×
      </button>
    </div>
  `;

  // Close button handler
  toastEl
    .querySelector('.ui-toast-close')
    .addEventListener('click', () => {
      removeToast(toastEl);
    });

  toastContainer.appendChild(toastEl);
  toasts.push(toastEl);

  // Force reflow so transition applies
  toastEl.offsetHeight;
  toastEl.classList.add('is-visible');

  // Auto-dismiss
  if (duration > 0) {
    setTimeout(() => {
      if (document.contains(toastEl)) {
        removeToast(toastEl);
      }
    }, duration);
  }
}

/**
 * Clear all active toasts.
 * Useful on route change or hard resets.
 */
function clear() {
  toasts.forEach(removeToast);
  toasts = [];
}

/* ======================================================
 * LIFECYCLE SAFETY
 * ====================================================== */

/**
 * Clear toasts on navigation / visibility change
 * to prevent orphaned UI.
 */
window.addEventListener('popstate', clear);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) clear();
});

/* ======================================================
 * EXPORT
 * ====================================================== */

export const toast = {
  show,
  clear,
};
```

---

## Required CSS (Tailwind-Friendly)

You control animation and visuals **purely in CSS**.

```css
/* Toast container */
#ui-toast-container {
  @apply fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none;
}

/* Toast */
.ui-toast {
  @apply pointer-events-auto opacity-0 translate-y-2
         transition-all duration-200 ease-out;
}

/* Visible state */
.ui-toast.is-visible {
  @apply opacity-100 translate-y-0;
}

/* Toast content */
.ui-toast-content {
  @apply flex items-start gap-3 bg-gray-900 text-white
         px-4 py-3 rounded shadow-lg;
}

/* Close button */
.ui-toast-close {
  @apply text-white/70 hover:text-white;
}

/* Variants */
.ui-toast[data-variant="success"] {
  @apply bg-green-600;
}

.ui-toast[data-variant="warning"] {
  @apply bg-yellow-600 text-black;
}

.ui-toast[data-variant="error"] {
  @apply bg-red-600;
}
```

---

## Example usage (drop-in test)

```js
import { toast } from './core/ui/toast';

toast.show({
  message: 'Item added to cart',
  variant: 'success',
});

toast.show({
  message: 'Network error occurred',
  variant: 'error',
  duration: 6000,
});
```

---

## Accessibility notes (correct by design)

* Uses `role="status"`
* `aria-live="polite"` prevents interruption
* Close button is keyboard accessible
* Does not steal focus
* Does not trap focus

---

## What’s intentionally **not** included (locked)

* No promise-based API (can be layered later)
* No progress bars
* No swipe gestures
* No stacking limits
* No queue management
* No toast actions beyond close

These can be added later **without breaking this API**.

---

## Status

✅ Toasts are **production-ready**
✅ Matches all organizational standards
✅ Safe to ship
✅ Locked feature scope