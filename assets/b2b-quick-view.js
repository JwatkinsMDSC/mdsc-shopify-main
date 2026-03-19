//import { a as initSwiper } from './swiper.js';

/**
 * B2B Quick View JavaScript
 * Handles product quick view modal functionality
 */

let quickViewSwiper = null;

document.addEventListener('DOMContentLoaded', function() {
  initializeQuickView();
});

/**
 * Initialize quick view functionality
 */
function initializeQuickView() {
  const modal = document.getElementById('b2bQuickViewModal');
  if (!modal) return;
  
  // Attach click handlers to all quick view buttons
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-quick-view]');
    if (trigger) {
      e.preventDefault();
      const productHandle = trigger.dataset.productHandle;
      openQuickView(productHandle);
    }
  });
}

/**
 * Open quick view modal for a product
 */
async function openQuickView(productHandle) {
  const modal = document.getElementById('b2bQuickViewModal');
  if (!modal) return;
  
  const spinner = modal.querySelector('[data-quick-view-spinner]');
  const content = modal.querySelector('[data-quick-view-content]');
  
  try {
    // Reset state
    if (spinner) spinner.classList.remove('hidden');
    if (content) content.classList.add('invisible');
    
    // Show modal using native dialog API
    modal.showModal();

    // Fetch product data
    const response = await fetch(`/products/${productHandle}.js`);
    const product = await response.json();
    
    // Populate modal with product data
    populateQuickView(product);
    
    // Wait for images to load
    if (content) {
      await waitForImages(content);
      content.classList.remove('invisible');
    }
    
  } catch (error) {
    console.error('Error loading product:', error);
    alert('Failed to load product details. Please try again.');
    modal.close();
  } finally {
    if (spinner) spinner.classList.add('hidden');
  }
}

/**
 * Wait for images to load
 */
function waitForImages(container) {
  const images = container.querySelectorAll('img');
  const promises = Array.from(images).map(img => {
    if (img.complete) return Promise.resolve();
    return new Promise(resolve => {
      img.onload = resolve;
      img.onerror = resolve;
    });
  });
  return Promise.all(promises);
}

/**
 * Close quick view modal
 */
function closeQuickView() {
  const modal = document.getElementById('b2bQuickViewModal');
  if (!modal) return;
  
  modal.close();
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
 * Populate quick view modal with product data
 */
function populateQuickView(product) {
  const modal = document.getElementById('b2bQuickViewModal');
  if (!modal) return;
  
  let selectedVariantId = product.variants[0].id;
  
  // 1. Images (Swiper)
  const swiperWrapper = modal.querySelector('[data-swiper-wrapper]');
  if (swiperWrapper) {
    swiperWrapper.innerHTML = '';
    const images = product.images && product.images.length > 0 ? product.images : [product.featured_image];
    
    images.forEach(img => {
        const src = typeof img === 'string' ? img : img.src || '';
        if (!src) return;
        
        const slide = document.createElement('div');
        slide.className = 'swiper-slide h-full';
        slide.innerHTML = `<img src="${src}" alt="${product.title}" class="w-full h-full object-cover" />`;
        swiperWrapper.appendChild(slide);
    });

    // Initialize Swiper
    const swiperContainer = modal.querySelector('[data-quick-view-gallery]');
    if (swiperContainer) {
         if (quickViewSwiper) {
            quickViewSwiper.destroy();
         }
         
         // Parse config from data attribute
         let config = {};
         try {
            config = JSON.parse(swiperContainer.dataset.swiperConfig || '{}');
         } catch (e) {
            console.error('Invalid Swiper config:', e);
         }

         // Ensure navigation/pagination elements are scoped to the modal
         if (config.navigation) {
             config.navigation.nextEl = swiperContainer.querySelector(config.navigation.nextEl);
             config.navigation.prevEl = swiperContainer.querySelector(config.navigation.prevEl);
         }
         if (config.pagination) {
             config.pagination.el = swiperContainer.querySelector(config.pagination.el);
         }

         quickViewSwiper = initSwiper(swiperContainer, config);
    }
  }
  
  // 2. Vendor
  const vendor = modal.querySelector('[data-quick-view-vendor]');
  if (vendor) vendor.textContent = product.vendor;

  // 3. Title
  const title = modal.querySelector('[data-quick-view-title]');
  if (title) {
    title.textContent = product.title;
  }
  
  // 4. Description
  const description = modal.querySelector('[data-quick-view-description]');
  if (description && product.description) {
    description.innerHTML = product.description; // Use innerHTML to preserve formatting
    
    // Add list styles to ul elements
    description.querySelectorAll('ul').forEach(ul => {
        ul.classList.add('list-disc', 'pl-4');
    });
  }

  // 5. Link
  const link = modal.querySelector('[data-quick-view-link]');
  if (link) link.href = `/products/${product.handle}`;
  
  // 6. Variant Selector
  const variantSelector = modal.querySelector('[data-quick-view-variant-selector]');
  if (variantSelector) {
    // Clear previous variant selector content
    variantSelector.innerHTML = '';
    
    if (product.variants.length > 0) {
      const variantsHTML = product.variants.map((variant, index) => {
      const isActive = index === 0;
      const price = variant.price / 100;
      const comparePrice = variant.compare_at_price ? variant.compare_at_price / 100 : 0;
      
      // Get variant image - use variant's featured image or fallback to product featured image
      let variantImageUrl = '';
      if (variant.featured_image && variant.featured_image.src) {
        variantImageUrl = variant.featured_image.src;
      } else if (variant.featured_image && typeof variant.featured_image === 'string') {
        variantImageUrl = variant.featured_image;
      } else if (product.featured_image) {
        variantImageUrl = typeof product.featured_image === 'string' ? product.featured_image : (product.featured_image.src || '');
      } else if (product.images && product.images.length > 0) {
        variantImageUrl = product.images[0].src || product.images[0] || '';
      }
      
      // Add size parameter to image URL
      const smallImageUrl = addImageSize(variantImageUrl, 120);
      
      return `
        <div class="tooltip tooltip-portal" data-tip="${variant.title}">
          <div class="product-card-variant ${isActive ? 'product-card-variant--active' : 'product-card-variant--inactive'}"
               data-variant
               data-variant-id="${variant.id}"
               data-variant-image="${variantImageUrl}"
               data-variant-price="$${price.toFixed(2)}"
               data-variant-compare="${comparePrice > 0 ? '$' + comparePrice.toFixed(2) : ''}"
               data-variant-available="${variant.available}"
               data-variant-inventory="${variant.inventory_quantity || 0}"
               data-variant-inventory-management="${variant.inventory_management || ''}">
            <img src="${smallImageUrl}" alt="${variant.title}" draggable="false">
            <span class="mt-1">${variant.title}</span>
          </div>
        </div>
      `;
    }).join('');
    
    variantSelector.innerHTML = variantsHTML;
    
    // Initialize B2B components (Tooltips)
    if (window.B2B && window.B2B.init) {
      window.B2B.init(modal);
    }
    
    // Add variant click handlers
    const variantElements = variantSelector.querySelectorAll('[data-variant]');
    variantElements.forEach(variantEl => {
      variantEl.addEventListener('click', () => {
        // Remove active class from all variants
        variantElements.forEach(v => {
          v.classList.remove('product-card-variant--active');
          v.classList.add('product-card-variant--inactive');
        });
        
        // Add active class to clicked variant
        variantEl.classList.remove('product-card-variant--inactive');
        variantEl.classList.add('product-card-variant--active');
        
        // Update selected variant ID
        selectedVariantId = variantEl.dataset.variantId;
        
        // Update price
        updatePrice(variantEl.dataset.variantPrice, variantEl.dataset.variantCompare);
        
        // Update add to cart button
        updateAddToCartButton(variantEl.dataset.variantAvailable === 'true');

        // Update stock warning
        updateStockWarning({
            inventory_quantity: parseInt(variantEl.dataset.variantInventory),
            inventory_management: variantEl.dataset.variantInventoryManagement
        });

        // Update main product image (Swiper slideTo)
        // Note: This is tricky with Swiper if we don't know the index.
        // For now, we won't auto-slide because we don't have the index mapping easily.
        // Or we could try to find the slide with the matching image src.
      });
    });
    }
  }
  
  // Initial Update
  const firstVariant = product.variants[0];
  const price = firstVariant.price / 100;
  const comparePrice = firstVariant.compare_at_price ? firstVariant.compare_at_price / 100 : 0;
  updatePrice(`$${price.toFixed(2)}`, comparePrice > 0 ? `$${comparePrice.toFixed(2)}` : '');
  
  updateAddToCartButton(firstVariant.available);
  updateStockWarning(firstVariant);

  // Setup quantity buttons
  const qtyInput = modal.querySelector('[data-quick-view-quantity]');
  const qtyDecrease = modal.querySelector('[data-qty-decrease]');
  const qtyIncrease = modal.querySelector('[data-qty-increase]');

  if (qtyInput && qtyDecrease && qtyIncrease) {
      // Remove old listeners (cloning is a quick way, or just re-assigning onclick)
      // Better to use onclick for simplicity in this context to avoid duplicate listeners on re-open
      qtyDecrease.onclick = () => {
          let val = parseInt(qtyInput.value) || 1;
          if (val > 1) qtyInput.value = val - 1;
      };
      qtyIncrease.onclick = () => {
          let val = parseInt(qtyInput.value) || 1;
          qtyInput.value = val + 1;
      };
  }

  
  // Setup form submission
  const form = modal.querySelector('[data-quick-view-form]');
  if (form) {
    form.onsubmit = async (e) => {
      e.preventDefault();
      const quantity = parseInt(qtyInput.value) || 1;
      
      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: JSON.stringify({
            id: selectedVariantId,
            quantity: quantity
          })
        });
        
        if (response.ok) {
          closeQuickView();
          document.dispatchEvent(new CustomEvent('b2b:cart-updated', { bubbles: true }));
        } else {
          throw new Error('Failed to add to cart');
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Failed to add item to cart. Please try again.');
      }
    };
  }
}

/**
 * Update add to cart button state
 */
function updateAddToCartButton(available) {
  const modal = document.getElementById('b2bQuickViewModal');
  if (!modal) return;
  
  const form = modal.querySelector('[data-quick-view-form]');
  if (form) {
    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      btn.disabled = !available;
      if (available) {
        btn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
          Add to cart
        `;
      } else {
        btn.textContent = 'Out of stock';
      }
    }
  }
}

/**
 * Update price display
 */
function updatePrice(price, comparePrice) {
  const modal = document.getElementById('b2bQuickViewModal');
  if (!modal) return;
  
  const priceEl = modal.querySelector('[data-quick-view-price]');
  const comparePriceEl = modal.querySelector('[data-quick-view-compare-price]');
  const priceDisplayEl = modal.querySelector('[data-quick-view-price-display]');
  
  if (priceEl) {
    priceEl.textContent = price;
  }

  if (priceDisplayEl) {
    priceDisplayEl.textContent = price;
  }
  
  if (comparePriceEl) {
    if (comparePrice) {
      comparePriceEl.textContent = comparePrice;
      comparePriceEl.style.display = 'block';
    } else {
      comparePriceEl.style.display = 'none';
    }
  }
}

/**
 * Update stock warning
 */
function updateStockWarning(variant) {
    const stockEl = document.querySelector('[data-quick-view-stock]');
    if (!stockEl) return;

    let html = '';
    // Only show if inventory is managed and quantity is low (e.g. < 20)
    if (variant.inventory_management && variant.inventory_quantity > 0 && variant.inventory_quantity < 20) {
         const percent = Math.min(100, (variant.inventory_quantity / 20) * 100);
         html = `
            <div class="mt-4">
                <p class="text-sm font-medium">Hurry, only ${variant.inventory_quantity} items left in stock!</p>
                <div class="w-full h-2 bg-gray-200 rounded-full mt-1">
                    <div class="h-full bg-secondary-600 rounded-full" style="width: ${percent}%"></div>
                </div>
            </div>
         `;
    }
    stockEl.innerHTML = html;
}

/**
 * Format money helper
 */
function formatMoney(cents) {
  if (window.B2B && window.B2B.formatMoney) {
    return window.B2B.formatMoney(cents);
  }
  const dollars = cents / 100;
  return `$${dollars.toFixed(2)}`;
}
