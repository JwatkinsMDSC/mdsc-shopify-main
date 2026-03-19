/**
 * Loading Skeleton Controller
 *
 * Purpose:
 * Provide a centralized, reusable system for showing and hiding
 * loading skeleton UI states across the site.
 *
 * Skeletons are used to:
 * - Prevent layout shift (CLS)
 * - Communicate loading state to users
 * - Improve perceived performance
 *
 * This module is:
 * - Framework-agnostic
 * - Shopify section reload safe
 * - Accessible (aria-busy aware)
 * - Reduced-motion friendly
 *
 * Visual appearance is handled entirely via CSS.
 * This file manages DOM state only.
 */

/* ======================================================
 * SELECTORS
 * ====================================================== */

const SELECTORS = {
  skeleton: '[data-skeleton]',
};

/* ======================================================
 * HELPERS
 * ====================================================== */

/**
 * Check whether reduced motion is preferred.
 *
 * @returns {boolean}
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Mark a root element as busy for accessibility.
 *
 * @param {HTMLElement} root
 */
function setBusy(root) {
  root.setAttribute('aria-busy', 'true');
}

/**
 * Clear busy state from a root element.
 *
 * @param {HTMLElement} root
 */
function clearBusy(root) {
  root.removeAttribute('aria-busy');
}

/* ======================================================
 * CORE API
 * ====================================================== */

/**
 * Show a skeleton inside a root container.
 *
 * Skeleton markup should already exist in the DOM
 * and be hidden by default via CSS.
 *
 * @param {HTMLElement} root
 */
function showSkeleton(root) {
  if (!root) return;

  const skeletons = root.querySelectorAll(SELECTORS.skeleton);
  if (!skeletons.length) return;

  setBusy(root);

  skeletons.forEach(el => {
    el.hidden = false;

    if (prefersReducedMotion()) {
      el.classList.add('is-static');
    }
  });
}

/**
 * Hide all skeletons within a root container.
 *
 * @param {HTMLElement} root
 */
function hideSkeleton(root) {
  if (!root) return;

  const skeletons = root.querySelectorAll(SELECTORS.skeleton);
  if (!skeletons.length) return;

  skeletons.forEach(el => {
    el.hidden = true;
    el.classList.remove('is-static');
  });

  clearBusy(root);
}

/**
 * Utility helper to wrap async work with skeleton visibility.
 *
 * @param {HTMLElement} root
 * @param {Function} asyncFn
 */
async function withSkeleton(root, asyncFn) {
  showSkeleton(root);

  try {
    await asyncFn();
  } finally {
    hideSkeleton(root);
  }
}

/* ======================================================
 * INITIALIZATION (OPTIONAL)
 * ====================================================== */

/**
 * Initialize skeletons within a context.
 *
 * This ensures skeletons are hidden by default
 * and safe across Shopify section reloads.
 *
 * NOTE: Per-image skeletons (skeleton-media-absolute) are managed
 * by the lazy loading system and should NOT be auto-hidden.
 *
 * @param {Document|HTMLElement} context
 */
function initSkeletons(context = document) {
  context.querySelectorAll(SELECTORS.skeleton).forEach(el => {
    // Skip per-image lazy loading skeletons
    if (el.classList.contains('skeleton-media-absolute')) {
      return;
    }
    el.hidden = true;
  });
}

/* ======================================================
 * LIFECYCLE HOOKS (DAWN-GRADE)
 * ====================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initSkeletons();
});

document.addEventListener('shopify:section:load', e => {
  initSkeletons(e.target);
});

/* ======================================================
 * EXPORTS
 * ====================================================== */

export {
  showSkeleton,
  hideSkeleton,
  withSkeleton,
};
