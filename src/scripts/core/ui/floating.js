/**
 * Floating UI Controller (Tooltips & Popovers)
 *
 * Purpose:
 * Provide a unified, accessible positioning engine
 * for tooltips and popovers using Floating UI.
 *
 * This implementation correctly handles clipping
 * contexts (overflow-hidden) by portaling floating
 * panels to document.body and using fixed positioning.
 *
 * Key characteristics:
 * - Uses Floating UI for positioning
 * - Escapes clipping ancestors safely
 * - Declarative HTML API
 * - Shopify / Dawn lifecycle safe
 *
 * Usage:
 *   import './core/ui/floating';
 */

/* ======================================================
 * DEPENDENCIES
 * ====================================================== */

import {
  computePosition,
  autoUpdate,
  offset,
  flip,
  shift,
} from '@floating-ui/dom';

import { registerOutsideDismiss } from './utils/outside-dismiss';

/* ======================================================
 * SELECTORS
 * ====================================================== */

const SELECTORS = {
  trigger: '[data-floating-trigger]',
  panel: '[data-floating-panel]',
};

/* ======================================================
 * INTERNAL STATE
 * ====================================================== */

/**
 * Active floating instances.
 * Each instance: { panel, cleanup, outsideDismissCleanup }
 */
const instances = new Map();

/* ======================================================
 * HELPERS
 * ====================================================== */

/**
 * Ensure the floating panel is portaled to <body>.
 *
 * This prevents clipping by overflow-hidden ancestors.
 *
 * @param {HTMLElement} panel
 */
function maybePortal(panel) {
  if (!panel.hasAttribute('data-floating-portal')) return;
  if (panel.__portaled) return;

  document.body.appendChild(panel);
  panel.__portaled = true;
}

/**
 * Position a floating panel relative to its trigger.
 *
 * Uses fixed positioning to avoid layout clipping.
 *
 * @param {HTMLElement} trigger
 * @param {HTMLElement} panel
 * @param {string} placement
 * @param {number} offsetValue
 */
function positionFloating(trigger, panel, placement, offsetValue) {
  const usePortal = panel.hasAttribute('data-floating-portal');

  return computePosition(trigger, panel, {
    placement,
    strategy: usePortal ? 'fixed' : 'absolute',
    middleware: [
      offset(offsetValue),
      flip(),
      shift({ padding: 8 }),
    ],
  }).then(({ x, y }) => {
    Object.assign(panel.style, {
      left: `${x}px`,
      top: `${y}px`,
    });
  });
}

/**
 * Show the floating panel.
 */
function show(trigger, panel) {
  panel.hidden = false;
  panel.classList.add('is-visible');
  trigger.setAttribute('aria-expanded', 'true');
}

/**
 * Hide the floating panel.
 */
function hide(trigger, panel) {
  panel.classList.remove('is-visible');
  panel.hidden = true;
  trigger.setAttribute('aria-expanded', 'false');

  const instance = instances.get(trigger);
  if (instance?.outsideDismissCleanup) {
    instance.outsideDismissCleanup();
    instance.outsideDismissCleanup = null;
  }
}

/* ======================================================
 * INITIALIZATION
 * ====================================================== */

function initFloating(context = document) {
  const triggers = context.querySelectorAll(SELECTORS.trigger);

  triggers.forEach(trigger => {
    if (instances.has(trigger)) return;

    const panelId = trigger.getAttribute('aria-controls');
    const panel = document.getElementById(panelId);
    if (!panel) return;

    const type = trigger.dataset.floatingType || 'tooltip';
    const placement = trigger.dataset.floatingPlacement || 'top';
    const offsetValue = Number(trigger.dataset.floatingOffset) || 8;

    maybePortal(panel);
    panel.hidden = true;

    const cleanup = autoUpdate(trigger, panel, () => {
      positionFloating(trigger, panel, placement, offsetValue);
    });

    instances.set(trigger, { panel, cleanup, outsideDismissCleanup: null });

    // Tooltip behavior
    if (type === 'tooltip') {
      trigger.addEventListener('mouseenter', () => show(trigger, panel));
      trigger.addEventListener('mouseleave', () => hide(trigger, panel));
      trigger.addEventListener('focus', () => show(trigger, panel));
      trigger.addEventListener('blur', () => hide(trigger, panel));
    }

    // Popover behavior - uses pointerdown for consistent timing with outside-dismiss
    if (type === 'popover') {
      trigger.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();
        const expanded = trigger.getAttribute('aria-expanded') === 'true';
        
        if (expanded) {
          hide(trigger, panel);
        } else {
          show(trigger, panel);
          
          const instance = instances.get(trigger);
          const popoverId = `popover-${panel.id || trigger.id || 'floating'}`;
          instance.outsideDismissCleanup = registerOutsideDismiss(popoverId, {
            panel,
            trigger,
            onDismiss: () => hide(trigger, panel)
          });
        }
      });
    }
  });
}

/* ======================================================
 * LIFECYCLE HOOKS
 * ====================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initFloating();
});

document.addEventListener('shopify:section:load', (e) => {
  initFloating(e.target);
});
