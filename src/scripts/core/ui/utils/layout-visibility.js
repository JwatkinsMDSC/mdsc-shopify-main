/**
 * Layout Visibility Utility
 *
 * Purpose:
 * Determine whether an element is currently visible
 * within the document layout, independent of viewport
 * intersection.
 *
 * This utility answers questions that IntersectionObserver
 * cannot reliably answer, such as:
 * - Is the element inside a collapsed menu?
 * - Is the element hidden via display or visibility?
 * - Is the element detached from layout flow?
 *
 * This helper is designed to be used in combination with
 * viewport-based visibility checks (IntersectionObserver)
 * to make correct animation and lifecycle decisions.
 *
 * Key characteristics:
 * - Synchronous, cheap checks
 * - No observers or listeners
 * - No DOM mutation
 * - Framework-agnostic
 * - Safe for Shopify / Dawn UI patterns
 *
 * Typical usage:
 *
 *   import { isLayoutVisible } from './utils/layout-visibility';
 *
 *   if (!isLayoutVisible(element)) {
 *     pauseAnimation();
 *   }
 */

/* ======================================================
 * CORE CHECKS
 * ====================================================== */

/**
 * Check whether an element is hidden via CSS display.
 *
 * @param {HTMLElement} el
 * @returns {boolean}
 */
function isDisplayNone(el) {
  return window.getComputedStyle(el).display === 'none';
}

/**
 * Check whether an element is hidden via CSS visibility.
 *
 * @param {HTMLElement} el
 * @returns {boolean}
 */
function isVisibilityHidden(el) {
  return window.getComputedStyle(el).visibility === 'hidden';
}

/**
 * Check whether an element is detached from layout flow.
 *
 * offsetParent === null covers:
 * - display: none ancestors
 * - elements not participating in layout
 *
 * Note:
 * - position: fixed elements still have an offsetParent
 * - This is a reliable and very fast signal
 *
 * @param {HTMLElement} el
 * @returns {boolean}
 */
function isDetachedFromLayout(el) {
  return el.offsetParent === null;
}

/* ======================================================
 * PUBLIC API
 * ====================================================== */

/**
 * Determine whether an element is currently visible
 * within the active layout context.
 *
 * Responsibilities:
 * - Walk up the DOM tree
 * - Ensure no ancestor hides the element
 * - Ensure the element participates in layout
 *
 * This function intentionally does NOT check:
 * - Viewport intersection
 * - Opacity
 * - Z-index or stacking context
 *
 * Those concerns are out of scope.
 *
 * @param {HTMLElement} el
 * @returns {boolean}
 */
function isLayoutVisible(el) {
  if (!el || !(el instanceof HTMLElement)) return false;

  let current = el;

  while (current && current !== document.body) {
    if (isDisplayNone(current)) return false;
    if (isVisibilityHidden(current)) return false;

    current = current.parentElement;
  }

  // Final structural check
  if (isDetachedFromLayout(el)) return false;

  return true;
}

/* ======================================================
 * EXPORTS
 * ====================================================== */

export {
  isLayoutVisible,
};
