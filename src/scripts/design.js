import '../styles/tailwind.css';
import './core/ui/modals-drawers';
import './core/ui/dropdowns';
import './core/ui/mobile-menu';
import './core/ui/tabs';
import './core/ui/accordions.js';
import './core/ui/floating.js';
import './core/ui/form-helpers.js';
import './core/ui/slider.js';
import './core/ui/media-gallery.js';
import './core/ui/marquee.js';
import { toast } from './core/ui/toasts.js';
import Alpine from 'alpinejs';
import intersect from '@alpinejs/intersect';

// Expose for manual testing (dev only)
window.toast = toast;

Alpine.plugin(intersect);

window.Alpine = Alpine;

document.addEventListener('DOMContentLoaded', () => {
  console.log('🎨 Design System - Swiper Ready');
});

Alpine.start();
