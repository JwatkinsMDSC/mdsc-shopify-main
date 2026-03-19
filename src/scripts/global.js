import '../styles/tailwind.css';

import { ComponentRegistry } from './core/component-registry.js';
import { SectionRegistry } from './core/section-registry.js';
import { initTaillourCompat } from './compat/taillour-compat.js';

// Core UI components
import './core/ui/dropdowns';
import './core/ui/modals-drawers.js';
import './core/ui/scroll-lock.js';
import './core/ui/focus-trap.js';
import './core/ui/tabs.js';
import './core/ui/accordions.js';
import './core/ui/toasts.js';
import './core/ui/floating.js';
import './core/ui/form-helpers.js';
import './core/ui/slider.js';
import './core/ui/media-gallery.js';
import './core/ui/marquee.js';
import './core/ui/mobile-menu.js';

import './components/mds-header-menu.js';
import './components/mds-cart-drawer.js';
import './components/mds-bottom-filter-shelf.js';
import './components/mds-collection-filters.js';
import './components/mds-campaign-banner.js';
//import './components/mds-platform-slider.js';

// Product Engine (Shopify-native)
import './products/product-state.js';
import './products/product-pricing-controller.js';
import './products/product-image-controller.js';
import './products/product-variant-controller.js';
import './products/product-quantity-controller.js';
import './products/product-inventory-controller.js';
import './products/product-cart-controller.js';
import './products/product-ui-init.js';

// Expose for manual testing (dev only)
window.toast = toast;

// Task 4.0.5: Dev-only engine diagnostics
// Task 4.X: Persistent debug flag
window.__ENGINE_DEBUG__ = localStorage.getItem('__PRODUCT_ENGINE_DEBUG__') === 'true';

if (window.__ENGINE_DEBUG__) {
  console.log(
    '%c 🔧 PRODUCT ENGINE DEBUG ENABLED ',
    'background:#ff9800;color:#000;font-weight:bold;padding:4px;border-radius:2px;'
  );
}

window.enableProductEngineDebug = () => {
  localStorage.setItem('__PRODUCT_ENGINE_DEBUG__', 'true');
  window.__ENGINE_DEBUG__ = true;
  if (window.B2B && window.B2B.revealDebugState) {
    window.B2B.revealDebugState();
  }
  console.log(
    '%c 🔧 PRODUCT ENGINE DEBUG ENABLED ',
    'background:#ff9800;color:#000;font-weight:bold;padding:4px;border-radius:2px;'
  );
  console.log('ℹ️ Reload the page to see full initialization logs.');
};

window.disableProductEngineDebug = () => {
  localStorage.removeItem('__PRODUCT_ENGINE_DEBUG__');
  window.__ENGINE_DEBUG__ = false;
  if (window.B2B && window.B2B.hideDebugState) {
    window.B2B.hideDebugState();
  }
  console.log(
    '%c 🛑 PRODUCT ENGINE DEBUG DISABLED ',
    'background:#ddd;color:#000;font-weight:bold;padding:4px;border-radius:2px;'
  );
};

class MDSTheme {
  constructor() {
    this.componentRegistry = new ComponentRegistry();
    this.sectionRegistry = new SectionRegistry();
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;

    console.log('🚢 Marine Detail Supply Theme - Initializing...');

    initTaillourCompat();
    this.registerComponents();
    this.registerSections();
    this.setupEventListeners();
    this.handleSectionRendering();

    this.initialized = true;
    console.log('✅ Marine Detail Supply Theme - Ready');
  }

  registerComponents() {
    console.log('📦 Registering Web Components...');
    console.log('✓ All components loaded');
  }

  registerSections() {
    console.log('📄 Registering Section Controllers...');
  }

  setupEventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
      this.componentRegistry.initAll();
      this.sectionRegistry.initAll();
    });

    document.addEventListener('shopify:section:load', (event) => {
      this.handleSectionLoad(event.detail);
    });

    document.addEventListener('shopify:section:unload', (event) => {
      this.handleSectionUnload(event.detail);
    });

    document.addEventListener('shopify:section:reorder', (event) => {
      this.handleSectionReorder(event.detail);
    });

    document.addEventListener('shopify:block:select', (event) => {
      this.handleBlockSelect(event.detail);
    });

    document.addEventListener('shopify:block:deselect', (event) => {
      this.handleBlockDeselect(event.detail);
    });
  }

  handleSectionRendering() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && node.hasAttribute('data-section-id')) {
            this.sectionRegistry.init(node);
            this.componentRegistry.initInContext(node);
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  handleSectionLoad(detail) {
    console.log('Section loaded:', detail.sectionId);
    const section = document.querySelector(`[data-section-id="${detail.sectionId}"]`);
    if (section) {
      this.sectionRegistry.init(section);
      this.componentRegistry.initInContext(section);
    }
  }

  handleSectionUnload(detail) {
    console.log('Section unloaded:', detail.sectionId);
    this.sectionRegistry.destroy(detail.sectionId);
  }

  handleSectionReorder(detail) {
    console.log('Section reordered:', detail.sectionId);
  }

  handleBlockSelect(detail) {
    console.log('Block selected:', detail.blockId);
  }

  handleBlockDeselect(detail) {
    console.log('Block deselected:', detail.blockId);
  }
}

const theme = new MDSTheme();
theme.init();

export default theme;
