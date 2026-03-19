import { BaseComponent } from '../core/base-component.js';

export class MDSBottomFilterShelf extends BaseComponent {
  init() {
    this.filterButton = this.$('[data-filter-button]');
    this.filterPanel = this.$('[data-filter-panel]');
    this.applyButton = this.$('[data-apply-filters]');
    this.clearButton = this.$('[data-clear-filters]');
    this.closeButton = this.$('[data-close-filters]');
    this.isOpen = false;
  }

  attachEventListeners() {
    if (this.filterButton) {
      this.filterButton.addEventListener('click', () => this.toggle());
    }

    if (this.applyButton) {
      this.applyButton.addEventListener('click', () => this.applyFilters());
    }

    if (this.clearButton) {
      this.clearButton.addEventListener('click', () => this.clearFilters());
    }

    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => this.close());
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    this.on('change', 'input[type="checkbox"], input[type="radio"]', (e) => {
      this.handleFilterChange(e);
    });
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  open() {
    this.isOpen = true;
    this.filterPanel?.classList.add('active', 'animate-slide-up');
    this.filterButton?.setAttribute('aria-expanded', 'true');
    this.emit('mds:filters:opened');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.isOpen = false;
    this.filterPanel?.classList.remove('active');
    this.filterButton?.setAttribute('aria-expanded', 'false');
    this.emit('mds:filters:closed');
    document.body.style.overflow = '';
  }

  handleFilterChange(event) {
    const filter = event.target;
    this.emit('mds:filter:changed', {
      name: filter.name,
      value: filter.value,
      checked: filter.checked
    });
  }

  applyFilters() {
    const formData = new FormData(this.$('form'));
    const params = new URLSearchParams(formData);
    
    this.emit('mds:filters:applied', { params });
    
    window.location.search = params.toString();
  }

  clearFilters() {
    const checkboxes = this.$$('input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => checkbox.checked = false);
    
    const radios = this.$$('input[type="radio"]:checked');
    radios.forEach(radio => radio.checked = false);
    
    this.emit('mds:filters:cleared');
  }

  cleanup() {
    this.close();
  }
}

customElements.define('mds-bottom-filter-shelf', MDSBottomFilterShelf);
