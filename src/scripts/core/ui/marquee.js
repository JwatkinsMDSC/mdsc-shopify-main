/**
 * Marquee Controller
 *
 * PURPOSE
 * -------
 * Canonical marquee / continuous scrolling controller.
 * Handles:
 * - Horizontal and vertical scrolling
 * - Deterministic speed (px/sec)
 * - Seamless looping via cloning
 * - Reduced motion compliance
 * - Pause on hover
 * - Viewport visibility pause
 * - Layout visibility pause
 * - Shopify lifecycle safety
 *
 * This is a low-level animation primitive.
 * It is NOT a slider and has no user navigation.
 */

import { createVisibilityObserver } from './utils/visibility-observer.js';
import { isLayoutVisible } from './utils/layout-visibility.js';
import { createPauseManager } from './utils/pause-manager.js';

/* ======================================================
 * SELECTORS
 * ====================================================== */

const SELECTORS = {
    root: '[data-marquee]',
    viewport: '[data-marquee-viewport]',
    content: '[data-marquee-content]',
};

/* ======================================================
 * INTERNAL STATE
 * ====================================================== */

const INSTANCES = new WeakMap();

/* ======================================================
 * HELPERS
 * ====================================================== */

function prefersReducedMotion() {
    return (
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
}

function readNumber(el, attr, fallback) {
    const raw = el.getAttribute(attr);
    if (raw === null || raw === '') return fallback;
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
}

function readString(el, attr, fallback) {
    const val = el.getAttribute(attr);
    return val ? val.toLowerCase() : fallback;
}

/* ======================================================
 * DIRECTION NORMALIZATION
 * ====================================================== */

const DIRECTION_MAP = {
    left: { axis: 'x', dir: -1 },
    right: { axis: 'x', dir: 1 },
    up: { axis: 'y', dir: -1 },
    down: { axis: 'y', dir: 1 },
};

/* ======================================================
 * DEBUG HELPERS
 * ====================================================== */

function isDebugEnabled(root) {
    return root.hasAttribute('data-marquee-debug') || window.MDSC_DEBUG === true;
}

function log(state, message, data = {}) {
    if (!state.debug) return;
    console.log(`[marquee]`, message, data);
}

function createDebugOverlay(state) {
    if (!state.debug) return;
    
    // Remove existing overlay if present
    removeDebugOverlay(state);
    
    const overlay = document.createElement('div');
    overlay.className = 'marquee-debug-overlay';
    overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        z-index: 9999;
    `;
    
    // Viewport boundary indicator
    const viewportBounds = document.createElement('div');
    viewportBounds.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 2px dashed rgba(255, 0, 0, 0.5);
        box-sizing: border-box;
    `;
    
    // Loop reset boundary indicator
    const loopBounds = document.createElement('div');
    const loopSize = state.originalContentSize;
    
    if (state.axis === 'x') {
        loopBounds.style.cssText = `
            position: absolute;
            top: 0;
            left: ${loopSize}px;
            bottom: 0;
            width: 2px;
            background: rgba(0, 255, 0, 0.6);
        `;
    } else {
        loopBounds.style.cssText = `
            position: absolute;
            top: ${loopSize}px;
            left: 0;
            right: 0;
            height: 2px;
            background: rgba(0, 255, 0, 0.6);
        `;
    }
    
    // Label for viewport
    const viewportLabel = document.createElement('div');
    viewportLabel.textContent = 'Viewport';
    viewportLabel.style.cssText = `
        position: absolute;
        top: 4px;
        left: 4px;
        background: rgba(255, 0, 0, 0.8);
        color: white;
        padding: 2px 6px;
        font-size: 10px;
        font-family: monospace;
        border-radius: 2px;
    `;
    
    // Label for loop boundary
    const loopLabel = document.createElement('div');
    loopLabel.textContent = 'Loop Reset';
    if (state.axis === 'x') {
        loopLabel.style.cssText = `
            position: absolute;
            top: 4px;
            left: ${loopSize + 4}px;
            background: rgba(0, 255, 0, 0.8);
            color: white;
            padding: 2px 6px;
            font-size: 10px;
            font-family: monospace;
            border-radius: 2px;
        `;
    } else {
        loopLabel.style.cssText = `
            position: absolute;
            top: ${loopSize + 4}px;
            left: 4px;
            background: rgba(0, 255, 0, 0.8);
            color: white;
            padding: 2px 6px;
            font-size: 10px;
            font-family: monospace;
            border-radius: 2px;
        `;
    }
    
    overlay.appendChild(viewportBounds);
    overlay.appendChild(loopBounds);
    overlay.appendChild(viewportLabel);
    overlay.appendChild(loopLabel);
    
    state.viewport.style.position = 'relative';
    state.viewport.appendChild(overlay);
    state.debugOverlay = overlay;
}

function removeDebugOverlay(state) {
    if (state.debugOverlay) {
        state.debugOverlay.remove();
        state.debugOverlay = null;
    }
}

/* ======================================================
 * CORE LOGIC
 * ====================================================== */

function buildClones(state) {
    const { content, viewport, gap } = state;

    const originals = Array.from(content.children).filter(
        el => !el.dataset.marqueeClone
    );

    if (!originals.length) return;

    // Reset content to originals only
    content.innerHTML = '';
    originals.forEach(el => content.appendChild(el));

    const makeCloneSet = () => {
        const frag = document.createDocumentFragment();
        originals.forEach(node => {
            const clone = node.cloneNode(true);
            clone.dataset.marqueeClone = 'true';

            // Prevent repeated screen reader announcements
            const img = clone.querySelector('img');
            if (img) img.alt = '';

            if (gap > 0) {
                clone.style.marginInlineEnd = `${gap}px`;
            }

            frag.appendChild(clone);
        });
        return frag;
    };

    // Measure original content size
    let originalContentSize = 0;
    originals.forEach(el => {
        const rect = el.getBoundingClientRect();
        originalContentSize += state.axis === 'x' ? rect.width : rect.height;
        if (gap > 0) originalContentSize += gap;
    });

    // Measure viewport size
    const viewportSize =
        state.axis === 'x'
            ? viewport.getBoundingClientRect().width
            : viewport.getBoundingClientRect().height;

    // FIX: cycleSize must include viewport to ensure full content exits before loop
    state.originalContentSize = originalContentSize;
    state.viewportSize = viewportSize;
    state.cycleSize = Math.max(1, originalContentSize + viewportSize);

    log(state, 'buildClones', {
        direction: state.direction,
        axis: state.axis,
        speed: state.speed,
        originalContentSize,
        viewportSize,
        cycleSize: state.cycleSize,
    });

    // Clone until content is long enough
    content.appendChild(makeCloneSet());

    while (
        (state.axis === 'x'
            ? content.scrollWidth
            : content.scrollHeight) < viewportSize * 2
    ) {
        content.appendChild(makeCloneSet());
    }

    state.pos = 0;
    applyTransform(state);
    
    // Create debug overlay if debug mode is enabled
    createDebugOverlay(state);
}

function applyTransform(state) {
    const { content, axis, pos } = state;

    content.style.transform =
        axis === 'x'
            ? `translate3d(${pos}px,0,0)`
            : `translate3d(0,${pos}px,0)`;
}

function tick(state, ts) {
    if (!state.lastTs) state.lastTs = ts;
    const dt = (ts - state.lastTs) / 1000;
    state.lastTs = ts;

    // Check layout visibility and update pause state
    if (!isLayoutVisible(state.root)) {
        state.pause.add('layout');
    } else {
        state.pause.remove('layout');
    }

    // Only animate when all pause conditions are cleared
    if (!state.pause.isPaused()) {
        state.pos += state.dir * state.speed * dt;

        if (state.dir === -1 && state.pos <= -state.cycleSize) {
            state.pos += state.cycleSize;
        }

        if (state.dir === 1 && state.pos >= 0) {
            state.pos -= state.cycleSize;
        }

        applyTransform(state);
    }

    state.rafId = requestAnimationFrame(t => tick(state, t));
}

/* ======================================================
 * INSTANCE SETUP
 * ====================================================== */

function initOne(root) {
    if (INSTANCES.has(root)) return;

    const viewport = root.querySelector(SELECTORS.viewport);
    const content = root.querySelector(SELECTORS.content);
    if (!viewport || !content) return;

    const direction = readString(root, 'data-marquee-direction', 'left');
    const speed = readNumber(root, 'data-marquee-speed', 40);
    const gap = readNumber(root, 'data-marquee-gap', 0);
    const debug = isDebugEnabled(root);

    const map = DIRECTION_MAP[direction] || DIRECTION_MAP.left;

    // Create pause manager
    const pause = createPauseManager();

    const state = {
        root,
        viewport,
        content,
        axis: map.axis,
        dir: map.dir,
        direction,
        speed,
        gap,
        pos: 0,
        cycleSize: 0,
        originalContentSize: 0,
        viewportSize: 0,
        rafId: null,
        lastTs: 0,
        pause,
        debug,
        debugOverlay: null,
        visibilityObserver: null,
    };

    // Handle reduced motion (permanent pause)
    if (prefersReducedMotion()) {
        state.pause.add('reduced-motion');
    }

    // Setup hover pause
    if (root.hasAttribute('data-marquee-pause-on-hover')) {
        root.addEventListener('mouseenter', () => {
            state.pause.add('hover');
        });
        root.addEventListener('mouseleave', () => {
            state.pause.remove('hover');
        });
    }

    // Setup viewport visibility observer
    const visibilityObserver = createVisibilityObserver({
        onEnter: () => {
            state.pause.remove('viewport');
        },
        onExit: () => {
            state.pause.add('viewport');
        },
    });

    visibilityObserver.observe(root);
    state.visibilityObserver = visibilityObserver;

    const start = () => {
        cancelAnimationFrame(state.rafId);
        state.lastTs = 0;
        buildClones(state);
        state.rafId = requestAnimationFrame(t => tick(state, t));
    };

    // Wait for images to load before measuring
    const images = Array.from(content.querySelectorAll('img'));
    let pending = images.length;

    if (!pending) {
        start();
    } else {
        images.forEach(img => {
            if (img.complete) {
                pending--;
                if (pending === 0) start();
            } else {
                img.addEventListener(
                    'load',
                    () => {
                        pending--;
                        if (pending === 0) start();
                    },
                    { once: true }
                );
                img.addEventListener(
                    'error',
                    () => {
                        pending--;
                        if (pending === 0) start();
                    },
                    { once: true }
                );
            }
        });
    }

    let resizeT = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeT);
        resizeT = setTimeout(start, 150);
    });

    INSTANCES.set(root, state);
}

function destroyOne(root) {
    const state = INSTANCES.get(root);
    if (!state) return;

    // Cancel RAF loop
    cancelAnimationFrame(state.rafId);

    // Disconnect visibility observer
    if (state.visibilityObserver) {
        state.visibilityObserver.disconnect();
        state.visibilityObserver = null;
    }

    // Clear pause manager
    if (state.pause) {
        state.pause.clear();
    }

    // Reset transform
    state.content.style.transform = '';

    // Remove debug overlay
    removeDebugOverlay(state);

    // Remove from instances
    INSTANCES.delete(root);
}

/* ======================================================
 * LIFECYCLE
 * ====================================================== */

function initMarquees(context = document) {
    context.querySelectorAll(SELECTORS.root).forEach(initOne);
}

function destroyMarquees(context = document) {
    context.querySelectorAll(SELECTORS.root).forEach(destroyOne);
}

document.addEventListener('DOMContentLoaded', () => {
    initMarquees();
});

document.addEventListener('shopify:section:load', e => {
    initMarquees(e.target);
});

document.addEventListener('shopify:section:unload', e => {
    destroyMarquees(e.target);
});

/* ======================================================
 * DEV API
 * ====================================================== */

window.MDSC = window.MDSC || {};
window.MDSC.marquee = {
    init: initMarquees,
    destroy: destroyMarquees,
};

/* ======================================================
 * ES MODULE EXPORTS
 * ====================================================== */

export {
    initMarquees,
    destroyMarquees,
};
