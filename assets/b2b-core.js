/**
 * B2B Core - Bootstrap & Utilities
 * Centralizes initialization and shared utilities for the B2B theme.
 */

window.B2B = window.B2B || {};

/**
 * Initialize all B2B components within a root element
 * @param {HTMLElement} root - The root element to initialize components within (default: document)
 */
window.B2B.init = function(root = document) {
  // Initialize Tooltips
  if (window.B2B.Tooltips) {
    window.B2B.Tooltips.init(root);
  }

  // Initialize Drag Scroll
  if (window.B2B.DragScroll) {
    window.B2B.DragScroll.init(root);
  }

  // Initialize Quantity Controls
  if (window.B2B.Quantity) {
    window.B2B.Quantity.init(root);
  }

  // Initialize Currency Menu
  if (window.B2B.CurrencyMenu) {
    window.B2B.CurrencyMenu.init(root);
  }

  // Initialize Filters
  if (window.B2B.Filters) {
    window.B2B.Filters.init(root);
  }

  // Initialize Swipers (if available)
  if (window.B2B.Swipers) {
    window.B2B.Swipers.init(root);
  }
  
  // Initialize other components as they are added...
};

/**
 * Format money for display
 * @param {number} cents - Amount in cents
 * @returns {string} Formatted price (e.g. $10.00)
 */
window.B2B.formatMoney = function(cents) {
  const dollars = cents / 100;
  return `$${dollars.toFixed(2)}`;
};

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  window.B2B.init();
});

// Handle Shopify Theme Editor events
document.addEventListener('shopify:section:load', (event) => {
  window.B2B.init(event.target);
});
