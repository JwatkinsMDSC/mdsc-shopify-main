import { BaseComponent } from '../core/base-component.js';

export class MDSHeaderMenu extends BaseComponent {
  init() {
    this.menuButton = this.$('[data-menu-button]');
    this.menuPanel = this.$('[data-menu-panel]');
    this.isOpen = false;
  }

  attachEventListeners() {
    if (this.menuButton) {
      this.menuButton.addEventListener('click', () => this.toggle());
    }

    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.contains(e.target)) {
        this.close();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  open() {
    this.isOpen = true;
    this.menuPanel?.classList.add('active');
    this.menuButton?.setAttribute('aria-expanded', 'true');
    this.emit('mds:menu:opened');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.isOpen = false;
    this.menuPanel?.classList.remove('active');
    this.menuButton?.setAttribute('aria-expanded', 'false');
    this.emit('mds:menu:closed');
    document.body.style.overflow = '';
  }

  cleanup() {
    this.close();
  }
}

customElements.define('mds-header-menu', MDSHeaderMenu);
