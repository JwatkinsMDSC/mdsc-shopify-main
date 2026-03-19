/**
 * Product Grid Filters JavaScript
 * Handles filter bar visibility and filter interactions
 */

window.ProductGridFilters = window.ProductGridFilters || {};

window.ProductGridFilters = {
  activeFilters: {},
  initialized: false,

  /**
   * Initialize filters component
   * @param {HTMLElement} root - The root element to initialize within
   */
  init: function(root = document) {
    if (this.initialized) {
      return;
    }
    
    // Check if we should enable filters based on product grid presence
    const productGrid = document.querySelector('[data-product-grid]');
    if (!productGrid) {
      return;
    }

    this.initializeFilterBar(productGrid);
    this.initializeFilterPopovers(root);
    this.populateFilters(root);
    
    this.initialized = true;
  },

  /**
   * Initialize filter bar reveal on scroll
   */
  initializeFilterBar: function(productGrid) {
    const filterBar = document.querySelector('[data-filters-bar]');
    if (!filterBar) {
      return;
    }
    
    const siteHeader = document.getElementById('siteHeader');
    if (!siteHeader) {
      return;
    }
    
    // Enable specific filters based on grid data attribute
    const enabledFilters = productGrid.dataset.filters ? productGrid.dataset.filters.split(',') : [];
    
    if (enabledFilters.length > 0) {
        const allFilterGroups = filterBar.querySelectorAll('[data-filter-group]');
        
        allFilterGroups.forEach(group => {
            const filterType = group.dataset.filterGroup;
            if (enabledFilters.includes(filterType)) {
                group.hidden = false;
            } else {
                group.hidden = true;
            }
        });
    } else {
        // If no specific filters defined, show all by default if data-filters is missing
        if (!productGrid.hasAttribute('data-filters')) {
             filterBar.querySelectorAll('[data-filter-group]').forEach(el => el.hidden = false);
        }
    }

    // Show the bar itself
    filterBar.hidden = false;
    
    // In theme editor, always show the filter bar
    if (window.Shopify && window.Shopify.designMode) {
      filterBar.classList.add('visible');
      return;
    }
    
    const updateFilterBarVisibility = () => {
      const headerHeight = siteHeader.offsetHeight || 0;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > headerHeight) {
        filterBar.classList.add('visible');
      } else {
        filterBar.classList.remove('visible');
      }
    };
    
    window.addEventListener('scroll', updateFilterBarVisibility, { passive: true });
    window.addEventListener('resize', updateFilterBarVisibility, { passive: true });
    
    updateFilterBarVisibility();
  },

  /**
   * Initialize filter popovers
   */
  initializeFilterPopovers: function(root) {
    const filterButtons = root.querySelectorAll('[data-popover-button]');
    
    filterButtons.forEach((button, index) => {
      const popover = button.closest('[data-popover]');
      if (!popover) {
        return;
      }
      
      const panel = popover.querySelector('[data-popover-panel]');
      if (!panel) {
        return;
      }
      
      const closeButtons = panel.querySelectorAll('.filter-close-btn');
      
      // Toggle popover on button click
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = popover.getAttribute('data-open') === 'true';
        
        // Close all other popovers
        document.querySelectorAll('[data-popover]').forEach(p => {
          if (p !== popover) {
            p.removeAttribute('data-open');
            const btn = p.querySelector('[data-popover-button]');
            if (btn) btn.removeAttribute('data-popover-button');
          }
        });
        
        // Toggle current popover
        if (isOpen) {
          popover.removeAttribute('data-open');
          button.removeAttribute('data-popover-button');
        } else {
          popover.setAttribute('data-open', 'true');
          button.setAttribute('data-popover-button', 'active');
        }
      });
      
      // Close popover on close button click
      closeButtons.forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
          popover.removeAttribute('data-open');
          button.removeAttribute('data-popover-button');
        });
      });
      
      // Close popover when clicking apply button
      const applyBtn = panel.querySelector('.filter-action-apply');
      if (applyBtn) {
        applyBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.applyFilters(popover);
          popover.removeAttribute('data-open');
          button.removeAttribute('data-popover-button');
        });
      }
      
      // Reset filters
      const resetBtn = panel.querySelector('.filter-action-reset');
      if (resetBtn) {
        resetBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.resetFilters(popover);
        });
      }
    });
    
    // Close popovers when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('[data-popover]')) {
        document.querySelectorAll('[data-popover]').forEach(popover => {
          popover.removeAttribute('data-open');
          const btn = popover.querySelector('[data-popover-button]');
          if (btn) btn.removeAttribute('data-popover-button');
        });
      }
    });
  },

  /**
   * Update filter badge count
   */
  updateFilterBadge: function(filterGroup, count) {
    const badge = filterGroup.querySelector('[data-filter-count]');
    
    if (!badge) return;
    
    badge.textContent = count;
    
    if (count > 0) {
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  },

  /**
   * Apply filters
   */
  applyFilters: function(filterGroup) {
    const form = filterGroup.querySelector('form');
    if (!form) return;
    
    const filterType = form.dataset.filterType;
    const selectedValues = [];
    
    // Get selected checkboxes/inputs
    const inputs = form.querySelectorAll('input[type="checkbox"]:checked');
    inputs.forEach(input => {
      selectedValues.push(input.value);
    });
    
    // Store active filters
    this.activeFilters[filterType] = selectedValues;
    
    // Update badge
    this.updateFilterBadge(filterGroup, selectedValues.length);
    
    // Dispatch event for AJAX product grid
    window.dispatchEvent(new CustomEvent('b2b:filters-applied', {
      detail: { filterType, selectedValues, allFilters: this.activeFilters }
    }));
    
    // Also apply to static products (if any exist on page)
    this.filterProducts();
  },

  /**
   * Reset filters
   */
  resetFilters: function(filterGroup) {
    const form = filterGroup.querySelector('form');
    if (!form) return;
    
    const filterType = form.dataset.filterType;
    
    const inputs = form.querySelectorAll('input[type="checkbox"]');
    inputs.forEach(input => {
      input.checked = false;
    });
    
    // Clear this filter type from active filters
    if (this.activeFilters[filterType]) {
      delete this.activeFilters[filterType];
    }
    
    // Update badge
    this.updateFilterBadge(filterGroup, 0);
    
    // Dispatch event for AJAX product grid
    window.dispatchEvent(new CustomEvent('b2b:filters-applied', {
      detail: { filterType, selectedValues: [], allFilters: this.activeFilters }
    }));
    
    // Reapply remaining filters to static products
    this.filterProducts();
  },

  /**
   * Filter product cards based on active filters
   */
  filterProducts: function() {
    const productGrid = document.querySelector('[data-product-grid]');
    if (!productGrid) {
      return;
    }
    
    const productCards = productGrid.querySelectorAll('.product-card');
    
    // If no active filters, show all products
    if (Object.keys(this.activeFilters).length === 0 || 
        Object.values(this.activeFilters).every(values => values.length === 0)) {
      productCards.forEach(card => {
        card.style.display = '';
      });
      return;
    }
    
    // Filter each product card
    productCards.forEach(card => {
      let shouldShow = true;
      
      // Check each filter type (AND logic between different filter types)
      for (const [filterType, selectedValues] of Object.entries(this.activeFilters)) {
        if (selectedValues.length === 0) continue;
        
        // Get the product's value for this filter type
        let productValue = '';
        
        switch (filterType) {
          case 'product_type':
            productValue = card.dataset.productType || '';
            break;
          case 'brand':
            productValue = card.dataset.productVendor || '';
            break;
          case 'tag':
            // Tags would need to be added as data attributes if needed
            productValue = card.dataset.productTags || '';
            break;
        }
        
        // Check if product matches any selected value (OR logic within filter type)
        if (!selectedValues.includes(productValue)) {
          shouldShow = false;
          break;
        }
      }
      
      // Show or hide the product card
      if (shouldShow) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  },

  /**
   * Populate filter options
   */
  populateFilters: function(root) {
    const forms = root.querySelectorAll('[data-filter-type]');
    
    forms.forEach((form, index) => {
      const filterType = form.dataset.filterType;
      
      switch (filterType) {
        case 'product_type':
          this.populateProductTypeFilter(form);
          break;
        case 'collection':
          this.populateCollectionFilter(form);
          break;
        case 'tag':
          this.populateTagFilter(form);
          break;
        case 'brand':
          this.populateBrandFilter(form);
          break;
        case 'price':
          this.populatePriceFilter(form);
          break;
      }
    });
  },

  /**
   * Populate product type filter
   */
  populateProductTypeFilter: async function(form) {
    form.innerHTML = '<p class="text-sm text-gray-500">Loading...</p>';
    
    try {
      const productTypes = await this.fetchAllProductTypes();
      
      if (productTypes.length === 0) {
        form.innerHTML = '<p class="text-sm text-gray-500">No product types available</p>';
        return;
      }
      
      form.innerHTML = productTypes.map((type, index) => `
        <label>
          <input type="checkbox" class="peer sr-only" value="${this.escapeHtml(type)}" name="product_type">
          <span class="filter-chip">${this.escapeHtml(type)}</span>
        </label>
      `).join('');
    } catch (error) {
      console.error('[Product Grid Filters] Error fetching product types:', error);
      const fallbackTypes = this.getProductTypesFromPage();
      if (fallbackTypes.length > 0) {
        form.innerHTML = fallbackTypes.map((type, index) => `
          <label>
            <input type="checkbox" class="peer sr-only" value="${this.escapeHtml(type)}" name="product_type">
            <span class="filter-chip">${this.escapeHtml(type)}</span>
          </label>
        `).join('');
      } else {
        form.innerHTML = '<p class="text-sm text-gray-500">Error loading product types</p>';
      }
    }
  },

  /**
   * Populate collection filter
   */
  populateCollectionFilter: function(form) {
    form.innerHTML = '<p class="text-sm text-gray-500">Collection filters coming soon</p>';
  },

  /**
   * Populate tag filter
   */
  populateTagFilter: function(form) {
    form.innerHTML = '<p class="text-sm text-gray-500">Tag filters coming soon</p>';
  },

  /**
   * Populate brand filter
   */
  populateBrandFilter: async function(form) {
    form.innerHTML = '<p class="text-sm text-gray-500">Loading...</p>';
    
    try {
      const vendors = await this.fetchAllVendors();
      
      if (vendors.length === 0) {
        form.innerHTML = '<p class="text-sm text-gray-500">No brands available</p>';
        return;
      }
      
      form.innerHTML = vendors.map((vendor, index) => `
        <label>
          <input type="checkbox" class="peer sr-only" value="${this.escapeHtml(vendor)}" name="brand">
          <span class="filter-chip">${this.escapeHtml(vendor)}</span>
        </label>
      `).join('');
    } catch (error) {
      console.error('[Product Grid Filters] Error fetching vendors:', error);
      const fallbackVendors = this.getVendorsFromPage();
      if (fallbackVendors.length > 0) {
        form.innerHTML = fallbackVendors.map((vendor, index) => `
          <label>
            <input type="checkbox" class="peer sr-only" value="${this.escapeHtml(vendor)}" name="brand">
            <span class="filter-chip">${this.escapeHtml(vendor)}</span>
          </label>
        `).join('');
      } else {
        form.innerHTML = '<p class="text-sm text-gray-500">Error loading brands</p>';
      }
    }
  },

  /**
   * Populate price filter
   */
  populatePriceFilter: function(form) {
    form.innerHTML = `
      <div class="space-y-2">
        <label class="flex items-center gap-2">
          <input type="checkbox" class="peer" value="0-25" name="price">
          <span class="text-sm text-gray-700">$0 - $25</span>
        </label>
        <label class="flex items-center gap-2">
          <input type="checkbox" class="peer" value="25-50" name="price">
          <span class="text-sm text-gray-700">$25 - $50</span>
        </label>
        <label class="flex items-center gap-2">
          <input type="checkbox" class="peer" value="50-100" name="price">
          <span class="text-sm text-gray-700">$50 - $100</span>
        </label>
        <label class="flex items-center gap-2">
          <input type="checkbox" class="peer" value="100+" name="price">
          <span class="text-sm text-gray-700">$100+</span>
        </label>
      </div>
    `;
  },

  /**
   * Fetch all product types from Storefront API or AJAX API
   * TODO: Implement proper Storefront API fetch.
   * Currently falling back to scraping page content as a temporary measure.
   */
  fetchAllProductTypes: async function() {
    // Placeholder for API fetch
    return this.getProductTypesFromPage();
  },

  /**
   * Fetch all vendors
   * TODO: Implement proper Storefront API fetch.
   * Currently falling back to scraping page content as a temporary measure.
   */
  fetchAllVendors: async function() {
    // Placeholder for API fetch
    return this.getVendorsFromPage();
  },

  /**
   * Get product types from current page products
   */
  getProductTypesFromPage: function() {
    const types = new Set();
    document.querySelectorAll('.product-card').forEach(card => {
      if (card.dataset.productType) {
        types.add(card.dataset.productType);
      }
    });
    return Array.from(types).sort();
  },

  /**
   * Get vendors from current page products
   */
  getVendorsFromPage: function() {
    const vendors = new Set();
    document.querySelectorAll('.product-card').forEach(card => {
      if (card.dataset.productVendor) {
        vendors.add(card.dataset.productVendor);
      }
    });
    return Array.from(vendors).sort();
  },

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml: function(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
};

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  window.ProductGridFilters.init();
});
