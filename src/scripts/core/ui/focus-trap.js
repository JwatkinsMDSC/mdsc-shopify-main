/**
 * Focus Trap Utility
 *
 * Purpose:
 * Keep keyboard focus constrained within an open modal
 * or drawer, preventing focus from escaping into the
 * background UI.
 *
 * This is required for WCAG-compliant modals.
 *
 * Key characteristics:
 * - Opt-in per panel
 * - Supports stacked panels (LIFO)
 * - Restores focus on close
 * - Safe for Shopify / Dawn lifecycle
 *
 * Usage:
 *   import { trapFocus, releaseFocus } from './focus-trap';
 *
 *   trapFocus(panelElement);
 *   releaseFocus(panelElement);
 */

/* ======================================================
 * INTERNAL STATE
 * ====================================================== */

/**
 * Stack of active focus traps.
 * Last entry is the currently active trap.
 */
const trapStack = [];

/**
 * Track input method to gate auto-focus.
 * Only auto-focus on keyboard open, not mouse.
 */
let lastInputWasKeyboard = false;

window.addEventListener('keydown', (e) => {
  if (e.key === 'Tab' || e.key === 'Enter' || e.key === ' ') {
    lastInputWasKeyboard = true;
  }
});

window.addEventListener('pointerdown', () => {
  lastInputWasKeyboard = false;
});

/**
 * CSS selector for focusable elements.
 * This matches all standard interactive controls.
 */
const FOCUSABLE_SELECTOR = `
  a[href],
  button:not([disabled]),
  input:not([disabled]),
  select:not([disabled]),
  textarea:not([disabled]),
  [tabindex]:not([tabindex="-1"])
`;

/* ======================================================
 * HELPERS
 * ====================================================== */

/**
 * Get all focusable elements within a container.
 */
function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(FOCUSABLE_SELECTOR)
  ).filter(el => el.offsetParent !== null);
}

/**
 * Move focus to the first meaningful element in the panel.
 * Falls back to the panel itself if nothing is focusable.
 */
function focusInitial(panel) {
  const focusables = getFocusableElements(panel);

  if (focusables.length) {
    focusables[0].focus();
  } else {
    panel.setAttribute('tabindex', '-1');
    panel.focus();
  }
}

/**
 * Handle Tab / Shift+Tab cycling.
 */
function handleKeydown(e) {
  if (e.key !== 'Tab') return;

  const activeTrap = trapStack[trapStack.length - 1];
  if (!activeTrap) return;

  const { panel } = activeTrap;
  const focusables = getFocusableElements(panel);

  if (!focusables.length) {
    e.preventDefault();
    return;
  }

  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const active = document.activeElement;

  // Shift+Tab on first → wrap to last
  if (e.shiftKey && active === first) {
    e.preventDefault();
    last.focus();
  }

  // Tab on last → wrap to first
  if (!e.shiftKey && active === last) {
    e.preventDefault();
    first.focus();
  }
}

/* ======================================================
 * PUBLIC API
 * ====================================================== */

/**
 * Enable focus trapping inside a panel.
 *
 * @param {HTMLElement} panel
 */
export function trapFocus(panel) {
  if (!panel) return;

  // Prevent duplicate traps for same panel
  if (trapStack.some(entry => entry.panel === panel)) return;

  const previouslyFocused = document.activeElement;

  trapStack.push({
    panel,
    previouslyFocused,
  });

  // Only auto-focus on keyboard open, not mouse
  if (lastInputWasKeyboard) {
    requestAnimationFrame(() => {
      focusInitial(panel);
    });
  }

  // Attach keydown handler only once
  if (trapStack.length === 1) {
    document.addEventListener('keydown', handleKeydown);
  }
}

/**
 * Disable focus trapping for a panel.
 *
 * @param {HTMLElement} panel
 */
export function releaseFocus(panel) {
  if (!panel) return;

  const index = trapStack.findIndex(entry => entry.panel === panel);
  if (index === -1) return;

  const [{ previouslyFocused }] = trapStack.splice(index, 1);

  // Restore focus to the trigger if it still exists
  if (previouslyFocused && document.contains(previouslyFocused)) {
    previouslyFocused.focus();
  }

  // Remove keydown handler when no traps remain
  if (trapStack.length === 0) {
    document.removeEventListener('keydown', handleKeydown);
  }
}
