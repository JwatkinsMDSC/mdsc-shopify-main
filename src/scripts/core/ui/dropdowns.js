/* ======================================================
   * TO DO / FEATURE ENHANCEMENTS
   * ------------------------------------------------------
   * - refactor this observer logic into its own module
   * - add debug logging flags
   * - add per-dropdown opt-out flags
   * - add automatic cleanup on section unload
   * - hover-intent module (desktop only)
   * - keyboard arrow navigation
   * - focus trapping per dropdown
   * - debug mode with visual outlines
   * - unit-style tests via simple harness
   * ======================================================
   * CONFIGURATION
   * ------------------------------------------------------
   * Centralized values for timing and selectors.
   * Adjust here, not throughout the file.
   * ====================================================== */

import { animateIn, animateOut, cancelAnimation as cancelPresenceAnimation } from './animate-presence';
import { registerOutsideDismiss, unregisterOutsideDismiss } from './utils/outside-dismiss';

const DEBUG = true;

const SELECTORS = {
    trigger: '[data-dd-trigger]', // dropdown toggle
    panel: '[data-dd-panel]',     // dropdown container
    anim: '[data-dd-anim]',       // inner animated wrapper
    context: '[data-dd-context]', // layout visibility context
};

/* ======================================================
 * STATE
 * ------------------------------------------------------
 * Single source of truth for dropdown behavior.
 * Only ONE dropdown may be open at a time.
 * ====================================================== */

const state = {
    active: null,     // { trigger, panel, anim, lastFocus }
    animating: false, // blocks interaction during animations
    pendingOpen: null
};

/* ======================================================
 * HELPERS
 * ------------------------------------------------------
 * Small utilities to keep logic readable and explicit.
 * ====================================================== */

function getPanel(trigger) {
    const id = trigger.getAttribute('aria-controls');
    return id ? document.getElementById(id) : null;
}

function getAnimEl(panel) {
    return panel.querySelector(SELECTORS.anim) || panel;
}

function cancelDropdownAnimation() {
    if (state.active?.panel) {
        const el = getAnimEl(state.active.panel);
        cancelPresenceAnimation(el);
    }
}

/* ======================================================
 * CONTROLLER (OPEN / CLOSE)
 * ------------------------------------------------------
 * Coordinates state, accessibility, visibility, animation.
 * ====================================================== */

function open(trigger, panel) {
    if (DEBUG) console.log('[DROPDOWN] Opening:', { triggerId: trigger.id, panelId: panel.id });

    if (state.active && state.active.panel !== panel) {
        if (DEBUG) console.log('[DROPDOWN] Another dropdown open, queueing');
        state.pendingOpen = { trigger, panel };
        close(state.active.trigger, state.active.panel);
        return;
    }

    if (state.animating) {
        if (DEBUG) console.log('[DROPDOWN] OPEN SKIP - animating');
        return;
    }

    state.animating = true;
    cancelDropdownAnimation();

    trigger.setAttribute('aria-expanded', 'true');

    state.active = {
        trigger,
        panel,
        lastFocus: document.activeElement,
        outsideDismissCleanup: null
    };

    const dropdownId = `dropdown-${panel.id || 'active'}`;
    state.active.outsideDismissCleanup = registerOutsideDismiss(dropdownId, {
        panel,
        trigger,
        onDismiss: () => close(trigger, panel)
    });

    const el = getAnimEl(panel);
    animateIn(el).then(() => {
        if (DEBUG) console.log('[DROPDOWN] Animation complete');
        state.animating = false;
    });
}

function close(trigger, panel, immediate = false) {
    if (DEBUG) console.log('[DROPDOWN] Closing:', { triggerId: trigger?.id, panelId: panel?.id, immediate, animating: state.animating });

    if (!panel) {
        if (DEBUG) console.log('[DROPDOWN] SKIP - no panel');
        return;
    }

    if (DEBUG) console.log('[DROPDOWN] ✅ PROCEEDING WITH CLOSE');

    // Unregister outside-dismiss IMMEDIATELY at close start
    if (state.active?.outsideDismissCleanup) {
        if (DEBUG) console.log('[DROPDOWN] Unregistering outside-dismiss at close start');
        state.active.outsideDismissCleanup();
        state.active.outsideDismissCleanup = null;
    }

    state.animating = true;
    cancelDropdownAnimation();

    if (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
    }

    const finalize = () => {
        if (DEBUG) console.log('[DROPDOWN] Finalizing close');

        state.animating = false;
        state.active = null;

        if (state.pendingOpen) {
            const { trigger, panel } = state.pendingOpen;
            state.pendingOpen = null;
            open(trigger, panel);
        }
    };

    if (immediate) {
        finalize();
        return;
    }

    const el = getAnimEl(panel);
    if (DEBUG) console.log('[DROPDOWN] Starting animateOut for element:', el);
    animateOut(el).then(() => {
        if (DEBUG) console.log('[DROPDOWN] animateOut complete');
        finalize();
    }).catch(err => {
        if (DEBUG) console.error('[DROPDOWN] animateOut failed:', err);
        finalize();
    });
}

/* ======================================================
 * LAYOUT CONTEXT OBSERVERS
 * ------------------------------------------------------
 * Auto-close dropdowns when their parent context
 * becomes invisible or invalid due to responsive layout
 * changes, orientation changes, or CSS display rules.
 * ====================================================== */

const contextObservers = new Map();

function observeContext(trigger, panel) {
    const context = trigger.closest(SELECTORS.context);
    if (!context || contextObservers.has(panel)) return;

    // Viewport visibility observer
    const intersectionObserver = new IntersectionObserver(
        ([entry]) => {
            if (!entry.isIntersecting && state.active?.panel === panel) {
                close(state.active.trigger, state.active.panel);
            }
        },
        { threshold: 0.01 }
    );

    intersectionObserver.observe(context);

    // Layout / responsive observer
    const resizeObserver = new ResizeObserver(() => {
        const styles = getComputedStyle(context);
        const hidden =
            styles.display === 'none' ||
            styles.visibility === 'hidden' ||
            context.offsetParent === null;

        if (hidden && state.active?.panel === panel) {
            close(state.active.trigger, state.active.panel);
        }
    });

    resizeObserver.observe(context);

    contextObservers.set(panel, { intersectionObserver, resizeObserver });
}

/* ======================================================
 * EVENT HANDLERS
 * ------------------------------------------------------
 * Uses pointerdown (not click) to match outside-dismiss timing.
 * This prevents event ordering issues where outside-dismiss
 * fires before the trigger's click handler.
 * ====================================================== */

function onTriggerPointerDown(e) {
    if (DEBUG) console.log('[DROPDOWN] Trigger pointerdown:', { target: e.target.tagName, button: e.button });

    if (e.button !== 0) {
        if (DEBUG) console.log('[DROPDOWN] SKIP - not primary button');
        return;
    }

    const trigger = e.target.closest(SELECTORS.trigger);
    if (!trigger) {
        if (DEBUG) console.log('[DROPDOWN] SKIP - not a trigger');
        return;
    }

    const panel = getPanel(trigger);
    if (!panel) {
        if (DEBUG) console.log('[DROPDOWN] SKIP - no panel found');
        return;
    }

    e.preventDefault();
    e.stopPropagation();

    const expanded = trigger.getAttribute('aria-expanded') === 'true';
    if (DEBUG) console.log('[DROPDOWN] Toggle:', { expanded, triggerId: trigger.id, panelId: panel.id });
    expanded ? close(trigger, panel) : open(trigger, panel);
}

function onKeydown(e) {
    if (e.key === 'Escape' && state.active) {
        close(state.active.trigger, state.active.panel);
    }
}

/* ======================================================
 * INITIALIZATION (DAWN-GRADE)
 * ------------------------------------------------------
 * Idempotent and safe across Shopify section reloads.
 * ====================================================== */

function init(context = document) {
    context.querySelectorAll(SELECTORS.trigger).forEach(trigger => {
        if (trigger.__ddBound) return;
        trigger.__ddBound = true;

        const panel = getPanel(trigger);
        if (!panel) return;

        trigger.setAttribute('aria-expanded', 'false');
        
        const el = getAnimEl(panel);
        el.hidden = true;
        el.removeAttribute('data-open');
        el.removeAttribute('data-closed');
        el.removeAttribute('data-enter');
        el.removeAttribute('data-leave');

        observeContext(trigger, panel);
    });
}

/* ======================================================
 * GLOBAL LISTENERS
 * ------------------------------------------------------
 * Using pointerdown in capture phase for consistent timing
 * with the outside-dismiss utility (prevents race conditions).
 * ====================================================== */

document.addEventListener('pointerdown', onTriggerPointerDown, true);
document.addEventListener('keydown', onKeydown);

document.addEventListener('DOMContentLoaded', () => init());
document.addEventListener('shopify:section:load', e => init(e.target));