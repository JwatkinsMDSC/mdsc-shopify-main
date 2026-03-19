/**
 * MOBILE MENU CONTROLLER
 * ======================================================
 * Multi-level navigation controller for mobile menu drawer.
 * Handles forward/back navigation between menu levels.
 * 
 * The drawer itself is controlled by modals-drawers.js.
 * This controller manages the inner level navigation only.
 * 
 * CONSTRAINTS:
 * - JS controls state only
 * - CSS controls animation only
 * - Controller owns hidden attribute on levels
 * - No forced focus on pointer-based opens
 * ====================================================== */

import { animateIn, animateOut, cancelAnimation } from './animate-presence';

const DEBUG = true;

/* ======================================================
 * CONFIGURATION
 * ====================================================== */

const SELECTORS = {
    menu: '[data-mobile-menu]',
    level: '[data-menu-level]',
    forward: '[data-menu-target]',
    back: '[data-menu-back]',
};

/* ======================================================
 * STATE
 * ====================================================== */

const state = {
    root: null,
    levels: new Map(),
    levelStack: [],
    animating: false,
};

/* ======================================================
 * INPUT MODALITY TRACKING
 * ====================================================== */

let lastInputWasKeyboard = false;

window.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        lastInputWasKeyboard = true;
    }
});

window.addEventListener('pointerdown', () => {
    lastInputWasKeyboard = false;
});

/* ======================================================
 * HELPERS
 * ====================================================== */

function getLevel(id) {
    return state.levels.get(id) || null;
}

function getCurrentLevel() {
    const id = state.levelStack[state.levelStack.length - 1];
    return id ? getLevel(id) : null;
}

function focusFirstLink(panel) {
    if (!lastInputWasKeyboard) return;
    
    const link = panel.querySelector('.vertical-nav__link:not([data-menu-back])');
    if (link) {
        link.focus({ preventScroll: true });
    }
}

function ensureBackButton(panel, label) {
    if (panel.querySelector('[data-menu-back]')) return;
    
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'vertical-nav__link mb-2';
    btn.setAttribute('data-menu-back', '');
    btn.textContent = `‹ ${label}`;
    panel.prepend(btn);
    
    if (DEBUG) console.log('[MOBILE MENU] Injected back button:', label);
}

const DIRECTION_CLASSES = [
    'ui-enter-from-left',
    'ui-enter-from-right',
    'ui-exit-to-left',
    'ui-exit-to-right'
];

function setDirection(panel, direction) {
    panel.classList.remove(...DIRECTION_CLASSES);
    panel.classList.add(direction);
}

/* ======================================================
 * CONTROLLERS
 * ====================================================== */

function navigateForward(targetId, trigger) {
    if (DEBUG) console.log('[MOBILE MENU] Navigate forward:', targetId);
    
    if (state.animating) {
        if (DEBUG) console.log('[MOBILE MENU] SKIP - animating');
        return;
    }
    
    const target = getLevel(targetId);
    if (!target) {
        if (DEBUG) console.log('[MOBILE MENU] SKIP - target not found:', targetId);
        return;
    }
    
    const current = getCurrentLevel();
    if (!current) {
        if (DEBUG) console.log('[MOBILE MENU] SKIP - no current level');
        return;
    }
    
    if (trigger) {
        const label = trigger.getAttribute('data-menu-label') || trigger.textContent.trim();
        ensureBackButton(target, label);
    }
    
    setDirection(current, 'ui-exit-to-left');
    setDirection(target, 'ui-enter-from-right');
    
    state.animating = true;
    cancelAnimation(current);
    cancelAnimation(target);
    
    state.levelStack.push(targetId);
    
    Promise.all([
        animateOut(current),
        animateIn(target)
    ]).then(() => {
        if (DEBUG) console.log('[MOBILE MENU] Forward transition complete');
        state.animating = false;
        focusFirstLink(target);
    });
}

function navigateBack() {
    if (DEBUG) console.log('[MOBILE MENU] Navigate back');
    
    if (state.animating) {
        if (DEBUG) console.log('[MOBILE MENU] SKIP - animating');
        return;
    }
    
    if (state.levelStack.length <= 1) {
        if (DEBUG) console.log('[MOBILE MENU] SKIP - already at root');
        return;
    }
    
    const current = getCurrentLevel();
    if (!current) return;
    
    state.animating = true;
    cancelAnimation(current);
    
    state.levelStack.pop();
    const target = getCurrentLevel();
    if (!target) {
        state.animating = false;
        return;
    }
    
    cancelAnimation(target);
    
    setDirection(current, 'ui-exit-to-right');
    setDirection(target, 'ui-enter-from-left');
    
    Promise.all([
        animateOut(current),
        animateIn(target)
    ]).then(() => {
        if (DEBUG) console.log('[MOBILE MENU] Back transition complete');
        state.animating = false;
        focusFirstLink(target);
    });
}

function resetToRoot() {
    if (DEBUG) console.log('[MOBILE MENU] Reset to root');
    
    state.levels.forEach((panel, id) => {
        cancelAnimation(panel);
        panel.hidden = id !== 'root';
    });
    
    const root = getLevel('root');
    if (root) {
        root.setAttribute('data-open', '');
    }
    
    state.levelStack = ['root'];
    state.animating = false;
}

/* ======================================================
 * EVENT HANDLERS
 * ====================================================== */

function onForwardClick(e) {
    const trigger = e.target.closest(SELECTORS.forward);
    if (!trigger) return;
    
    const menu = trigger.closest(SELECTORS.menu);
    if (!menu || menu !== state.root) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const targetId = trigger.getAttribute('data-menu-target');
    if (targetId) {
        navigateForward(targetId, trigger);
    }
}

function onBackClick(e) {
    const trigger = e.target.closest(SELECTORS.back);
    if (!trigger) return;
    
    const menu = trigger.closest(SELECTORS.menu);
    if (!menu || menu !== state.root) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    navigateBack();
}

/* ======================================================
 * INITIALIZATION
 * ====================================================== */

function init(context = document) {
    const menu = context.querySelector(SELECTORS.menu);
    if (!menu) return;
    
    if (menu.__mobileMenuBound) return;
    menu.__mobileMenuBound = true;
    
    if (DEBUG) console.log('[MOBILE MENU] Initializing');
    
    state.root = menu;
    state.levels.clear();
    state.levelStack = [];
    
    menu.querySelectorAll(SELECTORS.level).forEach((panel) => {
        const id = panel.getAttribute('data-menu-level');
        if (!id) return;
        
        state.levels.set(id, panel);
        
        if (DEBUG) console.log('[MOBILE MENU] Registered level:', id);
    });
    
    resetToRoot();
    
    if (DEBUG) console.log('[MOBILE MENU] Init complete, levels:', state.levels.size);
}

/* ======================================================
 * GLOBAL LISTENERS
 * ====================================================== */

document.addEventListener('pointerdown', onForwardClick, true);
document.addEventListener('pointerdown', onBackClick, true);

function setupDrawerObserver() {
    const menu = document.querySelector(SELECTORS.menu);
    if (!menu) return;
    
    const drawer = menu.closest('[data-ui-panel][data-ui-type="drawer"]');
    if (!drawer || drawer.__mobileMenuObserver) return;
    
    drawer.__mobileMenuObserver = true;
    
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.attributeName === 'hidden') {
                if (drawer.hidden) {
                    resetToRoot();
                }
            }
        }
    });
    
    observer.observe(drawer, { attributes: true, attributeFilter: ['hidden'] });
    
    if (DEBUG) console.log('[MOBILE MENU] Drawer observer attached');
}

document.addEventListener('DOMContentLoaded', () => {
    init();
    setupDrawerObserver();
});
document.addEventListener('shopify:section:load', (e) => {
    init(e.target);
    setupDrawerObserver();
});

export { navigateForward, navigateBack, resetToRoot };
