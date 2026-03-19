/**
 * Scroll Lock Utility
 *
 * Purpose:
 * Prevent background page scrolling when an overlay UI
 * (modal or drawer) is open, without causing layout shift,
 * scroll jump, or iOS bugs.
 *
 * Key characteristics:
 * - Locks scrolling on <html>, not <body>
 * - Preserves scrollbar width to avoid layout shift
 * - Restores scroll position correctly on unlock
 * - Supports nested locks via reference counting
 * - Safe for stacked drawers or multiple modals
 *
 * Usage:
 *   import { lockScroll, unlockScroll } from './scroll-lock';
 *
 *   lockScroll();
 *   unlockScroll();
 */

/* ======================================================
 * INTERNAL STATE
 * ====================================================== */

/**
 * Number of active scroll locks.
 * Allows multiple panels to request a lock without
 * interfering with each other.
 */
let lockCount = 0;

/**
 * Cached scroll position before first lock.
 * Used to restore scroll position on final unlock.
 */
let scrollTop = 0;

/**
 * Cached scrollbar width.
 * Used to compensate for scrollbar disappearance.
 */
let scrollbarWidth = 0;

/* ======================================================
 * HELPERS
 * ====================================================== */

/**
 * Calculate the width of the browser scrollbar.
 * This prevents layout shift when overflow is hidden.
 */
function getScrollbarWidth() {
  return window.innerWidth - document.documentElement.clientWidth;
}

/**
 * Apply CSS needed to lock scrolling.
 * This is only run once, on the first lock.
 */
function applyLock() {
  const html = document.documentElement;

  scrollTop = window.pageYOffset || html.scrollTop;
  scrollbarWidth = getScrollbarWidth();

  /**
   * We lock <html> instead of <body> to avoid:
   * - iOS Safari bugs
   * - fixed-position header issues
   */
  html.style.position = 'fixed';
  html.style.top = `-${scrollTop}px`;
  html.style.left = '0';
  html.style.right = '0';
  html.style.width = '100%';
  html.style.overflow = 'hidden';

  /**
   * Compensate for removed scrollbar to prevent
   * horizontal layout shift.
   */
  if (scrollbarWidth > 0) {
    html.style.paddingRight = `${scrollbarWidth}px`;
  }
}

/**
 * Remove scroll lock styles and restore scroll position.
 * This is only run once, when the final lock is released.
 */
function removeLock() {
  const html = document.documentElement;

  html.style.position = '';
  html.style.top = '';
  html.style.left = '';
  html.style.right = '';
  html.style.width = '';
  html.style.overflow = '';
  html.style.paddingRight = '';

  /**
   * Restore scroll position.
   * Must happen after styles are cleared.
   */
  window.scrollTo(0, scrollTop);

  scrollTop = 0;
  scrollbarWidth = 0;
}

/* ======================================================
 * PUBLIC API
 * ====================================================== */

/**
 * Lock background scrolling.
 *
 * Safe to call multiple times.
 * Scroll will only unlock when all callers release.
 */
export function lockScroll() {
  if (lockCount === 0) {
    applyLock();
  }

  lockCount += 1;
}

/**
 * Unlock background scrolling.
 *
 * Only removes the lock when all callers
 * have released it.
 */
export function unlockScroll() {
  if (lockCount === 0) return;

  lockCount -= 1;

  if (lockCount === 0) {
    removeLock();
  }
}
