/* ======================================================
 * OUTSIDE DISMISS UTILITY
 * ======================================================
 * Centralized outside-interaction dismissal for:
 * - Modals
 * - Drawers
 * - Dropdowns
 * - Popovers
 * - Any future overlay UI
 * 
 * Event Model:
 * - Uses `pointerdown` in capture phase (2025 standard)
 * - Uses `composedPath()` for layout-safe detection
 * - Works with mouse, touch, and pen input
 * - Fires before focus changes and click synthesis
 * 
 * Responsibilities:
 * - Track active UI entries (panel + trigger)
 * - Detect pointerdown outside via composedPath()
 * - Close only the topmost active entry
 * - Work independently of animation system
 * - Respect active gestures and opt-outs
 * ====================================================== */

const registry = new Map();
let listenerActive = false;

const DEBUG = true;

/**
 * Register a UI entry for outside-dismiss handling
 * 
 * @param {string} id - Unique identifier for this entry
 * @param {Object} entry - Entry object containing:
 *   - panel: HTMLElement (required)
 *   - trigger: HTMLElement | null (optional)
 *   - onDismiss: Function (required) - called when dismissed
 *   - isDragging: Function | null (optional) - returns true if gesture active
 * @returns {Function} - Cleanup function to unregister
 */
export function registerOutsideDismiss(id, entry) {
    if (!entry.panel || !entry.onDismiss) {
        throw new Error('registerOutsideDismiss requires panel and onDismiss');
    }

    registry.set(id, entry);
    ensureListener();

    if (DEBUG) {
        console.log('[OUTSIDE-DISMISS] Registered:', {
            id,
            panelId: entry.panel.id,
            triggerId: entry.trigger?.id,
            registrySize: registry.size
        });
    }

    return () => {
        if (DEBUG) console.log('[OUTSIDE-DISMISS] Unregistering:', id);
        registry.delete(id);
        if (registry.size === 0) {
            removeListener();
        }
    };
}

/**
 * Unregister a UI entry from outside-dismiss handling
 * 
 * @param {string} id - Unique identifier for this entry
 */
export function unregisterOutsideDismiss(id) {
    registry.delete(id);
    if (registry.size === 0) {
        removeListener();
    }
}

/**
 * Handle outside pointerdown event
 * 
 * Logic:
 * 1. Check if there are any active entries
 * 2. For the most recent entry (topmost):
 *    - Skip if clicking inside panel (via composedPath)
 *    - Skip if clicking trigger (via composedPath)
 *    - Skip if gesture is active
 *    - Skip if panel opts out via data-ui-no-outside-dismiss
 *    - Otherwise, call onDismiss
 * 
 * Uses composedPath() for layout-safe detection that works with:
 * - Complex nested DOM structures
 * - SVG elements
 * - Shadow DOM
 * - Absolute/fixed positioning
 */
function handleOutsidePointerDown(e) {
    if (DEBUG) {
        console.log('[OUTSIDE-DISMISS] Pointerdown:', {
            target: e.target.tagName,
            targetId: e.target.id,
            registrySize: registry.size
        });
    }

    if (registry.size === 0) {
        if (DEBUG) console.log('[OUTSIDE-DISMISS] No entries registered');
        return;
    }

    const entries = Array.from(registry.values());
    const topEntry = entries[entries.length - 1];

    if (!topEntry) {
        if (DEBUG) console.log('[OUTSIDE-DISMISS] No top entry');
        return;
    }

    const { panel, trigger, onDismiss, isDragging } = topEntry;

    const path = e.composedPath();

    if (DEBUG) {
        console.log('[OUTSIDE-DISMISS] Checking dismissal:', {
            panelId: panel.id,
            triggerId: trigger?.id,
            clickedInPanel: path.includes(panel),
            clickedInTrigger: trigger && path.includes(trigger),
            isDragging: isDragging ? isDragging() : false,
            hasOptOut: panel.hasAttribute('data-ui-no-outside-dismiss')
        });
    }

    if (path.includes(panel)) {
        if (DEBUG) console.log('[OUTSIDE-DISMISS] SKIP - inside panel');
        return;
    }

    if (trigger && path.includes(trigger)) {
        if (DEBUG) console.log('[OUTSIDE-DISMISS] SKIP - inside trigger');
        return;
    }

    if (isDragging && isDragging()) {
        if (DEBUG) console.log('[OUTSIDE-DISMISS] SKIP - dragging');
        return;
    }

    if (panel.hasAttribute('data-ui-no-outside-dismiss')) {
        if (DEBUG) console.log('[OUTSIDE-DISMISS] SKIP - opt-out');
        return;
    }

    if (DEBUG) console.log('[OUTSIDE-DISMISS] ✅ DISMISSING');
    onDismiss();
}

/**
 * Ensure document listener is active
 */
function ensureListener() {
    if (!listenerActive) {
        document.addEventListener('pointerdown', handleOutsidePointerDown, true);
        listenerActive = true;
    }
}

/**
 * Remove document listener
 */
function removeListener() {
    if (listenerActive) {
        document.removeEventListener('pointerdown', handleOutsidePointerDown, true);
        listenerActive = false;
    }
}

/**
 * Check if entry is registered
 * 
 * @param {string} id - Unique identifier
 * @returns {boolean}
 */
export function isRegistered(id) {
    return registry.has(id);
}

/**
 * Get count of registered entries (for debugging)
 * 
 * @returns {number}
 */
export function getRegistrySize() {
    return registry.size;
}
