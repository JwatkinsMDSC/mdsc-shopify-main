import { BaseComponent } from '../core/base-component.js';

export class MDSCartDrawer extends BaseComponent {
  init() {
    this.drawer = this.$('[data-cart-drawer]');
    this.overlay = this.$('[data-cart-overlay]');
    this.closeButton = this.$('[data-cart-close]');
    this.cartItems = this.$('[data-cart-items]');
    this.isOpen = false;
  }

  attachEventListeners() {
    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => this.close());
    }

    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.close());
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    document.addEventListener('mds:cart:open', () => this.open());
    document.addEventListener('mds:cart:close', () => this.close());
    document.addEventListener('mds:cart:add', (e) => this.handleAddToCart(e.detail));
  }

  async open() {
    this.isOpen = true;
    this.drawer?.classList.add('active');
    this.overlay?.classList.add('active');
    this.setAttribute('aria-hidden', 'false');
    this.emit('mds:cart:opened');
    document.body.style.overflow = 'hidden';

    await this.refreshCart();
  }

  close() {
    this.isOpen = false;
    this.drawer?.classList.remove('active');
    this.overlay?.classList.remove('active');
    this.setAttribute('aria-hidden', 'true');
    this.emit('mds:cart:closed');
    document.body.style.overflow = '';
  }

  async handleAddToCart(data) {
    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        await this.refreshCart();
        this.open();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      this.emit('mds:cart:error', { error });
    }
  }

  async refreshCart() {
    try {
      const response = await fetch('/cart.js');
      const cart = await response.json();
      this.emit('mds:cart:updated', { cart });
      this.renderCart(cart);
    } catch (error) {
      console.error('Error refreshing cart:', error);
    }
  }

  renderCart(cart) {
    if (!this.cartItems) return;

    if (cart.item_count === 0) {
      this.cartItems.innerHTML = '<p class="text-center py-8">Your cart is empty</p>';
      return;
    }

  }

  cleanup() {
    this.close();
  }
}

customElements.define('mds-cart-drawer', MDSCartDrawer);
