/**
 * B2B Cart JavaScript
 * Handles cart modal functionality and cart operations
 */

(function() {
  
  let cartData = null;
  
  document.addEventListener('DOMContentLoaded', function() {
    initializeCart();
  });
  
  /**
   * Initialize cart functionality
   */
  function initializeCart() {
    const modal = document.getElementById('b2bCartModal');
    if (!modal) return;
    
    const triggers = document.querySelectorAll('[data-cart-trigger]');
    const closeButtons = modal.querySelectorAll('[data-cart-close]');
    
    // Open cart modal
    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        openCart();
      });
    });
    
    // Close cart modal
    closeButtons.forEach(button => {
      button.addEventListener('click', () => {
        closeCart();
      });
    });
    
    // Listen for cart updates from product cards
    document.addEventListener('b2b:cart-updated', () => {
      loadCart();
      openCart();
    });
    
    // Load initial cart data
    loadCart();
  }
  
  /**
   * Open cart modal
   */
  async function openCart() {
    const modal = document.getElementById('b2bCartModal');
    if (!modal) return;
    
    await loadCart();
    modal.showModal();
  }
  
  /**
   * Close cart modal
   */
  function closeCart() {
    const modal = document.getElementById('b2bCartModal');
    if (!modal) return;
    
    modal.close();
  }
  
  /**
   * Load cart data from Shopify
   */
  async function loadCart() {
    try {
      const response = await fetch('/cart.js');
      cartData = await response.json();
      console.log('Cart loaded:', cartData);
      renderCart();
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  }
  
  /**
   * Render cart contents
   */
  function renderCart() {
    if (!cartData) return;
    
    console.log('Rendering cart with', cartData.items.length, 'items');
    
    const cartItems = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartCount = document.querySelector('[data-cart-count]');
    
    if (!cartItems) return;
    
    // Update cart count
    if (cartCount) {
      cartCount.textContent = cartData.item_count;
    }
    
    // Update subtotal
    if (cartSubtotal) {
      cartSubtotal.textContent = formatMoney(cartData.total_price);
    }
    
    // Filter out items with quantity 0
    const validItems = cartData.items.filter(item => item.quantity > 0);
    console.log('Valid items (quantity > 0):', validItems.length);
    
    // Show/hide empty state
    if (validItems.length === 0) {
      if (cartEmpty) {
        cartEmpty.classList.remove('hidden');
      }
      cartItems.innerHTML = '';
      return;
    }
    
    if (cartEmpty) {
      cartEmpty.classList.add('hidden');
    }
    
    // Render cart items
    const template = document.getElementById('cart-item-template');
    if (!template) return;
    
    cartItems.innerHTML = '';
    
    let lineNumber = 0;
    cartData.items.forEach((item, index) => {
      if (item.quantity === 0) return;
      
      lineNumber++;
      const originalLinePrice = item.original_line_price || item.line_price;
      const itemHtml = template.innerHTML
        .replace(/\{\{image\}\}/g, item.featured_image?.url || item.image || '')
        .replace(/\{\{title\}\}/g, item.product_title)
        .replace(/\{\{variant_title\}\}/g, item.variant_title || '')
        .replace(/\{\{line_price\}\}/g, formatMoney(item.line_price))
        .replace(/\{\{original_line_price\}\}/g, formatMoney(originalLinePrice))
        .replace(/\{\{quantity\}\}/g, item.quantity)
        .replace(/\{\{url\}\}/g, item.url)
        .replace(/\{\{key\}\}/g, lineNumber);
      
      const li = document.createElement('li');
      li.innerHTML = itemHtml;
      cartItems.appendChild(li);
    });
    
    // Attach event listeners to cart item actions
    attachCartItemListeners();
  }
  
  /**
   * Attach event listeners to cart item actions
   */
  function attachCartItemListeners() {
    const validItems = cartData.items.filter(item => item.quantity > 0);
    
    // Remove buttons
    document.querySelectorAll('[data-cart-remove]').forEach(button => {
      button.addEventListener('click', () => {
        const line = parseInt(button.dataset.cartRemove, 10);
        console.log('Remove button clicked, line:', line);
        updateCartItem(line, 0);
      });
    });
    
    // Increase quantity
    document.querySelectorAll('[data-cart-increase]').forEach(button => {
      button.addEventListener('click', () => {
        const line = parseInt(button.dataset.cartIncrease, 10);
        const item = validItems[line - 1];
        console.log('Increase button clicked, line:', line, 'item:', item);
        if (item) {
          updateCartItem(line, item.quantity + 1);
        }
      });
    });
    
    // Decrease quantity
    document.querySelectorAll('[data-cart-decrease]').forEach(button => {
      button.addEventListener('click', () => {
        const line = parseInt(button.dataset.cartDecrease, 10);
        const item = validItems[line - 1];
        console.log('Decrease button clicked, line:', line, 'item:', item);
        if (item && item.quantity > 1) {
          updateCartItem(line, item.quantity - 1);
        }
      });
    });
  }
  
  /**
   * Update cart item quantity
   */
  async function updateCartItem(line, quantity) {
    try {
      console.log('Updating cart item:', { line, quantity });
      const response = await fetch('/cart/change.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
          line: line,
          quantity: quantity
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Cart update failed:', errorText);
        throw new Error('Failed to update cart');
      }
      
      const updatedCart = await response.json();
      console.log('Cart updated successfully:', updatedCart);
      
      await loadCart();
    } catch (error) {
      console.error('Error updating cart:', error);
      alert('Failed to update cart. Please try again.');
    }
  }
  
  /**
   * Add item to cart
   */
  async function addToCart(variantId, quantity = 1) {
    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: variantId,
          quantity: quantity
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }
      
      await loadCart();
      openCart();
      
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
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
  
  // Expose cart API
  window.B2BCart = {
    addToCart,
    loadCart,
    openCart,
    closeCart
  };
  
})();
