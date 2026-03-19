/**
 * @file src/scripts/products/product-variant-controller.js
 * @description Handles variant selection updates (Shopify-native).
 * @see THEME_ARCHITECTURE.md
 */

window.B2B = window.B2B || {};
window.B2B.Controllers = window.B2B.Controllers || {};

window.B2B.Controllers.Variant = {
  init(root) {
    const state = root.productState;
    if (!state) return;

    if (window.__ENGINE_DEBUG__) {
      console.log('[B2B][VariantController] init', root);
    }

    // Helper to update state from variant
    const updateStateFromVariant = (variant) => {
      if (window.__ENGINE_DEBUG__) {
        console.log('[B2B][VariantController] state updated', variant);
      }
      state.setState({
        variantId: variant.id,
        basePrice: variant.price,
        compareAtPrice: variant.compare_at_price,
        inventoryQuantity: variant.inventory_quantity,
        available: variant.available,
        featuredImage: variant.featured_image
      });

      // Dispatch event for external integrations only
      root.dispatchEvent(new CustomEvent("variant:change", {
        detail: variant
      }));
    };

    // Handle button/swatch pickers
    const pickers = root.querySelectorAll("[data-variant-picker]");
    pickers.forEach(el => {
      // Remove existing listener if any (idempotency)
      el.removeEventListener("click", el._variantClickHandler);
      
      el._variantClickHandler = (e) => {
        e.preventDefault();
        const variantId = Number(el.dataset.variantId);
        const variants = state.getState().variants;
        const variant = variants.find(v => v.id === variantId);
        
        if (!variant) return;
        updateStateFromVariant(variant);
      };

      el.addEventListener("click", el._variantClickHandler);
    });
    
    // Handle select pickers
    const selects = root.querySelectorAll("select[data-variant-select]");
    selects.forEach(select => {
      select.removeEventListener("change", select._variantChangeHandler);

      select._variantChangeHandler = () => {
          const variantId = Number(select.value);
          const variants = state.getState().variants;
          const variant = variants.find(v => v.id === variantId);
          
          if (!variant) return;
          updateStateFromVariant(variant);
      };

      select.addEventListener("change", select._variantChangeHandler);
    });
  },

  destroy(root) {
    if (window.__ENGINE_DEBUG__) {
      console.log('[B2B][VariantController] destroy', root);
    }
    // Cleanup listeners
    root.querySelectorAll("[data-variant-picker]").forEach(el => {
      if (el._variantClickHandler) {
        el.removeEventListener("click", el._variantClickHandler);
        delete el._variantClickHandler;
      }
    });

    root.querySelectorAll("select[data-variant-select]").forEach(el => {
      if (el._variantChangeHandler) {
        el.removeEventListener("change", el._variantChangeHandler);
        delete el._variantChangeHandler;
      }
    });
  }
};
