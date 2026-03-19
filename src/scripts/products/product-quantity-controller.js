/**
 * @file src/scripts/products/product-quantity-controller.js
 * @description Handles quantity updates (Shopify-native).
 * @see THEME_ARCHITECTURE.md
 */

window.B2B = window.B2B || {};
window.B2B.Controllers = window.B2B.Controllers || {};

window.B2B.Controllers.Quantity = {
  init(root) {
    const state = root.productState;
    if (!state) return;

    if (window.__ENGINE_DEBUG__) {
      console.log('[B2B][QuantityController] init', root);
    }

    // Increase button
    root.querySelectorAll("[data-qty-increase]").forEach(btn => {
      btn.removeEventListener("click", btn._qtyIncreaseHandler);
      
      btn._qtyIncreaseHandler = () => {
        const currentQty = state.getState().quantity;
        state.setState({ quantity: currentQty + 1 });
        // Dispatch event for external integrations only
        root.dispatchEvent(new CustomEvent("quantity:change", {
            detail: { quantity: state.getState().quantity }
        }));
      };
      
      btn.addEventListener("click", btn._qtyIncreaseHandler);
    });

    // Decrease button
    root.querySelectorAll("[data-qty-decrease]").forEach(btn => {
      btn.removeEventListener("click", btn._qtyDecreaseHandler);
      
      btn._qtyDecreaseHandler = () => {
        const currentQty = state.getState().quantity;
        state.setState({ quantity: Math.max(1, currentQty - 1) });
        // Dispatch event for external integrations only
        root.dispatchEvent(new CustomEvent("quantity:change", {
            detail: { quantity: state.getState().quantity }
        }));
      };
      
      btn.addEventListener("click", btn._qtyDecreaseHandler);
    });
    
    // Input field
    root.querySelectorAll("[data-qty-input]").forEach(input => {
        // Task A.1: Initialize state from DOM if present
        const initialDomQty = parseInt(input.value);
        if (initialDomQty > 0 && initialDomQty !== state.getState().quantity) {
          if (window.__ENGINE_DEBUG__) {
            console.log('[B2B][QuantityController] Syncing state from DOM:', initialDomQty);
          }
          state.setState({ quantity: initialDomQty });
        }

        input.removeEventListener("change", input._qtyChangeHandler);
        
        input._qtyChangeHandler = () => {
            const qty = parseInt(input.value);
            if (qty > 0) {
                state.setState({ quantity: qty });
                // Dispatch event for external integrations only
                root.dispatchEvent(new CustomEvent("quantity:change", {
                    detail: { quantity: state.getState().quantity }
                }));
            }
        };
        
        input.addEventListener("change", input._qtyChangeHandler);
        
        // Subscribe to state changes to update input
        // We need to store the unsubscribe function to clean up later
        if (input._unsubscribe) input._unsubscribe();
        
        input._unsubscribe = state.subscribe(currentState => {
            if (input.value != currentState.quantity) {
                input.value = currentState.quantity;
            }
        });
    });
  },

  destroy(root) {
    if (window.__ENGINE_DEBUG__) {
      console.log('[B2B][QuantityController] destroy', root);
    }
    root.querySelectorAll("[data-qty-increase]").forEach(btn => {
      if (btn._qtyIncreaseHandler) {
        btn.removeEventListener("click", btn._qtyIncreaseHandler);
        delete btn._qtyIncreaseHandler;
      }
    });

    root.querySelectorAll("[data-qty-decrease]").forEach(btn => {
      if (btn._qtyDecreaseHandler) {
        btn.removeEventListener("click", btn._qtyDecreaseHandler);
        delete btn._qtyDecreaseHandler;
      }
    });

    root.querySelectorAll("[data-qty-input]").forEach(input => {
      if (input._qtyChangeHandler) {
        input.removeEventListener("change", input._qtyChangeHandler);
        delete input._qtyChangeHandler;
      }
      if (input._unsubscribe) {
        input._unsubscribe();
        delete input._unsubscribe;
      }
    });
  }
};
