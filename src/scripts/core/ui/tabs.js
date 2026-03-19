/**
 * Tabs Controller
 *
 * Purpose:
 * Provide accessible, declarative tab functionality
 * for content grouping within a page or section.
 *
 * Tabs allow users to switch between related panels
 * of content without page reloads.
 *
 * This implementation follows WCAG Authoring Practices
 * for Tabs and is safe for Shopify / Dawn lifecycle events.
 *
 * Key characteristics:
 * - Fully declarative HTML API
 * - Multiple independent tab groups per page
 * - Keyboard accessible (Arrow keys, Home/End, Enter/Space)
 * - Section-safe (Shopify section reload compatible)
 * - No global shared state between tab groups
 *
 * Usage:
 *   Import once in global.js:
 *
 *     import './core/ui/tabs';
 *
 *   Author HTML using:
 *     - data-tabs
 *     - data-tabs-list
 *     - data-tab
 *     - data-tab-panel
 */

/* ======================================================
 * SELECTORS
 * ====================================================== */

/**
 * Centralized selectors used by the Tabs controller.
 * These mirror the declarative HTML contract.
 */
const SELECTORS = {
    root: '[data-tabs]',           // Root container for a tab group
    list: '[data-tabs-list]',      // Tablist element
    tab: '[data-tab]',             // Individual tab buttons
    panel: '[data-tab-panel]',     // Tab panels
};

/* ======================================================
 * HELPERS
 * ====================================================== */

/**
 * Activate a specific tab within a tab group.
 *
 * Responsibilities:
 * - Update aria-selected state
 * - Manage tabindex for roving focus
 * - Show the associated panel
 * - Hide all other panels
 * - Move focus to the activated tab
 *
 * @param {HTMLElement} group - The tabs root element
 * @param {HTMLElement} activeTab - The tab to activate
 */
function activateTab(group, activeTab, { focus = true } = {}) {
    const tabs = Array.from(group.querySelectorAll(SELECTORS.tab));
    const panels = Array.from(group.querySelectorAll(SELECTORS.panel));
    const targetId = activeTab.getAttribute('aria-controls');

    tabs.forEach(tab => {
        const isSelected = tab === activeTab;
        tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        tab.setAttribute('tabindex', isSelected ? '0' : '-1');
    });

    panels.forEach(panel => {
        panel.hidden = panel.id !== targetId;
    });

    if (focus) {
        activeTab.focus();
    }
}

/**
 * Handle keyboard navigation within a tablist.
 *
 * Supported keys:
 * - ArrowRight / ArrowDown → next tab
 * - ArrowLeft / ArrowUp → previous tab
 * - Home → first tab
 * - End → last tab
 * - Enter / Space → activate focused tab
 *
 * @param {KeyboardEvent} e
 * @param {HTMLElement} group - The tabs root element
 * @param {HTMLElement} currentTab - The currently focused tab
 */
function handleKeydown(e, group, currentTab) {
    const tabs = Array.from(group.querySelectorAll(SELECTORS.tab));
    const currentIndex = tabs.indexOf(currentTab);

    let nextIndex = null;

    switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
            nextIndex = (currentIndex + 1) % tabs.length;
            break;

        case 'ArrowLeft':
        case 'ArrowUp':
            nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
            break;

        case 'Home':
            nextIndex = 0;
            break;

        case 'End':
            nextIndex = tabs.length - 1;
            break;

        case 'Enter':
        case ' ':
            e.preventDefault();
            activateTab(group, currentTab);
            return;

        default:
            return;
    }

    e.preventDefault();
    tabs[nextIndex].focus();
}

/* ======================================================
 * INITIALIZATION
 * ====================================================== */

/**
 * Initialize all tab groups within a given context.
 *
 * This function is:
 * - Idempotent (safe to run multiple times)
 * - Section-aware (works with Shopify section reloads)
 *
 * @param {Document|HTMLElement} context
 */
function initTabs(context = document) {
    const tabGroups = context.querySelectorAll(SELECTORS.root);

    tabGroups.forEach(group => {
        if (group.__tabsBound) return;
        group.__tabsBound = true;

        const tabList = group.querySelector(SELECTORS.list);
        const hoverEnabled = tabList?.hasAttribute('data-tabs-hover');

        if (tabList) {
            tabList.setAttribute('role', 'tablist');
        }

        const tabs = Array.from(group.querySelectorAll(SELECTORS.tab));
        const panels = Array.from(group.querySelectorAll(SELECTORS.panel));

        if (!tabs.length || !panels.length) return;

        tabs.forEach((tab, index) => {
            const panelId = tab.getAttribute('aria-controls');
            const panel = panels.find(p => p.id === panelId);
            if (!panel) return;

            const isActive = index === 0;

            tab.setAttribute('role', 'tab');
            tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
            tab.setAttribute('tabindex', isActive ? '0' : '-1');

            panel.setAttribute('role', 'tabpanel');
            panel.hidden = !isActive;

            // Click activation (focus allowed)
            tab.addEventListener('click', () => {
                activateTab(group, tab);
            });

            // Hover activation (no focus)
            if (hoverEnabled) {
                tab.addEventListener('mouseenter', () => {
                    if (tab.getAttribute('aria-selected') !== 'true') {
                        activateTab(group, tab, { focus: false });
                    }
                });
            }

            // Keyboard navigation
            tab.addEventListener('keydown', (e) => {
                handleKeydown(e, group, tab);
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
    initTabs();
});

/**
 * Shopify section reload support
 */
document.addEventListener('shopify:section:load', (e) => {
    initTabs(e.target);
});
