/**
 * @file src/scripts/products/product-cart-controller.js
 * @description Handles add to cart interactions (Shopify-native).
 * @see THEME_ARCHITECTURE.md
 */

window.B2B = window.B2B || {};
window.B2B.Controllers = window.B2B.Controllers || {};

window.B2B.Controllers.Cart = {
  init(root) {
    const state = root.productState;
    if (!state) return;

    if (window.__ENGINE_DEBUG__) {
      console.log('[B2B][CartController] init', root);
    }

    const btn = root.querySelector("[data-add-to-cart]");
    if (!btn) return;

    // Remove existing listener if any (idempotency)
    if (btn._addToCartHandler) {
      btn.removeEventListener("click", btn._addToCartHandler);
    }

    btn._addToCartHandler = () => {
      // Disable button
      const originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Adding...";

      const currentState = state.getState();

      fetch("/cart/add.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: currentState.variantId,
          quantity: currentState.quantity
        })
      }).then(res => {
          if (res.ok) {
              root.dispatchEvent(new CustomEvent("cart:add"));
              // Optional: Open cart drawer or show success message
          } else {
              console.error("Failed to add to cart");
          }
      }).finally(() => {
          btn.disabled = false;
          btn.textContent = originalText;
      });
    };

    btn.addEventListener("click", btn._addToCartHandler);
  },

  destroy(root) {
    if (window.__ENGINE_DEBUG__) {
      console.log('[B2B][CartController] destroy', root);
    }
    const btn = root.querySelector("[data-add-to-cart]");
    if (btn && btn._addToCartHandler) {
      btn.removeEventListener("click", btn._addToCartHandler);
      delete btn._addToCartHandler;
    }
  }
};
