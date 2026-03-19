# Swiper.js Usage Guide

Swiper is already installed and configured in the theme. This guide shows you how to use it.

## Quick Start

### Basic HTML Structure

```html
<div class="swiper" data-swiper>
  <div class="swiper-wrapper">
    <div class="swiper-slide">Slide 1</div>
    <div class="swiper-slide">Slide 2</div>
    <div class="swiper-slide">Slide 3</div>
  </div>
  
  <!-- Optional: Pagination -->
  <div class="swiper-pagination"></div>
  
  <!-- Optional: Navigation -->
  <div class="swiper-button-prev"></div>
  <div class="swiper-button-next"></div>
  
  <!-- Optional: Scrollbar -->
  <div class="swiper-scrollbar"></div>
</div>
```

### Auto-Initialization

Add `data-swiper` attribute to automatically initialize on page load:

```html
<div class="swiper" data-swiper>
  <!-- slides -->
</div>
```

### Custom Configuration

Pass configuration via `data-swiper-config` attribute (JSON):

```html
<div 
  class="swiper" 
  data-swiper
  data-swiper-config='{
    "slidesPerView": 3,
    "spaceBetween": 20,
    "loop": true,
    "autoplay": {
      "delay": 3000
    },
    "pagination": {
      "el": ".swiper-pagination",
      "clickable": true
    },
    "navigation": {
      "nextEl": ".swiper-button-next",
      "prevEl": ".swiper-button-prev"
    }
  }'
>
  <div class="swiper-wrapper">
    <div class="swiper-slide">Slide 1</div>
    <div class="swiper-slide">Slide 2</div>
    <div class="swiper-slide">Slide 3</div>
  </div>
  <div class="swiper-pagination"></div>
  <div class="swiper-button-prev"></div>
  <div class="swiper-button-next"></div>
</div>
```

## Manual Initialization (JavaScript)

Import and use the Swiper utility in your custom scripts:

```js
import { initSwiper } from '@scripts/utils/swiper.js';

const mySwiper = initSwiper('.my-swiper', {
  slidesPerView: 3,
  spaceBetween: 30,
  loop: true,
  autoplay: {
    delay: 3000,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});
```

## Common Configurations

### Product Image Gallery

```html
<div 
  class="swiper product-gallery" 
  data-swiper
  data-swiper-config='{
    "slidesPerView": 1,
    "spaceBetween": 0,
    "loop": true,
    "pagination": {
      "el": ".swiper-pagination",
      "type": "bullets",
      "clickable": true
    }
  }'
>
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      <img src="product-1.jpg" alt="Product">
    </div>
    <div class="swiper-slide">
      <img src="product-2.jpg" alt="Product">
    </div>
  </div>
  <div class="swiper-pagination"></div>
</div>
```

### Responsive Slider

```html
<div 
  class="swiper" 
  data-swiper
  data-swiper-config='{
    "slidesPerView": 1,
    "spaceBetween": 16,
    "breakpoints": {
      "640": {
        "slidesPerView": 2,
        "spaceBetween": 20
      },
      "1024": {
        "slidesPerView": 3,
        "spaceBetween": 30
      },
      "1280": {
        "slidesPerView": 4,
        "spaceBetween": 40
      }
    }
  }'
>
  <div class="swiper-wrapper">
    <!-- slides -->
  </div>
</div>
```

### Auto-playing Hero Slider

```html
<div 
  class="swiper hero-slider" 
  data-swiper
  data-swiper-config='{
    "loop": true,
    "autoplay": {
      "delay": 5000,
      "disableOnInteraction": false
    },
    "effect": "fade",
    "fadeEffect": {
      "crossFade": true
    },
    "pagination": {
      "el": ".swiper-pagination",
      "clickable": true
    }
  }'
>
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      <img src="hero-1.jpg" alt="Hero">
    </div>
    <div class="swiper-slide">
      <img src="hero-2.jpg" alt="Hero">
    </div>
  </div>
  <div class="swiper-pagination"></div>
</div>
```

## Available Modules

The following Swiper modules are pre-loaded:

- **Navigation** - Previous/Next buttons
- **Pagination** - Dots/bullets pagination
- **Scrollbar** - Scrollbar navigation
- **Autoplay** - Automatic slide transitions
- **EffectFade** - Fade transition effect
- **Thumbs** - Thumbnail gallery
- **FreeMode** - Disable fixed positions

## CSS Customization

Override Swiper styles in your custom CSS:

```css
.swiper {
  width: 100%;
  height: 400px;
}

.swiper-slide {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Custom navigation buttons */
.swiper-button-next,
.swiper-button-prev {
  color: var(--color-primary-600);
}

/* Custom pagination */
.swiper-pagination-bullet-active {
  background: var(--color-primary-600);
}
```

## Shopify Theme Editor Integration

Swiper instances are automatically re-initialized when sections are loaded/reloaded in the Shopify theme editor. No additional configuration needed.

## API Reference

For full API documentation, visit: https://swiperjs.com/swiper-api
