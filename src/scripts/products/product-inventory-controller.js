/**
 * @file src/scripts/products/product-inventory-controller.js
 * @description Handles inventory messaging and availability (Shopify-native).
 * @see THEME_ARCHITECTURE.md
 */

window.B2B = window.B2B || {};
window.B2B.Controllers = window.B2B.Controllers || {};

window.B2B.Controllers.Inventory = {
  init(root) {
    const state = root.productState;
    if (!state) return;

    if (window.__ENGINE_DEBUG__) {
      console.log('[B2B][InventoryController] init', root);
    }

    // Store unsubscribe function on root for cleanup
    if (root._inventoryUnsubscribe) root._inventoryUnsubscribe();

    root._inventoryUnsubscribe = state.subscribe(current => {
      const inventoryQty = current.inventoryQuantity;
      const isAvailable = current.available !== undefined ? current.available : (inventoryQty > 0);

      root.querySelectorAll("[data-inventory-message]").forEach(el => {
        if (isAvailable) {
          el.textContent = "In Stock";
          el.classList.remove("out-of-stock");
          el.classList.add("in-stock");
        } else {
          el.textContent = "Out of Stock";
          el.classList.remove("in-stock");
          el.classList.add("out-of-stock");
        }
      });
      
      // Update add to cart button state
      const addToCartBtn = root.querySelector("[data-add-to-cart]");
      if (addToCartBtn) {
        if (isAvailable) {
          addToCartBtn.disabled = false;
          addToCartBtn.textContent = "Add to Cart";
        } else {
          addToCartBtn.disabled = true;
          addToCartBtn.textContent = "Out of Stock";
        }
      }
    });
  },

  destroy(root) {
    if (window.__ENGINE_DEBUG__) {
      console.log('[B2B][InventoryController] destroy', root);
    }
    if (root._inventoryUnsubscribe) {
      root._inventoryUnsubscribe();
      delete root._inventoryUnsubscribe;
    }
  }
};
