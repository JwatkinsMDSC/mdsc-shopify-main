/**
 * Slider Controller (Swiper)
 *
 * PURPOSE
 * -------
 * Canonical Swiper integration for the theme.
 * Handles:
 * - Presets
 * - Scoped controls (prev / next / pagination / scrollbar)
 * - Safe overrides
 * - Shopify lifecycle
 * - Debug logging (opt-in)
 * - Lazy loading (native browser loading="lazy" attribute, Swiper v12+)
 * - Zoom (opt-in via data-slider-zoom)
 *
 * Enable debug per slider with:
 *   data-slider-debug
 *
 * IMPORTANT SAFETY RULE
 * ---------------------
 * Swiper modules will throw if they are enabled but their required DOM
 * elements are missing (example: pagination enabled but no pagination element).
 *
 * This file guarantees:
 * - pagination is only passed when paginationEl exists
 * - scrollbar is only passed when scrollbarEl exists
 * - navigation is only passed when both prev AND next exist
 * - autoplay module is only loaded when autoplay is actually enabled
 * - lazy loading uses native browser loading="lazy" attribute (Swiper v12+)
 * - zoom module is only loaded when:
 *   1. data-slider-zoom is present
 *   2. slider type is media-* (media galleries only)
 *   3. .swiper-zoom-container markup exists
 */

import Swiper from 'swiper';
import {
    Navigation,
    Pagination,
    Autoplay,
    Scrollbar,
    A11y,
    Zoom,
} from 'swiper/modules';
import { showSkeleton, hideSkeleton } from './loading-skeleton.js';

/* ======================================================
 * SELECTORS
 * ====================================================== */

const SELECTORS = {
    root: '[data-slider]',
    scope: '[data-slider-scope]',
    prev: '[data-slider-prev]',
    next: '[data-slider-next]',
    pagination: '[data-slider-pagination]',
    scrollbar: '[data-slider-scrollbar]',
};

/* ======================================================
 * INTERNAL STATE
 * ====================================================== */

/**
 * Track initialized sliders to prevent duplicate init,
 * and to support section unload cleanup.
 */
const instances = new Map();

/* ======================================================
 * PRESETS
 * ====================================================== */

const SLIDER_PRESETS = {
    'hero-collection': {
        // IMPORTANT: do NOT include Autoplay here.
        // We add it dynamically only when autoplay is enabled for a specific slider.
        modules: [Navigation, Pagination, A11y],

        slidesPerView: { mobile: 2, tablet: 3, desktop: 4 },
        spaceBetween: { mobile: 12, tablet: 14, desktop: 20 },

        loop: true,
        speed: 600,
        centeredSlides: false,

        navigation: { enabled: true },
        pagination: { enabled: true, type: 'bullets', clickable: true },

        // Optional (off by default unless you add markup + enable in a preset)
        scrollbar: { enabled: false },
    },

    'media-main': {
        modules: [Navigation, A11y],

        // Media galleries are always single-slide view (inline galleries only)
        slidesPerView: { mobile: 1, tablet: 1, desktop: 1 },
        spaceBetween: { mobile: 0, tablet: 0, desktop: 0 },

        loop: false,
        speed: 300,
        centeredSlides: false,

        navigation: { enabled: true },
        pagination: { enabled: false },
        scrollbar: { enabled: false },
    },

    'modal-main': {
        modules: [Navigation, Pagination, Zoom, A11y],

        // Modal main slider with hard defaults (cannot be overridden)
        slidesPerView: { mobile: 1, tablet: 1, desktop: 1 },
        spaceBetween: { mobile: 0, tablet: 0, desktop: 0 },

        loop: false,
        speed: 300,
        centeredSlides: true,

        // Features driven by DOM presence, not preset defaults
        navigation: { enabled: false },
        pagination: { enabled: false },
        scrollbar: { enabled: false },
    },

    'media-thumbs': {
        modules: [A11y],

        // Thumbnail rails are intentionally simple and lightweight
        slidesPerView: { mobile: 4, tablet: 5, desktop: 4 },
        spaceBetween: { mobile: 0, tablet: 0, desktop: 0 },

        loop: false,
        speed: 200,
        centeredSlides: false,

        navigation: { enabled: false },
        pagination: { enabled: false },
        scrollbar: { enabled: false },
    },
    
    'media-thumbs-soft': {
        modules: [A11y],

        slidesPerView: { mobile: 4, tablet: 5, desktop: 4 },
        spaceBetween: { mobile: 8, tablet: 12, desktop: 12 },

        loop: false,
        speed: 200,
        centeredSlides: false,

        navigation: { enabled: false },
        pagination: { enabled: false },
        scrollbar: { enabled: false },
    },

    'announcement-vertical': {
        modules: [Navigation, Autoplay, A11y],

        slidesPerView: { mobile: 1, tablet: 1, desktop: 1 },
        spaceBetween: { mobile: 0, tablet: 0, desktop: 0 },

        loop: true,
        speed: 300,
        centeredSlides: false,

        navigation: { enabled: true },
        pagination: { enabled: false },
        scrollbar: { enabled: false },
    },
};

/* ======================================================
 * DEBUGGING
 * ====================================================== */

function debug(root, ...args) {
    if (!root?.hasAttribute('data-slider-debug') && !window.MDSC_DEBUG) return;
    console.log('[slider]', ...args);
}

/* ======================================================
 * HELPERS
 * ====================================================== */

function readNumberDataset(el, key) {
    const raw = el?.dataset?.[key];
    if (raw === undefined || raw === null || raw === '') return null;

    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
}

function readBooleanAttribute(el, attr, fallback) {
    return el.hasAttribute(attr) ? true : fallback;
}

/**
 * Sliders often have controls outside the .swiper element.
 * We allow a parent wrapper to define the "scope" for control lookup.
 */
function getSliderScope(root) {
    return root.closest(SELECTORS.scope) || root;
}

/**
 * Resolve control elements from the slider scope.
 */
function resolveControls(root) {
    const scope = getSliderScope(root);

    return {
        scope,
        prevEl: scope.querySelector(SELECTORS.prev),
        nextEl: scope.querySelector(SELECTORS.next),
        paginationEl: scope.querySelector(SELECTORS.pagination),
        scrollbarEl: scope.querySelector(SELECTORS.scrollbar),
    };
}

/**
 * Respect reduced motion preferences.
 * For sliders:
 * - disable autoplay
 * - remove transition speed
 */
function applyReducedMotionGuard(config) {
    const prefersReducedMotion =
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) return config;

    const guarded = { ...config };
    guarded.speed = 0;

    if (guarded.autoplay) {
        guarded.autoplay = false;
    }

    return guarded;
}

/* ======================================================
 * CONFIG BUILDER
 * ====================================================== */

function buildSwiperConfig(root, preset) {
    const type = root.dataset.sliderType || '';
    const isModalMain = type === 'modal-main';

    // Modal hard defaults (cannot be overridden)
    const slides = isModalMain ? {
        mobile: 1,
        tablet: 1,
        desktop: 1,
    } : {
        mobile: readNumberDataset(root, 'slidesMobile') ?? preset.slidesPerView.mobile,
        tablet: readNumberDataset(root, 'slidesTablet') ?? preset.slidesPerView.tablet,
        desktop: readNumberDataset(root, 'slidesDesktop') ?? preset.slidesPerView.desktop,
    };

    const spacing = isModalMain ? {
        mobile: 0,
        tablet: 0,
        desktop: 0,
    } : {
        mobile: readNumberDataset(root, 'spacingMobile') ?? preset.spaceBetween.mobile,
        tablet: readNumberDataset(root, 'spacingTablet') ?? preset.spaceBetween.tablet,
        desktop: readNumberDataset(root, 'spacingDesktop') ?? preset.spaceBetween.desktop,
    };

    const loop = isModalMain ? false : readBooleanAttribute(root, 'data-slider-loop', preset.loop);
    const centeredSlides = isModalMain ? true : readBooleanAttribute(root, 'data-slider-centered', preset.centeredSlides);

    // Initial slide (for slide continuity in modals)
    const initialSlide = readNumberDataset(root, 'sliderInitialSlide') ?? 0;

    // Autoplay is enabled only when data-slider-autoplay is provided with a valid delay.
    const autoplayDelay = readNumberDataset(root, 'sliderAutoplay');
    const autoplayEnabled = Boolean(autoplayDelay && autoplayDelay > 0);

    const autoplay =
        autoplayEnabled
            ? {
                delay: autoplayDelay,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            }
            : false;

    const lazyRequested = root.hasAttribute('data-slider-lazy');

    const isMediaSlider = type.startsWith('media-');

    // Grab cursor
    const grabCursor = root.hasAttribute('data-slider-grab-cursor');

    // Effect (validated to prevent Swiper crashes)
    const VALID_EFFECTS = ['slide', 'fade', 'cube', 'coverflow', 'flip', 'cards', 'creative'];
    const requestedEffect = root.getAttribute('data-slider-effect') || 'slide';
    const effect = VALID_EFFECTS.includes(requestedEffect) ? requestedEffect : 'slide';
    const direction = root.getAttribute('data-slider-direction') || 'horizontal';

    // Zoom requires .swiper-zoom-container wrapping each slide's zoomable content.
    // For modal-main: enabled based on markup presence only (controlled by modal config)
    // For media-*: requires both data-slider-zoom attribute AND markup
    const hasZoomMarkup = root.querySelector('.swiper-zoom-container') !== null;
    const zoomEnabled = (isModalMain && hasZoomMarkup) || (isMediaSlider && root.hasAttribute('data-slider-zoom') && hasZoomMarkup);

    if (root.hasAttribute('data-slider-zoom') && !zoomEnabled) {
        if (!isMediaSlider) {
            debug(root, 'Zoom requested but slider is not a media slider. Zoom disabled.');
        } else if (!hasZoomMarkup) {
            debug(root, 'Zoom requested but no .swiper-zoom-container found. Zoom disabled.');
        }
    }

    const { prevEl, nextEl, paginationEl, scrollbarEl } = resolveControls(root);

    debug(root, 'controls:', { prevEl, nextEl, paginationEl, scrollbarEl });

    // Optional click proving for debugging
    if (prevEl && !prevEl.__dbg) {
        prevEl.__dbg = true;
        prevEl.addEventListener('click', () => debug(root, 'PREV BUTTON CLICKED'));
    }
    if (nextEl && !nextEl.__dbg) {
        nextEl.__dbg = true;
        nextEl.addEventListener('click', () => debug(root, 'NEXT BUTTON CLICKED'));
    }

    /* ------------------------------------------------------
     * SAFE MODULE LIST
     *
     * We start from preset modules and conditionally add:
     * - Autoplay (when data-slider-autoplay has a valid delay)
     * - Zoom (when data-slider-zoom is present on a media-* slider with zoom markup)
     *
     * This prevents loading unused modules and ensures Swiper only
     * initializes features that are actually needed.
     *
     * IMPORTANT: Zoom is restricted to media sliders only and requires
     * .swiper-zoom-container markup to prevent runtime errors.
     *
     * NOTE: Swiper v12 lazy loading uses native browser loading="lazy" attribute.
     * The JavaScript lazy loading API was removed in v9+.
     * ------------------------------------------------------ */
    const modules = Array.isArray(preset.modules) ? [...preset.modules] : [];

    if (autoplayEnabled && !modules.includes(Autoplay)) {
        modules.push(Autoplay);
    }

    if (zoomEnabled && !modules.includes(Zoom)) {
        modules.push(Zoom);
    }

    /* ------------------------------------------------------
     * STRICT MODULE GUARDS
     *
     * DOM presence is the FINAL AUTHORITY.
     * Modules are enabled ONLY when required elements exist.
     * This prevents all "Cannot read properties of undefined (reading 'el')" crashes.
     *
     * When required DOM elements are missing:
     * 1. Config property set to undefined
     * 2. Module removed from modules array
     * 3. Warning logged (debug mode)
     * ------------------------------------------------------ */

    // Navigation: STRICT - only enabled when both elements exist
    const navigation =
        prevEl && nextEl
            ? { prevEl, nextEl }
            : undefined;

    // Remove Navigation module if DOM elements missing
    if (preset.navigation?.enabled && !navigation) {
        debug(root, 'WARNING: Preset expects navigation but DOM elements missing (prevEl:', !!prevEl, 'nextEl:', !!nextEl, ') - removing Navigation module');
        const navIndex = modules.indexOf(Navigation);
        if (navIndex !== -1) {
            modules.splice(navIndex, 1);
        }
    }

    // Pagination: STRICT - only enabled when element exists
    const pagination =
        paginationEl
            ? {
                el: paginationEl,
                type: preset.pagination?.type || 'bullets',
                clickable: preset.pagination?.clickable !== false,
            }
            : undefined;

    // Remove Pagination module if DOM element missing
    if (preset.pagination?.enabled && !pagination) {
        debug(root, 'WARNING: Preset expects pagination but no [data-slider-pagination] element found - removing Pagination module');
        const pagIndex = modules.indexOf(Pagination);
        if (pagIndex !== -1) {
            modules.splice(pagIndex, 1);
        }
    }

    // Scrollbar: STRICT - only enabled when element exists
    const scrollbar =
        scrollbarEl
            ? {
                el: scrollbarEl,
                hide: preset.scrollbar?.hide !== false,
            }
            : undefined;

    // Remove Scrollbar module if DOM element missing
    if (preset.scrollbar?.enabled && !scrollbar) {
        debug(root, 'WARNING: Preset expects scrollbar but no [data-slider-scrollbar] element found - removing Scrollbar module');
        const scrollIndex = modules.indexOf(Scrollbar);
        if (scrollIndex !== -1) {
            modules.splice(scrollIndex, 1);
        }
    }

    const config = {
        modules,
        direction,
        slidesPerView: slides.mobile,
        spaceBetween: spacing.mobile,

        breakpoints: {
            640: {
                slidesPerView: slides.tablet,
                spaceBetween: spacing.tablet,
            },
            1024: {
                slidesPerView: slides.desktop,
                spaceBetween: spacing.desktop,
            },
        },

        loop,
        centeredSlides,
        speed: preset.speed ?? 600,
        initialSlide,

        // Disable Swiper's image preloading to enable native browser lazy loading
        preloadImages: false,

        autoplay,

        navigation,
        pagination,
        scrollbar,

        a11y: true,
    };

    if (zoomEnabled) {
        config.zoom = true;
    }

    if (grabCursor) {
        config.grabCursor = true;
    }

    if (effect !== 'slide') {
        config.effect = effect;
    }

    return applyReducedMotionGuard(config);
}

/* ======================================================
 * MANUAL LAZY LOADING
 * ====================================================== */

/**
 * Prepare lazy images BEFORE Swiper initialization.
 * Must run before browser can start loading images.
 * 
 * Handles two cases:
 * 1. HTML has data-lazy-src already set (preferred) - just add class
 * 2. HTML has src attribute (legacy) - move src to data-lazy-src
 * 
 * Also injects per-image skeleton for lazy images.
 */
function prepareLazyImages(root) {
    const slides = root.querySelectorAll('.swiper-slide');
    if (slides.length === 0) return;

    slides.forEach((slide) => {
        const img = slide.querySelector('img');
        if (!img) return;

        const hasLazySrc = img.hasAttribute('data-lazy-src');
        const hasSrc = img.hasAttribute('src');

        // Case 1: data-lazy-src already set in HTML (preferred)
        if (hasLazySrc) {
            const lazySrc = img.getAttribute('data-lazy-src');
            const currentSrc = img.getAttribute('src');

            // If src matches data-lazy-src, image is already loaded (e.g., in cloned galleries)
            if (currentSrc === lazySrc) {
                img.classList.remove('swiper-lazy-loading');
                img.classList.add('swiper-lazy-loaded');
                return; // Skip lazy loading for this image
            }

            img.removeAttribute('src'); // Remove src if present
            img.removeAttribute('loading'); // We handle loading manually
            img.classList.add('swiper-lazy-loading'); // Visual indicator
            injectImageSkeleton(slide);
        }
        // Case 2: Legacy fallback - move src to data-lazy-src
        else if (hasSrc) {
            const originalSrc = img.getAttribute('src');
            img.setAttribute('data-lazy-src', originalSrc);
            img.removeAttribute('src'); // Prevent browser from loading
            img.removeAttribute('loading'); // We handle loading manually
            img.classList.add('swiper-lazy-loading'); // Visual indicator
            injectImageSkeleton(slide);
        }
    });
}

/**
 * Inject per-image skeleton into slide.
 * Skeleton is absolutely positioned overlay shown until image loads.
 */
function injectImageSkeleton(slide) {
    // Don't inject if skeleton already exists
    if (slide.querySelector('[data-skeleton]')) return;

    // Ensure slide has relative positioning
    if (!slide.classList.contains('relative')) {
        slide.classList.add('relative');
    }

    const skeleton = document.createElement('div');
    skeleton.setAttribute('data-skeleton', '');
    skeleton.setAttribute('role', 'status');
    skeleton.className = 'skeleton-lightbox-media';
    skeleton.hidden = false; // Explicitly visible until image loads

    skeleton.innerHTML = `
    <svg class="size-14 animate-spin text-secondary-500/90" xmslns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span class="sr-only">Loading...</span>
  `;

    slide.appendChild(skeleton);
}

/**
 * Set up lazy loading events AFTER Swiper initialization.
 * Loads images for all visible slides (based on slidesPerView) + 1 buffer slide on each side.
 * Works for single-view sliders (main gallery) and multi-view sliders (thumbnails).
 */
function setupLazyLoadingEvents(root, swiper) {
    const slides = root.querySelectorAll('.swiper-slide');
    if (slides.length === 0) return;

    // Load images for a specific slide
    const loadSlide = (index) => {
        if (index < 0 || index >= slides.length) return;

        const slide = slides[index];
        const img = slide.querySelector('img[data-lazy-src]');
        if (!img) return;

        const lazySrc = img.getAttribute('data-lazy-src');
        if (lazySrc && !img.src) {
            // Set src to trigger loading
            img.src = lazySrc;

            // Wait for image to load, then hide skeleton and show image
            const onLoad = () => {
                img.classList.remove('swiper-lazy-loading');
                img.classList.add('swiper-lazy-loaded');

                // Hide per-image skeleton
                const skeleton = slide.querySelector('[data-skeleton]');
                if (skeleton) {
                    skeleton.hidden = true;
                }

                debug(root, `Lazy loaded slide ${index + 1}`);
            };

            // Handle both success and error
            img.addEventListener('load', onLoad, { once: true });
            img.addEventListener('error', onLoad, { once: true });
        }
    };

    // Load active slide and surrounding slides
    // Accounts for slidesPerView (e.g., thumbnails showing 4 at once)
    const loadSurroundingSlides = () => {
        const activeIndex = swiper.activeIndex;

        // Get slidesPerView (could be number, 'auto', or undefined)
        const slidesPerView = swiper.params.slidesPerView || 1;
        const numVisibleSlides = slidesPerView === 'auto' ? 3 : Math.ceil(slidesPerView);

        // Load active slide + all visible slides + 1 buffer on each side
        const startIndex = activeIndex - 1; // 1 buffer before
        const endIndex = activeIndex + numVisibleSlides; // All visible + 1 buffer after

        for (let i = startIndex; i <= endIndex; i++) {
            loadSlide(i);
        }
    };

    // Initial load
    loadSurroundingSlides();

    // Load on slide change
    swiper.on('slideChange', loadSurroundingSlides);

    debug(root, 'Manual lazy loading enabled');
}

/* ======================================================
 * SKELETON MANAGEMENT
 * ====================================================== */

/**
 * Set up skeleton → gallery swap based on Swiper readiness and image loading.
 * For media galleries:
 * - Hide skeleton at parent [data-media-gallery] level
 * - Show all gallery sliders (main + thumbs) atomically
 * - Only after all visible images in main slider are loaded
 */
function setupSkeletonRemoval(root, swiper) {
    if (!root) return;

    const type = root.dataset.sliderType;
    const isMediaGallery = type === 'media-main' || type.startsWith('media-thumbs');

    // Swiper initializes immediately in v11+, so check images right away
    const checkImagesLoaded = () => {
        const images = Array.from(root.querySelectorAll('.swiper-slide img'));

        if (images.length === 0) {
            performSwap();
            debug(root, 'Gallery swap (no images)');
            return;
        }

        // Focus on visible slides only
        const visibleImages = Array.from(root.querySelectorAll('.swiper-slide-active img, .swiper-slide-next img, .swiper-slide-prev img'));

        if (visibleImages.length === 0) {
            performSwap();
            debug(root, 'Gallery swap (no visible images)');
            return;
        }

        const loadedImages = visibleImages.filter(img => img.complete && img.naturalHeight !== 0);

        if (loadedImages.length === visibleImages.length) {
            performSwap();
            debug(root, 'Gallery swap (images already loaded)');
        } else {
            // Not all images loaded yet, wait for load events
            let loadCount = loadedImages.length;
            const total = visibleImages.length;

            visibleImages.forEach(img => {
                if (img.complete && img.naturalHeight !== 0) return;

                const onLoad = () => {
                    loadCount++;
                    if (loadCount === total) {
                        performSwap();
                        debug(root, 'Gallery swap (all images loaded)');
                    }
                };

                img.addEventListener('load', onLoad, { once: true });
                img.addEventListener('error', onLoad, { once: true });
            });
        }
    };

    const performSwap = () => {
        if (isMediaGallery) {
            // For media galleries, find parent container and swap at that level
            const galleryRoot = root.closest('[data-media-gallery]');
            if (galleryRoot) {
                // Hide ONLY the gallery-level skeleton (direct child), not per-image skeletons
                const gallerySkeleton = galleryRoot.querySelector(':scope > [data-skeleton]');
                if (gallerySkeleton) {
                    gallerySkeleton.hidden = true;
                    gallerySkeleton.classList.remove('is-static');
                }
                // Show all sliders (main + thumbs)
                const sliders = galleryRoot.querySelectorAll('[data-slider]');
                sliders.forEach(slider => slider.classList.remove('invisible'));
                // Clear aria-busy
                galleryRoot.removeAttribute('aria-busy');
            }
        } else {
            // For non-media galleries, hide skeleton on the slider itself
            hideSkeleton(root);
            root.classList.remove('invisible');
        }
    };

    // Use requestAnimationFrame to ensure Swiper has updated DOM classes
    requestAnimationFrame(() => {
        checkImagesLoaded();
    });
}

/* ======================================================
 * INSTANCE MANAGEMENT
 * ====================================================== */

function initOneSlider(root) {
    if (!root || instances.has(root)) return;

    const type = root.dataset.sliderType;

    // STRICT: Require explicit data-slider-type attribute
    if (!type) {
        console.warn('[Slider] Missing data-slider-type attribute. Slider will not initialize.', root);
        return;
    }

    const preset = SLIDER_PRESETS[type];

    // STRICT: Preset must exist for the given type
    if (!preset) {
        console.warn('[Slider] No preset found for type:', type, '. Available presets:', Object.keys(SLIDER_PRESETS).join(', '));
        return;
    }

    debug(root, 'preset modules:', (preset.modules || []).map(m => m?.name || 'unknown'));

    // Set aria-busy on media gallery root while loading
    const isMediaMain = type === 'media-main';
    const isMediaThumbs = type.startsWith('media-thumbs');
    const isMediaGallery = isMediaMain || isMediaThumbs;
    if (isMediaGallery) {
        const galleryRoot = root.closest('[data-media-gallery]');
        if (galleryRoot) {
            galleryRoot.setAttribute('aria-busy', 'true');
        }
    }

    // CRITICAL: Prepare lazy images BEFORE Swiper initialization
    // Browser loads images immediately when it sees src attribute, so we must
    // move src to data-lazy-src before Swiper creates the DOM structure
    const lazyEnabled = root.hasAttribute('data-slider-lazy');
    if (lazyEnabled) {
        prepareLazyImages(root);
    }

    const config = buildSwiperConfig(root, preset);
    const swiper = new Swiper(root, config);

    // CRITICAL: Force navigation binding when controls are external to the Swiper root
    if (swiper.navigation && config.navigation) {
        swiper.navigation.init();
        swiper.navigation.update();
    }

    debug(root, 'swiper created:', swiper);

    // Set up lazy loading events AFTER Swiper initialization
    if (lazyEnabled) {
        setupLazyLoadingEvents(root, swiper);
    }

    // Set up skeleton → gallery swap
    // Only the media-main slider triggers the swap (not thumbs variants or modals)
    const shouldTriggerSwap = type === 'media-main' || (!type.startsWith('media-thumbs') && type !== 'modal-main');
    if (shouldTriggerSwap) {
        setupSkeletonRemoval(root, swiper);
    }

    instances.set(root, { swiper });
}

function destroyOneSlider(root) {
    const instance = instances.get(root);
    if (!instance) return;

    const { swiper } = instance;

    if (swiper && typeof swiper.destroy === 'function') {
        swiper.destroy(true, true);
    }

    instances.delete(root);
}

function getSliderInstance(root) {
    if (!root) return null;
    const instance = instances.get(root);
    return instance?.swiper || null;
}

/* ======================================================
 * LIFECYCLE
 * ====================================================== */

function initSliders(context = document) {
    context.querySelectorAll(SELECTORS.root).forEach(initOneSlider);
}

function destroySliders(context = document) {
    context.querySelectorAll(SELECTORS.root).forEach(destroyOneSlider);
}

document.addEventListener('DOMContentLoaded', () => initSliders());

document.addEventListener('shopify:section:load', (e) => initSliders(e.target));

document.addEventListener('shopify:section:unload', (e) => destroySliders(e.target));

/* ======================================================
 * DEV API
 * ====================================================== */

window.MDSC = window.MDSC || {};
window.MDSC.slider = {
    init: initSliders,
    destroy: destroySliders,
    get: getSliderInstance,
    presets: SLIDER_PRESETS,
};

/* ======================================================
 * ES MODULE EXPORTS
 * ====================================================== */

export {
    initOneSlider as initSlider,
    initSliders as initSlidersWithin,
    destroySliders as destroySlidersWithin,
    getSliderInstance,
};
