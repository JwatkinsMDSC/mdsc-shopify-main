/* ======================================================
 * ANIMATE PRESENCE
 * ======================================================
 * Unified enter/leave animation engine for UI surfaces
 * (modals, drawers, dropdowns, backdrops, etc.)
 * 
 * STATE CONTRACT:
 * - [data-open]   → element is visible/open
 * - [data-closed] → element is hidden/closed (target state for transitions)
 * - [data-enter]  → entering transition in progress
 * - [data-leave]  → leaving transition in progress
 * 
 * VISIBILITY CONTRACT:
 * - Controller owns `hidden` attribute
 * - Authors do NOT add `hidden` in markup
 * - animateIn removes `hidden` before transition
 * - animateOut adds `hidden` after transition
 * 
 * STRICT RULES:
 * - JS controls STATE ONLY (attributes)
 * - CSS controls MOTION ONLY (transforms, transitions, timing)
 * - NO class-based state (no .is-open)
 * - ALL timing comes from CSS variables
 * ====================================================== */

const FALLBACK_TIMEOUT = 350;

/**
 * Animate element entrance
 * 
 * Lifecycle:
 * 1. Remove hidden attribute
 * 2. Apply closed state immediately
 * 3. Wait one frame (allow CSS to apply)
 * 4. Apply enter marker + open state
 * 5. Listen for transitionend to remove enter marker
 * 
 * @param {HTMLElement} el - Element to animate
 * @returns {Promise} - Resolves when animation completes
 */
export function animateIn(el) {
    return new Promise((resolve) => {
        let resolved = false;
        let timeoutId;
        
        const cleanup = () => {
            if (resolved) return;
            resolved = true;
            clearTimeout(timeoutId);
            el.removeAttribute('data-enter');
            el.removeEventListener('transitionend', cleanup);
            el.removeEventListener('transitioncancel', cleanup);
            resolve();
        };
        
        el.hidden = false;
        el.removeAttribute('data-open');
        el.setAttribute('data-closed', '');
        
        requestAnimationFrame(() => {
            el.setAttribute('data-enter', '');
            el.removeAttribute('data-closed');
            el.setAttribute('data-open', '');
            
            el.addEventListener('transitionend', cleanup, { once: true });
            el.addEventListener('transitioncancel', cleanup, { once: true });
            
            timeoutId = setTimeout(cleanup, FALLBACK_TIMEOUT);
        });
    });
}

/**
 * Animate element exit
 * 
 * Lifecycle:
 * 1. Remove open state
 * 2. Apply closed state (target for transition)
 * 3. Apply leave marker (enables transition)
 * 4. Listen for transitionend
 * 5. Add hidden attribute after animation
 * 
 * @param {HTMLElement} el - Element to animate
 * @returns {Promise} - Resolves when animation completes
 */
export function animateOut(el) {
    return new Promise((resolve) => {
        let resolved = false;
        let timeoutId;
        
        const cleanup = () => {
            if (resolved) return;
            resolved = true;
            clearTimeout(timeoutId);
            el.removeAttribute('data-leave');
            el.hidden = true;
            el.removeEventListener('transitionend', cleanup);
            el.removeEventListener('transitioncancel', cleanup);
            resolve();
        };
        
        el.removeAttribute('data-open');
        el.setAttribute('data-closed', '');
        el.setAttribute('data-leave', '');
        
        el.addEventListener('transitionend', cleanup, { once: true });
        el.addEventListener('transitioncancel', cleanup, { once: true });
        
        timeoutId = setTimeout(cleanup, FALLBACK_TIMEOUT);
    });
}

/**
 * Cancel any ongoing animation and reset element to closed state
 * 
 * @param {HTMLElement} el - Element to reset
 */
export function cancelAnimation(el) {
    el.removeAttribute('data-enter');
    el.removeAttribute('data-leave');
    el.removeAttribute('data-open');
    el.removeAttribute('data-closed');
    el.style.removeProperty('--ui-closed-transform');
}
