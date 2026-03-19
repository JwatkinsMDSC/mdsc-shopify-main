/**
 * @file src/scripts/products/product-image-controller.js
 * @description Handles image updates on variant change (Shopify-native).
 * @see THEME_ARCHITECTURE.md
 */

window.B2B = window.B2B || {};
window.B2B.Controllers = window.B2B.Controllers || {};

window.B2B.Controllers.Image = {
  init(root) {
    const state = root.productState;
    if (!state) return;

    if (window.__ENGINE_DEBUG__) {
      console.log('[B2B][ImageController] init', root);
    }

    // Store unsubscribe function on root for cleanup
    if (root._imageUnsubscribe) root._imageUnsubscribe();

    root._imageUnsubscribe = state.subscribe(current => {
      const image = current.featuredImage;
      if (!image) return;

      root.querySelectorAll("[data-product-image]").forEach(img => {
        // Avoid reloading if same src
        if (img.src !== image.src) {
          img.src = image.src;
          img.alt = image.alt || "";
        }
      });
    });
  },

  destroy(root) {
    if (window.__ENGINE_DEBUG__) {
      console.log('[B2B][ImageController] destroy', root);
    }
    if (root._imageUnsubscribe) {
      root._imageUnsubscribe();
      delete root._imageUnsubscribe;
    }
  }
};
