import { BaseComponent } from '../core/base-component.js';

export class MDSCollectionFilters extends BaseComponent {
  init() {
    this.form = this.$('form');
    this.sortSelect = this.$('[data-sort-by]');
    this.filterGroups = this.$$('[data-filter-group]');
  }

  attachEventListeners() {
    if (this.sortSelect) {
      this.sortSelect.addEventListener('change', () => this.handleSortChange());
    }

    this.on('change', 'input[type="checkbox"]', (e) => {
      this.handleFilterChange(e);
    });

    if (this.form) {
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.applyFilters();
      });
    }
  }

  handleSortChange() {
    const sortValue = this.sortSelect.value;
    this.emit('mds:collection:sort-changed', { sortValue });
    this.applyFilters();
  }

  handleFilterChange(event) {
    const filter = event.target;
    const filterGroup = filter.closest('[data-filter-group]');
    const groupName = filterGroup?.getAttribute('data-filter-group');

    this.emit('mds:collection:filter-changed', {
      group: groupName,
      name: filter.name,
      value: filter.value,
      checked: filter.checked
    });

    this.updateActiveFiltersCount();
  }

  applyFilters() {
    const formData = new FormData(this.form);
    const params = new URLSearchParams(formData);
    
    this.emit('mds:collection:filters-applied', { params });
    
    this.updateCollection(params);
  }

  async updateCollection(params) {
    const url = `${window.location.pathname}?${params.toString()}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (response.ok) {
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        const newProducts = doc.querySelector('[data-products-grid]');
        const currentProducts = document.querySelector('[data-products-grid]');
        
        if (newProducts && currentProducts) {
          currentProducts.innerHTML = newProducts.innerHTML;
          this.emit('mds:collection:updated');
        }

        window.history.pushState({}, '', url);
      }
    } catch (error) {
      console.error('Error updating collection:', error);
      window.location.href = url;
    }
  }

  updateActiveFiltersCount() {
    const activeFilters = this.$$('input[type="checkbox"]:checked').length;
    this.emit('mds:collection:active-filters-count', { count: activeFilters });
  }

  clearFilters() {
    const checkboxes = this.$$('input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => checkbox.checked = false);
    
    if (this.sortSelect) {
      this.sortSelect.selectedIndex = 0;
    }
    
    this.emit('mds:collection:filters-cleared');
    this.applyFilters();
  }
}

customElements.define('mds-collection-filters', MDSCollectionFilters);
