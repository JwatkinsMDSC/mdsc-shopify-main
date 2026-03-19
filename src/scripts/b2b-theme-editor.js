//import { initSwiper } from './utils/swiper.js';

function reinitSwiper(swiperElement) {
  const config = swiperElement.hasAttribute('data-swiper-config') 
    ? JSON.parse(swiperElement.getAttribute('data-swiper-config')) 
    : {};
  
  if (swiperElement.swiper) {
    swiperElement.swiper.destroy(true, true);
  }
  
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      initSwiper(swiperElement, config);
    });
  });
}

document.addEventListener('shopify:section:load', (event) => {
  if (event.detail.sectionId === 'public-theme-block') return;
  
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const section = document.querySelector(`[data-section-id="${event.detail.sectionId}"]`);
      if (section) {
        const swipers = section.querySelectorAll('[data-swiper]');
        swipers.forEach(reinitSwiper);
      }
    });
  });
});

document.addEventListener('shopify:section:unload', (event) => {
  const section = event.target;
  const swipers = section.querySelectorAll('[data-swiper]');
  swipers.forEach(swiperElement => {
    if (swiperElement.swiper) {
      swiperElement.swiper.destroy(true, true);
    }
  });
});

document.addEventListener('shopify:block:select', (event) => {
  const block = document.querySelector(`[data-shopify-editor-block*="${event.detail.blockId}"]`);
  if (!block) return;
  
  const swiperEl = block.closest('[data-swiper]');
  if (swiperEl && swiperEl.swiper) {
    const swiper = swiperEl.swiper;
    
    // If the selected block is a slide (or inside one)
    const slide = block.classList.contains('swiper-slide') ? block : block.closest('.swiper-slide');
    
    if (slide) {
      if (swiper.params.loop) {
        const slideIndex = slide.getAttribute('data-swiper-slide-index');
        if (slideIndex !== null) {
          swiper.slideToLoop(parseInt(slideIndex, 10));
        }
      } else {
        const index = Array.from(swiper.slides).indexOf(slide);
        if (index !== -1) {
          swiper.slideTo(index);
        }
      }
    }
  }
});

document.addEventListener('shopify:block:deselect', (event) => {
  const block = document.querySelector(`[data-shopify-editor-block*="${event.detail.blockId}"]`);
  if (!block) return;
  
  const swiperEl = block.closest('[data-swiper]');
  if (swiperEl && swiperEl.swiper) {
    const swiper = swiperEl.swiper;
    if (swiper.params.autoplay && swiper.params.autoplay.enabled) {
       swiper.autoplay.start();
    }
  }
});
