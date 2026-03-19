/**
 * @file src/scripts/products/product-state.js
 * @description Canonical ProductState engine (Shopify-native).
 * @see THEME_ARCHITECTURE.md
 */

window.B2B = window.B2B || {};

// Internal registry for debug toggling
const stateRegistry = new WeakMap();

window.B2B.ProductState = class ProductState {
  constructor(initialState) {
    this.state = initialState;
    this.listeners = [];
  }

  subscribe(fn) {
    this.listeners.push(fn);
    // Immediately call with current state
    fn(this.getState());
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  setState(partial) {
    this.state = { ...this.state, ...partial };
    this.notify();
  }

  getState() {
    return { ...this.state };
  }

  notify() {
    const currentState = this.getState();
    this.listeners.forEach(fn => fn(currentState));
  }
};

window.B2B.initProductState = function(root) {
  if (!root) return null;
  
  // Check if already initialized (Singleton Pattern)
  if (stateRegistry.has(root)) {
    const existingState = stateRegistry.get(root);
    // Ensure root property is synced (in case it was deleted)
    if (!root.productState) {
      root.productState = existingState;
    }
    return existingState;
  }

  // Legacy check fallback
  if (root.productState) return root.productState;

  const jsonEl = root.querySelector("[data-product-json]");
  if (!jsonEl) {
    console.warn('No [data-product-json] found in root', root);
    return null;
  }

  try {
    const product = JSON.parse(jsonEl.textContent);
    const initialVariant = product.variants.find(v => v.available) || product.variants[0];

    if (!initialVariant) {
      console.warn('No variants found for product', product.id);
      return null;
    }

    const state = new window.B2B.ProductState({
      productId: product.id,
      variantId: initialVariant.id,
      quantity: 1,
      basePrice: initialVariant.price,
      compareAtPrice: initialVariant.compare_at_price,
      upgrades: [],
      inventoryQuantity: initialVariant.inventory_quantity,
      available: initialVariant.available,
      featuredImage: initialVariant.featured_image,
      variants: product.variants,
      b2b: {
        enabled: true,
        eligible: false,
        pricing: null
      }
    });

    stateRegistry.set(root, state);

    // Always attach state to root immediately so controllers can find it
    // This fixes the initialization order race condition
    root.productState = state;

    return state;
  } catch (e) {
    console.error('Failed to initialize ProductState', e);
    return null;
  }
};

// Debug helpers
window.B2B.revealDebugState = () => {
  // No-op: state is now always exposed for controller access
  // This function is kept for API compatibility with global.js
};

window.B2B.hideDebugState = () => {
  // No-op: state must remain exposed for controllers
};
