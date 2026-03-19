/**
 * @file src/scripts/products/product-ui-init.js
 * @description Entry point for Product UI initialization (Shopify-native).
 * @see THEME_ARCHITECTURE.md
 */

window.B2B = window.B2B || {};

window.B2B.initProductUI = function(root) {
  if (!root) return;

  // Task 4.0.1: Explicit opt-out
  if (root.getAttribute('data-product-engine') === 'off') return;

  // Task 4.0.1: Validate contract
  const jsonEl = root.querySelector("[data-product-json]");
  if (!jsonEl) {
    console.warn('[B2B] Skipped init: Missing [data-product-json]', root);
    return;
  }

  // Task 4.0.5: Dev diagnostics
  if (window.__ENGINE_DEBUG__) {
    const id = root.dataset.productId || 'unknown';
    const ctx = root.dataset.context || (root.hasAttribute('data-product-main') ? 'main' : 'card');
    console.log(`[B2B] Init ${id} (${ctx})`, root);
  }

  // Initialize State
  const state = window.B2B.initProductState(root);
  if (!state) {
    if (window.__ENGINE_DEBUG__) {
      throw new Error('[B2B] ProductState failed to initialize');
    }
    return;
  }

  // Initialize Controllers
  if (window.B2B.Controllers) {
    Object.values(window.B2B.Controllers).forEach(controller => {
      if (controller && typeof controller.init === 'function') {
        // Task 4.0.8: Hard assertion in dev mode
        if (window.__ENGINE_DEBUG__ && !root.productState) {
          throw new Error('[B2B] Controller initialized before ProductState');
        }
        controller.init(root);
      }
    });
  }
};

window.B2B.destroyProductUI = function(root) {
  if (!root) return;

  // Task 4.0.5: Dev diagnostics
  if (window.__ENGINE_DEBUG__) {
    const id = root.dataset.productId || 'unknown';
    console.log(`[B2B] Destroy ${id}`, root);
  }

  // Destroy Controllers
  if (window.B2B.Controllers) {
    Object.values(window.B2B.Controllers).forEach(controller => {
      if (controller && typeof controller.destroy === 'function') {
        controller.destroy(root);
      }
    });
  }
  
  // Clear state reference
  delete root.productState;
};

// Auto-init on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-product-card], [data-product-main]").forEach(root => {
    window.B2B.initProductUI(root);
  });
});

// Shopify Theme Editor Support
document.addEventListener("shopify:section:load", (e) => {
  const roots = e.target.querySelectorAll("[data-product-card], [data-product-main]");
  roots.forEach(root => {
    window.B2B.initProductUI(root);
  });
});

document.addEventListener("shopify:section:unload", (e) => {
  const roots = e.target.querySelectorAll("[data-product-card], [data-product-main]");
  roots.forEach(root => {
    window.B2B.destroyProductUI(root);
  });
});
