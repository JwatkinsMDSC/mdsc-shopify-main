import { BaseComponent } from '../core/base-component.js';

export class MDSCampaignBanner extends BaseComponent {
  init() {
    this.closeButton = this.$('[data-banner-close]');
    this.bannerId = this.attr('data-banner-id');
    this.dismissible = this.hasAttr('data-dismissible');
    this.autoHide = this.hasAttr('data-auto-hide');
    this.autoHideDelay = parseInt(this.attr('data-auto-hide-delay')) || 5000;

    if (this.dismissible && this.isBannerDismissed()) {
      this.hide();
    } else if (this.autoHide) {
      this.setupAutoHide();
    }
  }

  attachEventListeners() {
    if (this.closeButton && this.dismissible) {
      this.closeButton.addEventListener('click', () => this.dismiss());
    }
  }

  dismiss() {
    this.hide();
    this.saveDismissState();
    this.emit('mds:banner:dismissed', { bannerId: this.bannerId });
  }

  hide() {
    this.addClass('hidden');
    this.setAttribute('aria-hidden', 'true');
  }

  show() {
    this.removeClass('hidden');
    this.setAttribute('aria-hidden', 'false');
  }

  setupAutoHide() {
    setTimeout(() => {
      this.hide();
      this.emit('mds:banner:auto-hidden', { bannerId: this.bannerId });
    }, this.autoHideDelay);
  }

  isBannerDismissed() {
    if (!this.bannerId) return false;
    const dismissed = localStorage.getItem(`mds-banner-dismissed-${this.bannerId}`);
    return dismissed === 'true';
  }

  saveDismissState() {
    if (!this.bannerId) return;
    localStorage.setItem(`mds-banner-dismissed-${this.bannerId}`, 'true');
  }

  reset() {
    if (!this.bannerId) return;
    localStorage.removeItem(`mds-banner-dismissed-${this.bannerId}`);
    this.show();
  }
}

customElements.define('mds-campaign-banner', MDSCampaignBanner);
