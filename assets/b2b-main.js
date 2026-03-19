/**
 * B2B Main JavaScript
 * Initializes Swiper carousels and handles banner rotation
 */

document.addEventListener('DOMContentLoaded', function() {
  
  // Initialize Swiper carousels
  initializeSwipers();
  
  // Initialize banner rotation
  initializeBannerRotation();
  
  // Initialize mobile menu
  initializeMobileMenu();
});

/**
 * Initialize all Swiper instances on the page
 */
function initializeSwipers() {
  const swiperElements = document.querySelectorAll('[data-swiper]');
  
  if (swiperElements.length === 0) return;
  
  // Load Swiper from CDN if not already loaded
  if (typeof Swiper === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
    script.onload = () => {
      initializeSwiperInstances(swiperElements);
    };
    document.head.appendChild(script);
  } else {
    initializeSwiperInstances(swiperElements);
  }
}

function initializeSwiperInstances(swiperElements) {
  swiperElements.forEach(element => {
    const config = element.dataset.swiperConfig;
    const options = config ? JSON.parse(config) : {};
    
    if (window.Shopify && window.Shopify.designMode) {
      options.loop = false;
    }
    
    new Swiper(element, options);
  });
}

/**
 * Initialize banner offer rotation
 */
function initializeBannerRotation() {
  const bannerContainer = document.querySelector('.banner-rotator');
  if (!bannerContainer) return;
  
  const offers = bannerContainer.querySelectorAll('.banner-offer');
  const prevBtn = document.querySelector('[data-banner-prev]');
  const nextBtn = document.querySelector('[data-banner-next]');
  
  if (offers.length <= 1) return;
  
  let currentIndex = 0;
  
  function showOffer(index) {
    offers.forEach((offer, i) => {
      offer.classList.toggle('active', i === index);
      offer.classList.toggle('inactive', i !== index);
    });
  }
  
  function nextOffer() {
    currentIndex = (currentIndex + 1) % offers.length;
    showOffer(currentIndex);
  }
  
  function prevOffer() {
    currentIndex = (currentIndex - 1 + offers.length) % offers.length;
    showOffer(currentIndex);
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', prevOffer);
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', nextOffer);
  }
  
  // Initialize
  showOffer(currentIndex);
  
  // Auto-rotate every 5 seconds
  setInterval(nextOffer, 5000);
}

/**
 * Initialize mobile menu toggle
 */
function initializeMobileMenu() {
  const mobileMenuToggle = document.querySelector('[data-mobile-menu-toggle]');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (!mobileMenuToggle) return;
  
  const menuOpenIcon = mobileMenuToggle.querySelector('[data-menu-open]');
  const menuClosedIcon = mobileMenuToggle.querySelector('[data-menu-closed]');
  
  mobileMenuToggle.addEventListener('click', () => {
    const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
    
    mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
    
    if (menuOpenIcon && menuClosedIcon) {
      menuOpenIcon.classList.toggle('hidden');
      menuClosedIcon.classList.toggle('hidden');
    }
    
    if (mobileMenu) {
      mobileMenu.classList.toggle('hidden');
    }
  });
}


