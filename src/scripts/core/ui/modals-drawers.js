/* ======================================================
   * UI MODALS & DRAWERS
   * ======================================================
   * CONFIGURATION
   * ====================================================== */
import { lockScroll, unlockScroll } from './scroll-lock';
import { trapFocus, releaseFocus } from './focus-trap';
import { animateIn, animateOut, cancelAnimation as cancelPresenceAnimation } from './animate-presence';
import { registerOutsideDismiss, unregisterOutsideDismiss } from './utils/outside-dismiss';

const SELECTORS = {
    trigger: '[data-ui-trigger]',
    panel: '[data-ui-panel]',
    anim: '[data-ui-anim]',
    context: '[data-ui-context]',
    back: '[data-ui-back]',
    handle: '[data-ui-drawer-handle]',
};

const GESTURE = {
    DISMISS_THRESHOLD: 100,
    VELOCITY_THRESHOLD: 0.5,
    DRAG_RESISTANCE: 0.7,
};

/* ======================================================
 * STATE
 * ------------------------------------------------------
 * Stack-based state management for modals and drawers.
 * ====================================================== */

const state = {
    stack: [],        // Array of { trigger, panel, anim, backdrop, type, stackable }
    animating: false,
};

/* ======================================================
 * HELPERS
 * ====================================================== */

function getPanel(trigger) {
    const id = trigger.getAttribute('aria-controls');
    return id ? document.getElementById(id) : null;
}

function getAnimEl(panel) {
    return panel.querySelector(SELECTORS.anim) || panel;
}

function createBackdrop(panel) {
    const el = document.createElement('div');
    el.className = 'ui-backdrop';
    
    const variant = panel?.getAttribute('data-ui-backdrop-variant');
    if (variant) {
        el.dataset.variant = variant;
    }
    
    document.body.appendChild(el);
    return el;
}

function cancelPanelAnimation() {
    const top = state.stack[state.stack.length - 1];
    if (top?.panel) {
        const el = getAnimEl(top.panel);
        cancelPresenceAnimation(el);
        if (top.backdrop) {
            cancelPresenceAnimation(top.backdrop);
        }
    }
}

function needsBackdrop(panel) {
    if (panel.hasAttribute('data-ui-no-backdrop')) {
        return false;
    }
    
    if (panel.hasAttribute('data-ui-backdrop')) {
        return true;
    }
    
    const type = panel.getAttribute('data-ui-type');
    const variant = panel.getAttribute('data-ui-variant');
    
    if (type === 'modal') {
        return true;
    }
    
    if (type === 'drawer' && variant === 'sheet') {
        return true;
    }
    
    return false;
}
function getPositionFromPanel(panel) {
    // Drawer position is purely declarative
    // Used ONLY for layout, never for animation
    const position = panel.getAttribute('data-ui-position');
    if (!position) return null;

    switch (position) {
        case 'left':
        case 'right':
        case 'top':
        case 'bottom':
            return position;
        default:
            return null;
    }
}

function applyPanelPositioning(panel) {
    const type = panel.getAttribute('data-ui-type');
    
    if (type === 'modal') {
        panel.style.position = 'fixed';
        panel.style.top = '0';
        panel.style.left = '0';
        panel.style.right = '0';
        panel.style.bottom = '0';
        panel.style.zIndex = '9999';
        return;
    }
    
    if (type === 'drawer') {
        const position = getPositionFromPanel(panel);
        if (!position) return;

        panel.style.position = 'fixed';
        panel.style.zIndex = '9999';

        switch (position) {
            case 'left':
                panel.style.top = '0';
                panel.style.left = '0';
                panel.style.bottom = '0';
                panel.style.right = '';
                break;
            case 'right':
                panel.style.top = '0';
                panel.style.right = '0';
                panel.style.bottom = '0';
                panel.style.left = '';
                break;
            case 'bottom':
                panel.style.bottom = '0';
                panel.style.left = '0';
                panel.style.right = '0';
                panel.style.top = '';
                break;
            case 'top':
                panel.style.top = '0';
                panel.style.left = '0';
                panel.style.right = '0';
                panel.style.bottom = '';
                break;
        }
    }
}

/* ======================================================
 * ANIMATION
 * ====================================================== */

/* ======================================================
 * GESTURE HANDLING (BOTTOM SHEETS)
 * ====================================================== */

function attachGesture(panel, entry) {
    const variant = panel.getAttribute('data-ui-variant');
    if (variant !== 'sheet' || !panel.hasAttribute('data-ui-gesture')) {
        return;
    }

    const el = getAnimEl(panel);
    const handle = panel.querySelector(SELECTORS.handle) || panel.querySelector('.drawer-handle');
    const target = handle || el;

    let startY = 0;
    let currentY = 0;
    let startTime = 0;
    let isDragging = false;
    let initialBackdropOpacity = 1;

    entry.isDraggingFn = () => isDragging;

    function onPointerDown(e) {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        if (state.animating) return;

        startY = e.clientY;
        currentY = startY;
        startTime = Date.now();
        isDragging = true;

        target.setPointerCapture(e.pointerId);
        
        panel.style.touchAction = 'none';
        panel.style.userSelect = 'none';
        
        if (entry.backdrop) {
            const backdropStyle = window.getComputedStyle(entry.backdrop);
            initialBackdropOpacity = parseFloat(backdropStyle.opacity) || 1;
        }

        e.preventDefault();
    }

    function onPointerMove(e) {
        if (!isDragging) return;

        currentY = e.clientY;
        const deltaY = Math.max(0, currentY - startY);
        const adjustedDelta = deltaY * GESTURE.DRAG_RESISTANCE;

        el.style.transition = 'none';
        el.style.transform = `translateY(${adjustedDelta}px)`;

        if (entry.backdrop) {
            const progress = 1 - Math.min(adjustedDelta / 300, 1);
            entry.backdrop.style.opacity = (initialBackdropOpacity * progress).toString();
        }
    }

    function onPointerUp(e) {
        if (!isDragging) return;

        const deltaY = Math.max(0, currentY - startY);
        const deltaTime = Date.now() - startTime;
        const velocity = deltaY / deltaTime;

        isDragging = false;
        target.releasePointerCapture(e.pointerId);
        
        panel.style.touchAction = '';
        panel.style.userSelect = '';

        const shouldDismiss = 
            deltaY > GESTURE.DISMISS_THRESHOLD || 
            velocity > GESTURE.VELOCITY_THRESHOLD;

        if (shouldDismiss) {
            close(entry.trigger, panel);
        } else {
            el.style.transition = '';
            el.style.transform = '';
            
            if (entry.backdrop) {
                entry.backdrop.style.opacity = '';
            }
        }
    }

    function onPointerCancel() {
        if (!isDragging) return;
        isDragging = false;
        
        panel.style.touchAction = '';
        panel.style.userSelect = '';
        
        el.style.transition = '';
        el.style.transform = '';
        
        if (entry.backdrop) {
            entry.backdrop.style.opacity = '';
        }
    }

    target.addEventListener('pointerdown', onPointerDown);
    target.addEventListener('pointermove', onPointerMove);
    target.addEventListener('pointerup', onPointerUp);
    target.addEventListener('pointercancel', onPointerCancel);

    entry.gestureCleanup = () => {
        target.removeEventListener('pointerdown', onPointerDown);
        target.removeEventListener('pointermove', onPointerMove);
        target.removeEventListener('pointerup', onPointerUp);
        target.removeEventListener('pointercancel', onPointerCancel);
    };
}

/* ======================================================
 * CONTROLLER
 * ====================================================== */

function closeAll() {
    while (state.stack.length) {
        const top = state.stack[state.stack.length - 1];
        close(top.trigger, top.panel, true);
    }
}

function closeTop() {
    const top = state.stack[state.stack.length - 1];
    if (top) {
        close(top.trigger, top.panel);
    }
}

function open(trigger, panel) {
    if (state.animating) return;

    // Prevent re-opening if it's already the top of stack
    const top = state.stack[state.stack.length - 1];
    if (top?.panel === panel) return;

    const isDrawer = panel.dataset.uiType === 'drawer';
    const isStackable = panel.hasAttribute('data-ui-stackable');

    // Clear stack for modals or non-stackable drawers
    if (!isDrawer || !isStackable) {
        closeAll();
    }
    
    // Prevent re-opening if already in stack
    if (state.stack.some(e => e.panel === panel)) return;

    state.animating = true;
    cancelPanelAnimation();
    
    applyPanelPositioning(panel);

    trigger?.setAttribute('aria-expanded', 'true');

    const backdrop = needsBackdrop(panel) ? createBackdrop(panel) : null;

    if (panel.hasAttribute('data-ui-lock-scroll')) {
        lockScroll();
    }

    if (panel.hasAttribute('data-ui-trap-focus')) {
        trapFocus(panel);
    }

    const entry = {
        trigger,
        panel,
        type: panel.dataset.uiType,
        stackable: isStackable,
        backdrop,
        gestureCleanup: null,
        isDraggingFn: null,
        outsideDismissCleanup: null
    };

    state.stack.push(entry);

    attachGesture(panel, entry);

    const entryId = `modal-drawer-${panel.id || state.stack.length}`;
    entry.outsideDismissCleanup = registerOutsideDismiss(entryId, {
        panel,
        trigger,
        onDismiss: () => close(trigger, panel),
        isDragging: () => entry.isDraggingFn ? entry.isDraggingFn() : false
    });

    const el = getAnimEl(panel);
    const panelAnimation = animateIn(el);
    const backdropAnimation = backdrop ? animateIn(backdrop) : null;

    Promise.all([panelAnimation, backdropAnimation].filter(Boolean)).then(() => {
        state.animating = false;
    });
}

function close(trigger, panel, immediate = false) {
    if (!panel) return;

    const stackIndex = state.stack.findIndex(i => i.panel === panel);
    if (stackIndex === -1) return;
    
    // Capture entry before removing
    const entry = state.stack[stackIndex];
    
    // Unregister outside-dismiss IMMEDIATELY at close start
    if (entry.outsideDismissCleanup) {
        entry.outsideDismissCleanup();
        entry.outsideDismissCleanup = null;
    }

    state.animating = true;
    state.stack.splice(stackIndex, 1);

    trigger?.setAttribute('aria-expanded', 'false');
    if (entry.trigger && entry.trigger !== trigger) {
        entry.trigger.setAttribute('aria-expanded', 'false');
    }

    const finalize = () => {
        entry.backdrop?.remove();

        if (entry.gestureCleanup) {
            entry.gestureCleanup();
            entry.gestureCleanup = null;
        }

        if (panel.hasAttribute('data-ui-lock-scroll')) {
            unlockScroll();
        }

        if (panel.hasAttribute('data-ui-trap-focus')) {
            releaseFocus(panel);
        }

        state.animating = false;
    };

    if (immediate) {
        finalize();
        return;
    }

    const el = getAnimEl(panel);
    const panelAnimation = animateOut(el);
    const backdropAnimation = entry.backdrop ? animateOut(entry.backdrop) : null;

    Promise.all([panelAnimation, backdropAnimation].filter(Boolean)).then(() => {
        finalize();
    });
}

/* ======================================================
 * EVENTS
 * ====================================================== */

function onTriggerPointerDown(e) {
    if (e.button !== 0) return;

    const trigger = e.target.closest(SELECTORS.trigger);
    if (!trigger) return;

    const panel = getPanel(trigger);
    if (!panel) return;

    e.preventDefault();
    e.stopPropagation();

    const isOpen = state.stack.some(i => i.panel === panel);
    isOpen ? close(trigger, panel) : open(trigger, panel);
}

function onBackClick(e) {
    if (!e.target.closest(SELECTORS.back)) return;
    e.preventDefault();
    closeTop();
}

function onBackdropPointerDown(e) {
    if (e.button !== 0) return;
    closeTop();
}

function onKeydown(e) {
    if (e.key === 'Escape') {
        closeTop();
    }
}

/* ======================================================
 * INIT (DAWN-GRADE)
 * ====================================================== */

function init(context = document) {
    context.querySelectorAll(SELECTORS.trigger).forEach(trigger => {
        if (trigger.__uiBound) return;
        trigger.__uiBound = true;

        const panel = getPanel(trigger);
        if (!panel) return;

        trigger.setAttribute('aria-expanded', 'false');
        
        const el = getAnimEl(panel);
        el.hidden = true;
        el.removeAttribute('data-open');
        el.removeAttribute('data-closed');
        el.removeAttribute('data-enter');
        el.removeAttribute('data-leave');
        
        applyPanelPositioning(panel);
    });
}

/* ======================================================
 * GLOBAL LISTENERS
 * ------------------------------------------------------
 * Using pointerdown in capture phase for triggers and backdrop
 * to match outside-dismiss timing and prevent race conditions.
 * Back button uses click since it's an explicit UI action.
 * ====================================================== */

document.addEventListener('pointerdown', onTriggerPointerDown, true);
document.addEventListener('click', onBackClick);
document.addEventListener('keydown', onKeydown);

document.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    if (e.target.classList.contains('ui-backdrop')) {
        onBackdropPointerDown(e);
    }
}, true);

// Route-change auto-close
window.addEventListener('popstate', closeAll);
document.addEventListener('shopify:section:unload', closeAll);
document.addEventListener('shopify:page:load', closeAll);

document.addEventListener('DOMContentLoaded', () => init());
document.addEventListener('shopify:section:load', e => init(e.target));
