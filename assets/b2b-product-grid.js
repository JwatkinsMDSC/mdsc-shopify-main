/**
 * B2B Product Grid - AJAX-based product loading and filtering
 */

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
let productsPerPage = 24;
let gridConfig = {};

document.addEventListener('DOMContentLoaded', function() {
  console.log('[B2B Product Grid] Initializing AJAX product grid');
  initializeProductGrid();
});

/**
 * Initialize product grid
 */
async function initializeProductGrid() {
  const productGrid = document.querySelector('[data-product-grid]');
  if (!productGrid) {
    console.warn('[B2B Product Grid] Product grid not found');
    return;
  }
  
  // Get configuration from data attributes
  gridConfig = {
    collectionHandle: productGrid.dataset.collectionHandle || 'all',
    productsPerPage: parseInt(productGrid.dataset.productsPerPage) || 24,
    showDiscountBadge: productGrid.dataset.showDiscountBadge === 'true',
    showDiscountedFirst: productGrid.dataset.showDiscountedFirst === 'true'
  };
  
  productsPerPage = gridConfig.productsPerPage;
  
  console.log('[B2B Product Grid] Config:', gridConfig);
  
  // Fetch all products
  await fetchAllProducts();
  
  // Initial render
  renderProducts();
  
  // Listen for filter changes
  window.addEventListener('b2b:filters-applied', handleFiltersApplied);
}

/**
 * Fetch all products from collection
 */
async function fetchAllProducts() {
  try {
    console.log('[B2B Product Grid] Fetching products from collection:', gridConfig.collectionHandle);
    
    let allFetchedProducts = [];
    let page = 1;
    let hasMorePages = true;
    
    // Fetch all pages (Shopify limits to 250 per page)
    while (hasMorePages) {
      const url = `/collections/${gridConfig.collectionHandle}/products.json?limit=250&page=${page}`;
      console.log('[B2B Product Grid] Fetching page:', page, url);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`[B2B Product Grid] Page ${page} fetched:`, data.products.length, 'products');
      
      if (data.products.length > 0) {
        allFetchedProducts = allFetchedProducts.concat(data.products);
        page++;
      } else {
        hasMorePages = false;
      }
      
      // Safety check to prevent infinite loops
      if (page > 20) {
        console.warn('[B2B Product Grid] Max page limit reached');
        hasMorePages = false;
      }
    }
    
    console.log('[B2B Product Grid] Total products fetched:', allFetchedProducts.length);
    
    // Sort products if needed
    if (gridConfig.showDiscountedFirst) {
      allProducts = sortProductsByDiscount(allFetchedProducts);
    } else {
      allProducts = allFetchedProducts;
    }
    
    // Initially, filtered products = all products
    filteredProducts = [...allProducts];
    
  } catch (error) {
    console.error('[B2B Product Grid] Error fetching products:', error);
    showError('Failed to load products. Please refresh the page.');
  }
}

/**
 * Sort products by discount (discounted first)
 */
function sortProductsByDiscount(products) {
  return products.sort((a, b) => {
    const aHasDiscount = a.compare_at_price && a.compare_at_price > a.price;
    const bHasDiscount = b.compare_at_price && b.compare_at_price > b.price;
    
    if (aHasDiscount && !bHasDiscount) return -1;
    if (!aHasDiscount && bHasDiscount) return 1;
    return 0;
  });
}

/**
 * Handle filter changes
 */
function handleFiltersApplied(event) {
  console.log('[B2B Product Grid] Filters applied:', event.detail);
  
  const activeFilters = (event.detail && event.detail.allFilters) || window.activeFilters || {};
  
  // If no filters, show all products
  if (Object.keys(activeFilters).length === 0 || 
      Object.values(activeFilters).every(values => values.length === 0)) {
    filteredProducts = [...allProducts];
  } else {
    // Filter products
    filteredProducts = allProducts.filter(product => {
      let matches = true;
      
      // Check each filter type (AND logic between different types)
      for (const [filterType, selectedValues] of Object.entries(activeFilters)) {
        if (selectedValues.length === 0) continue;
        
        let productValue = '';
        
        switch (filterType) {
          case 'product_type':
            productValue = product.product_type || '';
            break;
          case 'brand':
            productValue = product.vendor || '';
            break;
          case 'tag':
            // Check if product has any of the selected tags
            const productTags = product.tags || [];
            if (!selectedValues.some(tag => productTags.includes(tag))) {
              matches = false;
            }
            continue;
        }
        
        // Check if product matches any selected value (OR logic within filter type)
        if (!selectedValues.includes(productValue)) {
          matches = false;
          break;
        }
      }
      
      return matches;
    });
  }
  
  console.log('[B2B Product Grid] Filtered to', filteredProducts.length, 'products');
  
  // Reset to page 1 when filters change
  currentPage = 1;
  
  // Re-render products
  renderProducts();
}

/**
 * Render products for current page
 */
function renderProducts() {
  const productGrid = document.querySelector('[data-product-grid]');
  if (!productGrid) return;
  
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const productsToShow = filteredProducts.slice(startIndex, endIndex);
  
  console.log(`[B2B Product Grid] Rendering page ${currentPage}: products ${startIndex}-${endIndex} of ${filteredProducts.length}`);
  
  if (productsToShow.length === 0) {
    productGrid.innerHTML = `
      <div class="col-span-full flex items-center justify-center py-12">
        <div class="text-center">
          <svg class="mx-auto size-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">No products found</h3>
          <p class="mt-2 text-sm text-gray-500">Try adjusting your filters</p>
        </div>
      </div>
    `;
    renderPagination();
    return;
  }
  
  // Render product cards
  productGrid.innerHTML = productsToShow.map((product, index) => 
    renderProductCard(product, startIndex + index + 1)
  ).join('');
  
  // Initialize product card interactions
  initializeProductCards();
  
  // Initialize B2B components
  if (window.B2B && window.B2B.init) {
    window.B2B.init(productGrid);
  }
  
  // Render pagination
  renderPagination();
  
  // Scroll to top of grid
  productGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Add image size parameter to Shopify CDN URLs
 */
function addImageSize(url, width) {
  if (!url || typeof url !== 'string') return '';
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}width=${width}`;
}

/**
 * Render a single product card
 */
function renderProductCard(product, cardIndex) {
  const variant = product.variants[0];
  
  // Price handling - Collections API returns decimal strings, Products API returns cents as integers
  // If it's a string, it's already in dollars; if it's a number, it's in cents
  const price = typeof variant.price === 'string' ? parseFloat(variant.price) : variant.price / 100;
  const comparePrice = variant.compare_at_price ? 
    (typeof variant.compare_at_price === 'string' ? parseFloat(variant.compare_at_price) : variant.compare_at_price / 100) : 0;
  
  const hasDiscount = comparePrice > price;
  const discountPercentage = hasDiscount ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;
  
  const cardId = `product-${product.id}-${cardIndex}`;
  
  // Get the featured image URL
  let imageUrl = '';
  if (variant.featured_image && variant.featured_image.src) {
    imageUrl = variant.featured_image.src;
  } else if (product.featured_image) {
    imageUrl = typeof product.featured_image === 'string' ? product.featured_image : product.featured_image.src;
  } else if (product.images && product.images.length > 0) {
    imageUrl = product.images[0].src || product.images[0];
  }
  
  return `
    <div id="${cardId}" class="product-card shadow-sm" 
         data-product-id="${product.id}" 
         data-product-handle="${product.handle}"
         data-product-type="${escapeHtml(product.product_type || '')}"
         data-product-vendor="${escapeHtml(product.vendor || '')}">
      <div class="product-card-img-wrap group p-0 sm:p-0">
        ${hasDiscount && gridConfig.showDiscountBadge ? `
          <div class="product-card-badge badge badge-md badge-gradient-primary badge-pill">
            ${discountPercentage}% OFF
          </div>
        ` : ''}
        
        <a href="/products/${product.handle}" class="block">
          ${imageUrl ? `
            <img src="${addImageSize(imageUrl, 400)}" alt="${escapeHtml(product.title)}" class="product-card-img" loading="lazy" data-product-image>
          ` : `
            <div class="product-card-img bg-gray-200"></div>
          `}
        </a>
        
        <button class="product-card-quickview" data-quick-view data-product-handle="${product.handle}">
          Quick View
        </button>
      </div>
      
      <div class="product-card-info px-2 sm:px-4 leading-none sm:leading-normal">
        <a href="/products/${product.handle}" class="product-card-title text-sm sm:text-base">
          ${escapeHtml(product.title)}
        </a>
        ${product.vendor ? `
          <p class="product-card-vendor">${escapeHtml(product.vendor)}</p>
        ` : ''}
        
        ${product.variants.length > 1 ? `
          <div class="product-card-variants" data-variant-list>
            ${product.variants.map((variant, vIndex) => {
              // Get variant image - either the variant's featured image or product's first image
              let variantImageSrc = '';
              if (variant.featured_image && variant.featured_image.src) {
                variantImageSrc = variant.featured_image.src;
              } else if (product.featured_image) {
                variantImageSrc = typeof product.featured_image === 'string' ? product.featured_image : (product.featured_image.src || '');
              } else if (product.images && product.images.length > 0) {
                variantImageSrc = product.images[0].src || product.images[0] || '';
              }
              
              // Handle both cents (integer) and dollar (string) formats
              const variantPrice = typeof variant.price === 'string' ? parseFloat(variant.price) : variant.price / 100;
              const variantComparePrice = variant.compare_at_price ? 
                (typeof variant.compare_at_price === 'string' ? parseFloat(variant.compare_at_price) : variant.compare_at_price / 100) : 0;
              const isActive = vIndex === 0;
              
              return `
                <div class="tooltip tooltip-portal" data-tip="${escapeHtml(variant.title)}">
                  <label class="product-card-variant ${isActive ? 'product-card-variant--active' : 'product-card-variant--inactive'}" data-variant-label>
                    <input type="radio" name="id-${cardId}" value="${variant.id}" class="sr-only" ${isActive ? 'checked' : ''} 
                           data-variant-radio 
                           data-price-display="$${variantPrice.toFixed(2)}" 
                           data-compare-display="${variantComparePrice > 0 ? '$' + variantComparePrice.toFixed(2) : ''}" 
                           data-compare="${variantComparePrice}" 
                           data-available="${variant.available}"
                           data-image="${addImageSize(variantImageSrc, 400)}">
                    ${variantImageSrc ? `
                      <img src="${addImageSize(variantImageSrc, 120)}" alt="${escapeHtml(variant.title)}" loading="lazy">
                    ` : ''}
                    <span class="mt-1">${escapeHtml(variant.title)}</span>
                  </label>
                </div>
              `;
            }).join('')}
          </div>
        ` : ''}
      </div>
      
      <form method="post" action="/cart/add" class="product-card-add-form">
        <input type="hidden" name="form_type" value="product">
        <input type="hidden" name="utf8" value="✓">
        <div class="product-card-price-area p-2 sm:p-4">
          <input type="hidden" name="id" value="${variant.id}" data-variant-id>
          
          <div class="flex w-full justify-between items-center gap-2">
            <div class="product-card-price-wrap">
              ${hasDiscount ? `
                <p class="product-card-price-compare" data-price-compare>$${comparePrice.toFixed(2)}</p>
              ` : `
                <p class="product-card-price-compare hidden" data-price-compare></p>
              `}
              <p class="product-card-price text-sm sm:text-base" data-price>$${price.toFixed(2)}</p>
            </div>
            
            <div class="product-card-qty-wrap">
              <span class="product-card-qty">
                <button type="button" class="product-card-qty-btn product-card-qty-btn--left" data-qty-decrease>
                  <span class="sr-only">Decrease</span>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12" class="size-3">
                    <path fill-rule="evenodd" d="M4.25 12a.75.75 0 0 1 .75-.75h14a.75.75 0 0 1 0 1.5H5a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd"></path>
                  </svg>
                </button>
                
                <input type="number" name="quantity" value="1" min="1" class="input-qty" data-qty-input>
                
                <button type="button" class="product-card-qty-btn product-card-qty-btn--right" data-qty-increase>
                  <span class="sr-only">Increase</span>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12" class="size-3">
                    <path fill-rule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd"></path>
                  </svg>
                </button>
              </span>
            </div>
          </div>
          
          <button class="product-card-add text-sm sm:text-base" type="submit" data-product-add ${!variant.available ? 'disabled' : ''}>
            ${variant.available ? `
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 sm:size-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"></path>
              </svg>
              Add to cart
            ` : 'Out of stock'}
          </button>
        </div>
      </form>
    </div>
  `;
}

/**
 * Initialize product card interactions
 */
function initializeProductCards() {
  const cards = document.querySelectorAll('.product-card');
  
  cards.forEach(card => {
    const qtyInput = card.querySelector('[data-qty-input]');
    const qtyDown = card.querySelector('[data-qty-decrease]');
    const qtyUp = card.querySelector('[data-qty-increase]');
    const form = card.querySelector('form');
    const priceEl = card.querySelector('[data-price]');
    const compareEl = card.querySelector('[data-price-compare]');
    const imgEl = card.querySelector('[data-product-image]');
    const radios = card.querySelectorAll('[data-variant-radio]');
    const variantInput = card.querySelector('[data-variant-id]');
    const addButton = card.querySelector('[data-product-add]');
    
    // Variant switching logic
    const setActive = (active) => {
      card.querySelectorAll('[data-variant-label]').forEach((label) => {
        const input = label.querySelector('[data-variant-radio]');
        const isActive = input === active;
        label.classList.toggle('product-card-variant--active', isActive);
        label.classList.toggle('product-card-variant--inactive', !isActive);
      });
    };
    
    const updateVariant = (input) => {
      if (!input) return;
      
      if (priceEl && input.dataset.priceDisplay) {
        priceEl.textContent = input.dataset.priceDisplay;
      }
      
      if (compareEl) {
        const hasCompare = input.dataset.compareDisplay && input.dataset.compareDisplay.trim() !== '' && input.dataset.compare !== '0';
        compareEl.textContent = hasCompare ? input.dataset.compareDisplay : '';
        compareEl.classList.toggle('hidden', !hasCompare);
      }
      
      if (imgEl && input.dataset.image) {
        imgEl.src = input.dataset.image;
      }
      
      if (variantInput) {
        variantInput.value = input.value;
      }
      
      if (addButton) {
        const isAvailable = input.dataset.available === 'true';
        addButton.disabled = !isAvailable;
        if (isAvailable) {
          addButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20" class="size-5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"></path></svg>Add to cart';
        } else {
          addButton.innerHTML = 'Out of stock';
        }
      }
      
      setActive(input);
    };
    
    if (radios.length) {
      radios.forEach((radio) => {
        radio.addEventListener('change', () => updateVariant(radio));
      });
      updateVariant(card.querySelector('[data-variant-radio]:checked') || radios[0]);
    }
    

    
    // Form submission
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const variantId = form.querySelector('[data-variant-id]').value;
        const quantity = parseInt(qtyInput.value) || 1;
        
        try {
          const response = await fetch('/cart/add.js', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
              id: variantId,
              quantity: quantity
            })
          });
          
          if (response.ok) {
            card.dispatchEvent(new CustomEvent('b2b:cart-updated', { bubbles: true }));
          } else {
            form.submit();
          }
        } catch (error) {
          form.submit();
        }
      });
    }
  });
}

/**
 * Render pagination
 */
function renderPagination() {
  const paginationContainer = document.querySelector('[data-pagination-container]');
  if (!paginationContainer) return;
  
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  
  if (totalPages <= 1) {
    paginationContainer.innerHTML = '';
    return;
  }
  
  const pages = [];
  const maxVisiblePages = 5;
  
  // Calculate page range
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  paginationContainer.innerHTML = `
    <nav class="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 mt-8" aria-label="Pagination">
      <div class="-mt-px flex w-0 flex-1">
        ${currentPage > 1 ? `
          <button class="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-primary-500 hover:text-primary-600" data-page="${currentPage - 1}">
            <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20" aria-hidden="true" class="mr-3 size-5 text-gray-400">
              <path fill-rule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" />
            </svg>
            Previous
          </button>
        ` : ''}
      </div>
      
      <div class="hidden md:-mt-px md:flex">
        ${pages.map(page => {
          if (page === currentPage) {
            return `
              <span class="inline-flex items-center border-t-2 border-primary-600 px-4 pt-4 text-sm font-medium text-primary-600" aria-current="page">
                ${page}
              </span>
            `;
          } else {
            return `
              <button class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-primary-500 hover:text-primary-600" data-page="${page}">
                ${page}
              </button>
            `;
          }
        }).join('')}
      </div>
      
      <div class="-mt-px flex w-0 flex-1 justify-end">
        ${currentPage < totalPages ? `
          <button class="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-primary-500 hover:text-primary-600" data-page="${currentPage + 1}">
            Next
            <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20" aria-hidden="true" class="ml-3 size-5 text-gray-400">
              <path fill-rule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
            </svg>
          </button>
        ` : ''}
      </div>
    </nav>
    
    <div class="md:hidden mt-4 text-center text-sm text-gray-600">
      Page ${currentPage} of ${totalPages}
    </div>
  `;
  
  // Add click handlers to pagination buttons
  paginationContainer.querySelectorAll('[data-page]').forEach(button => {
    button.addEventListener('click', () => {
      const page = parseInt(button.dataset.page);
      goToPage(page);
    });
  });
}

/**
 * Go to specific page
 */
function goToPage(page) {
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  currentPage = Math.max(1, Math.min(page, totalPages));
  renderProducts();
}

/**
 * Show error message
 */
function showError(message) {
  const productGrid = document.querySelector('[data-product-grid]');
  if (!productGrid) return;
  
  productGrid.innerHTML = `
    <div class="col-span-full flex items-center justify-center py-12">
      <div class="text-center">
        <svg class="mx-auto size-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">Error loading products</h3>
        <p class="mt-2 text-sm text-gray-500">${message}</p>
      </div>
    </div>
  `;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Export functions for use by filter system
window.b2bProductGrid = {
  getAllProducts: () => allProducts,
  getFilteredProducts: () => filteredProducts,
  refresh: () => renderProducts()
};
