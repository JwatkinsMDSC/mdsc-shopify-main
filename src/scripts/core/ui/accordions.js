/**
 * Accordion Controller
 *
 * Purpose:
 * Provide accessible, declarative accordion behavior
 * for progressively revealing and hiding content.
 *
 * Accordions are commonly used for FAQs, filters,
 * product details, and dense informational layouts.
 *
 * This implementation follows WCAG Authoring Practices
 * for accordions and is safe for Shopify / Dawn lifecycle.
 *
 * Key characteristics:
 * - Declarative HTML API
 * - Multiple accordion groups per page
 * - Optional multi-open support
 * - Keyboard accessible
 * - Section reload safe
 *
 * Usage:
 *   Import once in global.js:
 *
 *     import './core/ui/accordion';
 *
 *   Author HTML using:
 *     - data-accordion
 *     - data-accordion-trigger
 *     - data-accordion-panel
 */

/* ======================================================
 * SELECTORS
 * ====================================================== */

/**
 * Centralized selectors used by the Accordion controller.
 */
const SELECTORS = {
  root: '[data-accordion]',
  trigger: '[data-accordion-trigger]',
  panel: '[data-accordion-panel]',
};

/* ======================================================
 * HELPERS
 * ====================================================== */

/**
 * Toggle a single accordion item.
 *
 * Responsibilities:
 * - Update aria-expanded state
 * - Show or hide the associated panel
 *
 * @param {HTMLElement} trigger
 * @param {HTMLElement} panel
 * @param {boolean} expanded
 */
function setExpanded(trigger, panel, expanded) {
  trigger.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  panel.hidden = !expanded;
}

/**
 * Close all accordion items within a group,
 * except for an optional excluded trigger.
 *
 * @param {HTMLElement} group
 * @param {HTMLElement|null} excludeTrigger
 */
function closeAll(group, excludeTrigger = null) {
  const triggers = group.querySelectorAll(SELECTORS.trigger);

  triggers.forEach(trigger => {
    if (trigger === excludeTrigger) return;

    const panelId = trigger.getAttribute('aria-controls');
    const panel = group.querySelector(`#${panelId}`);
    if (!panel) return;

    setExpanded(trigger, panel, false);
  });
}

/**
 * Handle keyboard interaction for accordion triggers.
 *
 * Supported keys:
 * - Enter / Space → toggle
 * - ArrowDown → next trigger
 * - ArrowUp → previous trigger
 * - Home → first trigger
 * - End → last trigger
 *
 * @param {KeyboardEvent} e
 * @param {HTMLElement} group
 * @param {HTMLElement} currentTrigger
 */
function handleKeydown(e, group, currentTrigger) {
  const triggers = Array.from(
    group.querySelectorAll(SELECTORS.trigger)
  );

  const index = triggers.indexOf(currentTrigger);
  let nextIndex = null;

  switch (e.key) {
    case 'Enter':
    case ' ':
      e.preventDefault();
      currentTrigger.click();
      return;

    case 'ArrowDown':
      nextIndex = (index + 1) % triggers.length;
      break;

    case 'ArrowUp':
      nextIndex = (index - 1 + triggers.length) % triggers.length;
      break;

    case 'Home':
      nextIndex = 0;
      break;

    case 'End':
      nextIndex = triggers.length - 1;
      break;

    default:
      return;
  }

  e.preventDefault();
  triggers[nextIndex].focus();
}

/* ======================================================
 * INITIALIZATION
 * ====================================================== */

/**
 * Initialize all accordion groups within a context.
 *
 * This function is:
 * - Idempotent
 * - Safe to call on Shopify section reloads
 *
 * @param {Document|HTMLElement} context
 */
function initAccordions(context = document) {
  const groups = context.querySelectorAll(SELECTORS.root);

  groups.forEach(group => {
    if (group.__accordionBound) return;
    group.__accordionBound = true;

    const allowMultiple = group.hasAttribute('data-accordion-multiple');
    const triggers = Array.from(
      group.querySelectorAll(SELECTORS.trigger)
    );

    triggers.forEach(trigger => {
      const panelId = trigger.getAttribute('aria-controls');
      const panel = group.querySelector(`#${panelId}`);
      if (!panel) return;

      // Initial state
      const expanded =
        trigger.getAttribute('aria-expanded') === 'true';

      trigger.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      trigger.setAttribute('role', 'button');
      panel.hidden = !expanded;

      // Click behavior
      trigger.addEventListener('click', () => {
        const isExpanded =
          trigger.getAttribute('aria-expanded') === 'true';

        if (!allowMultiple) {
          closeAll(group, trigger);
        }

        setExpanded(trigger, panel, !isExpanded);
      });

      // Keyboard behavior
      trigger.addEventListener('keydown', (e) => {
        handleKeydown(e, group, trigger);
      });
    });
  });
}

/* ======================================================
 * LIFECYCLE HOOKS (DAWN-GRADE)
 * ====================================================== */

/**
 * Initial page load
 */
document.addEventListener('DOMContentLoaded', () => {
  initAccordions();
});

/**
 * Shopify section reload support
 */
document.addEventListener('shopify:section:load', (e) => {
  initAccordions(e.target);
});
