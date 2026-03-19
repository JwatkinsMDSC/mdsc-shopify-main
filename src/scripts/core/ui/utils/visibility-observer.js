/**
 * Visibility Observer Utility
 *
 * Purpose:
 * Provide a lightweight, reusable wrapper around
 * the native IntersectionObserver API for detecting
 * when an element enters or exits the viewport.
 *
 * This utility is intentionally generic and does NOT:
 * - Make assumptions about UI behavior
 * - Control animation state directly
 * - Modify the DOM
 *
 * Instead, it acts as a signal provider that higher-level
 * UI controllers (marquee, slider, media-gallery, etc.)
 * can use to pause, resume, or defer work.
 *
 * Key characteristics:
 * - Framework-agnostic
 * - Zero shared global state
 * - One observer per usage context
 * - Explicit lifecycle ownership (caller must disconnect)
 * - Safe for Shopify / Dawn section reloads
 *
 * Typical usage:
 *
 *   import { createVisibilityObserver } from './utils/visibility-observer';
 *
 *   const observer = createVisibilityObserver({
 *     onEnter: () => { ... },
 *     onExit: () => { ... },
 *   });
 *
 *   observer.observe(element);
 */

/* ======================================================
 * DEFAULTS
 * ====================================================== */

/**
 * Default observer configuration.
 *
 * These defaults are intentionally conservative:
 * - rootMargin includes a buffer so work can resume
 *   slightly before the element is fully visible
 * - threshold 0 means "any intersection at all"
 */
const DEFAULTS = {
    root: null,
    rootMargin: '100px',
    threshold: 0,
};

/* ======================================================
 * CORE FACTORY
 * ====================================================== */

/**
 * Create a new visibility observer.
 *
 * Responsibilities:
 * - Instantiate a native IntersectionObserver
 * - Normalize enter / exit callbacks
 * - Delegate all behavior decisions to the caller
 *
 * IMPORTANT:
 * - This function does NOT call observe()
 * - The caller is responsible for:
 *   - Calling observer.observe(element)
 *   - Calling observer.disconnect() during cleanup
 *
 * @param {Object} options
 * @param {Element|null} options.root
 *   Optional root element for intersection checks.
 *   Defaults to the browser viewport.
 *
 * @param {string} options.rootMargin
 *   Margin around the root. Useful for pre-emptive
 *   resume of animations before content is visible.
 *
 * @param {number|number[]} options.threshold
 *   Intersection ratio(s) at which callbacks fire.
 *
 * @param {Function} options.onEnter
 *   Called when the element becomes intersecting.
 *   Receives the IntersectionObserverEntry.
 *
 * @param {Function} options.onExit
 *   Called when the element stops intersecting.
 *   Receives the IntersectionObserverEntry.
 *
 * @returns {IntersectionObserver}
 */
function createVisibilityObserver({
    root = DEFAULTS.root,
    rootMargin = DEFAULTS.rootMargin,
    threshold = DEFAULTS.threshold,
    onEnter,
    onExit,
} = {}) {
    /**
     * Native IntersectionObserver instance.
     *
     * We intentionally process only the first entry
     * because all current use cases observe one element
     * per observer instance.
     */
    const observer = new IntersectionObserver(
        (entries) => {
            const entry = entries[0];
            if (!entry) return;

            if (entry.isIntersecting) {
                if (typeof onEnter === 'function') {
                    onEnter(entry);
                }
            } else {
                if (typeof onExit === 'function') {
                    onExit(entry);
                }
            }
        },
        {
            root,
            rootMargin,
            threshold,
        }
    );

    return observer;
}

/* ======================================================
 * EXPORTS
 * ====================================================== */

export {
    createVisibilityObserver,
};
