/**
 * media-gallery.js
 *
 * MODAL GALLERY PHILOSOPHY
 * ------------------------
 * The modal gallery is NOT a clone of the inline gallery.
 * It is a purpose-built Swiper instance with its own:
 * - Configuration (hard defaults + feature toggles)
 * - Layout (constructed programmatically)
 * - Styling (controlled via unified class map)
 *
 * The inline gallery serves as:
 * - Content source (slides)
 * - State source (active index)
 *
 * SUPPORTED ATTRIBUTES
 * -------------------
 * Context & Behavior:
 *   data-media-context="modal"        - Marks this gallery for modal use
 *   data-media-mode="modal"           - Alias for context (both work)
 *   data-media-zoom="true|false"      - Enable zoom module
 *   data-media-thumbs="true|false"    - Include thumbnail gallery
 *   data-media-nav="true|false"       - Show navigation buttons
 *   data-media-pagination="true|false" - Show pagination bullets
 *   data-media-grab-cursor="true|false" - Enable grab cursor
 *   data-media-effect="slide|fade|cube|coverflow|flip|cards|creative" - Swiper effect
 *
 * Styling (unified class map):
 *   data-media-classes="
 *     root:class-for-modal-root;
 *     gallery:class-for-gallery-wrapper;
 *     slider:class-for-main-slider;
 *     track:class-for-swiper-wrapper;
 *     slide:class-for-swiper-slide;
 *     navWrapper:class-for-nav-wrapper;
 *     nav:class-for-nav-buttons;
 *     pagination:class-for-pagination;
 *     thumbsWrapper:class-for-thumbs-wrapper;
 *     thumbsSlider:class-for-thumbs-slider;
 *     thumbsSlide:class-for-thumbs-slide
 *   "
 *
 * MODAL SWIPER HARD DEFAULTS
 * ---------------------------
 * Always enforced, cannot be overridden:
 *   slidesPerView: 1
 *   centeredSlides: true
 *   loop: false
 *
 * LAZY LOADING BEHAVIOR
 * ---------------------
 * Modal galleries eagerly load all images when opened.
 * Images with data-lazy-src are immediately converted to src
 * since the modal is opened on-demand by user interaction.
 *
 * EXAMPLE MARKUP
 * --------------
 * <div data-media-gallery>
 *   <div data-slider data-slider-type="media-main">
 *     <div class="swiper-wrapper">
 *       <div class="swiper-slide"><img src="..." /></div>
 *     </div>
 *     <button data-media-open aria-controls="pdp-modal">Expand</button>
 *   </div>
 * </div>
 *
 * <div id="pdp-modal" data-ui-panel data-ui-type="modal" hidden>
 *   <button data-media-close>Close</button>
 *   <div data-media-gallery-modal-root
 *        data-media-context="modal"
 *        data-media-zoom="true"
 *        data-media-thumbs="true"
 *        data-media-nav="true"
 *        data-media-pagination="true"
 *        data-media-classes="
 *          root:modal-root;
 *          gallery:modal-gallery;
 *          slider:modal-slider;
 *          track:swiper-wrapper modal-track;
 *          slide:swiper-slide modal-slide;
 *          nav:btn btn-white;
 *          navWrapper:nav-wrapper;
 *          pagination:swiper-pagination
 *        "></div>
 * </div>
 */

import { initSlider, destroySlidersWithin, getSliderInstance } from './slider.js';
import { showSkeleton, hideSkeleton } from './loading-skeleton.js';

const SELECTORS = {
    gallery: '[data-media-gallery]',
    modalRoot: '[data-media-gallery-modal-root]',
    main: '[data-slider][data-slider-type="media-main"]',
    thumbs: '[data-slider]', // Will be filtered by type prefix in mountGallery
    openBtn: '[data-media-open][aria-controls]',
    modalClose: '[data-media-close]',
};

const STATE = new WeakMap();

/* ======================================================
 * CLASS MAP PARSER
 * ====================================================== */

/**
 * Parse unified class map from data-media-classes attribute.
 * Format: "key:value; key:value"
 * Returns normalized object with default empty strings for missing keys.
 */
function parseClassMap(el) {
    const raw = el?.getAttribute('data-media-classes') || '';
    const map = {
        root: '',
        gallery: '',
        slider: '',
        track: '',
        slide: '',
        navWrapper: '',
        nav: '',
        pagination: '',
        thumbsWrapper: '',
        thumbsSlider: '',
        thumbsSlide: '',
    };

    if (!raw) return map;

    raw.split(';').forEach(entry => {
        const trimmed = entry.trim();
        if (!trimmed) return;

        const colonIndex = trimmed.indexOf(':');
        if (colonIndex === -1) return;

        const key = trimmed.slice(0, colonIndex).trim();
        const value = trimmed.slice(colonIndex + 1).trim();

        if (map.hasOwnProperty(key)) {
            map[key] = value;
        }
    });

    return map;
}

/**
 * Parse boolean attribute (must be explicit "true" or "false").
 */
function parseBool(el, attr, defaultVal = false) {
    const value = el?.getAttribute(attr);
    if (value === 'true') return true;
    if (value === 'false') return false;
    return defaultVal;
}

/**
 * Resolve modal configuration from modal root attributes.
 */
function resolveModalConfig(modalRoot) {
    const context = modalRoot.getAttribute('data-media-context') || modalRoot.getAttribute('data-media-mode');
    if (context !== 'modal') {
        console.warn('[media-gallery] Modal root missing data-media-context="modal"');
    }

    const VALID_EFFECTS = ['slide', 'fade', 'cube', 'coverflow', 'flip', 'cards', 'creative'];
    const requestedEffect = modalRoot.getAttribute('data-media-effect') || 'slide';
    const effect = VALID_EFFECTS.includes(requestedEffect) ? requestedEffect : 'slide';
    
    if (requestedEffect && !VALID_EFFECTS.includes(requestedEffect)) {
        console.warn('[media-gallery] Invalid effect:', requestedEffect, '- falling back to "slide"');
    }

    return {
        context,
        zoom: parseBool(modalRoot, 'data-media-zoom', false),
        thumbs: parseBool(modalRoot, 'data-media-thumbs', false),
        nav: parseBool(modalRoot, 'data-media-nav', true),
        pagination: parseBool(modalRoot, 'data-media-pagination', false),
        grabCursor: parseBool(modalRoot, 'data-media-grab-cursor', false),
        effect,
        classMap: parseClassMap(modalRoot),
    };
}

/* ======================================================
 * LIFECYCLE
 * ====================================================== */

export function initMediaGalleries(root = document) {
    root.querySelectorAll(SELECTORS.gallery).forEach((gallery) => {
        if (STATE.has(gallery)) return;
        const st = mountGallery(gallery);
        STATE.set(gallery, st);
    });
}

export function destroyMediaGalleries(root = document) {
    root.querySelectorAll(SELECTORS.gallery).forEach((gallery) => {
        const st = STATE.get(gallery);
        if (!st) return;
        teardownGallery(st);
        STATE.delete(gallery);
    });
}

function mountGallery(gallery) {
    const mainEl = gallery.querySelector(SELECTORS.main);
    
    // Find thumbs slider - any [data-slider] that's not the main slider
    // Must support all media-thumbs* variants (or no type yet, before mapping)
    const allSliders = Array.from(gallery.querySelectorAll('[data-slider][data-slider-type]'));
    const thumbsEl = allSliders.find(el => {
        if (el === mainEl) return false;
        const type = el.getAttribute('data-slider-type');
        return type && type.startsWith('media-thumbs');
    }) || null;
    
    const openBtn = gallery.querySelector(SELECTORS.openBtn);

    // Apply variant → preset mapping BEFORE slider initialization
    applyVariantPresetMapping(gallery, thumbsEl);

    const st = {
        gallery,
        mainEl,
        thumbsEl,
        openBtn,
        modalPanel: null,
        modalRoot: null,
        modalObserver: null,
        mainSwiper: null,
        thumbsSwiper: null,
        unsubscribers: [],
        lastKnownIndex: 0,
        isModalOpen: false,
    };

    st.mainSwiper = getSliderInstance(mainEl);
    st.thumbsSwiper = getSliderInstance(thumbsEl);

    wireMainThumbSync(st);
    wireModalIntegration(st);

    return st;
}

/**
 * Apply variant → preset mapping based on gallery classes.
 * This provides clean authoring while keeping slider.js unaware of variants.
 *
 * RULES:
 * - Mapping occurs BEFORE Swiper initialization
 * - Only applies when thumbs slider doesn't already have explicit data-slider-type
 * - Keeps preset resolution explicit and traceable
 */
function applyVariantPresetMapping(gallery, thumbsEl) {
    if (!thumbsEl) return;

    // Only apply mapping if thumbs slider doesn't have explicit type
    const existingType = thumbsEl.getAttribute('data-slider-type');
    if (existingType && existingType !== 'media-thumbs') {
        // Already has explicit variant preset, respect it
        return;
    }

    // Variant detection: soft-rounded style uses media-thumbs-soft preset
    if (gallery.classList.contains('media-gallery__soft-rounded')) {
        thumbsEl.setAttribute('data-slider-type', 'media-thumbs-soft');
    }
    // Default: if no variant detected and no explicit type, ensure base preset
    else if (!existingType) {
        thumbsEl.setAttribute('data-slider-type', 'media-thumbs');
    }
}

function teardownGallery(st) {
    st.unsubscribers.forEach((fn) => {
        try { fn(); } catch (e) { }
    });
    st.unsubscribers = [];

    if (st.modalObserver) {
        st.modalObserver.disconnect();
        st.modalObserver = null;
    }

    if (st.modalRoot) {
        try {
            destroySlidersWithin(st.modalRoot);
        } catch (e) { }
        st.modalRoot.innerHTML = '';
    }
}

/* ======================================================
 * INLINE GALLERY: MAIN <-> THUMBS SYNC
 * ====================================================== */

function wireMainThumbSync(st) {
    const { mainEl, thumbsEl } = st;
    if (!mainEl) return;

    ensureSwipers(st);

    const onMainChange = () => {
        const main = st.mainSwiper;
        if (!main) return;

        const idx = main.activeIndex || 0;
        st.lastKnownIndex = idx;

        setActiveThumb(st, idx);
    };

    if (st.mainSwiper?.on) {
        st.mainSwiper.on('slideChange', onMainChange);
        st.unsubscribers.push(() => st.mainSwiper?.off?.('slideChange', onMainChange));
    }

    if (thumbsEl) {
        const onThumbClick = (e) => {
            const slide = e.target.closest('.swiper-slide');
            if (!slide) return;

            const slides = Array.from(thumbsEl.querySelectorAll('.swiper-slide'));
            const idx = slides.indexOf(slide);
            if (idx < 0) return;

            goToIndex(st, idx);
        };

        thumbsEl.addEventListener('click', onThumbClick);
        st.unsubscribers.push(() => thumbsEl.removeEventListener('click', onThumbClick));
    }

    onMainChange();
}

function setActiveThumb(st, idx) {
    const thumbsEl = st.thumbsEl;
    if (!thumbsEl) return;

    const slides = Array.from(thumbsEl.querySelectorAll('.swiper-slide'));
    slides.forEach((s, i) => {
        if (i === idx) {
            s.classList.add('is-active');
            s.setAttribute('aria-current', 'true');
        } else {
            s.classList.remove('is-active');
            s.removeAttribute('aria-current');
        }
    });

    if (st.thumbsSwiper?.slideTo) {
        try { st.thumbsSwiper.slideTo(idx); } catch (e) { }
    }
}

function goToIndex(st, idx) {
    ensureSwipers(st);

    const main = st.mainSwiper;
    if (!main) return;

    if (typeof main.slideTo === 'function') {
        try { main.slideTo(idx); } catch (e) { }
    }

    st.lastKnownIndex = idx;
    setActiveThumb(st, idx);
}

function ensureSwipers(st) {
    if (!st.mainSwiper && st.mainEl) st.mainSwiper = getSliderInstance(st.mainEl);
    if (!st.thumbsSwiper && st.thumbsEl) st.thumbsSwiper = getSliderInstance(st.thumbsEl);
}

/* ======================================================
 * MODAL INTEGRATION
 * ====================================================== */

function wireModalIntegration(st) {
    const btn = st.openBtn;
    if (!btn) return;

    const panelId = btn.getAttribute('aria-controls');
    if (!panelId) return;

    const modalPanel = document.getElementById(panelId);
    if (!modalPanel) return;

    const modalRoot = modalPanel.querySelector(SELECTORS.modalRoot);
    if (!modalRoot) return;

    st.modalPanel = modalPanel;
    st.modalRoot = modalRoot;

    const closeBtn = modalPanel.querySelector(SELECTORS.modalClose);
    if (closeBtn) {
        closeBtn.setAttribute('data-ui-trigger', '');
        closeBtn.setAttribute('aria-controls', panelId);
    }

    const observer = new MutationObserver(() => {
        const isHidden = modalPanel.hasAttribute('hidden');
        if (!isHidden && !st.isModalOpen) {
            st.isModalOpen = true;
            onModalOpen(st);
        } else if (isHidden && st.isModalOpen) {
            st.isModalOpen = false;
            onModalClose(st);
        }
    });

    observer.observe(modalPanel, { attributes: true, attributeFilter: ['hidden'] });
    st.modalObserver = observer;

    if (!modalPanel.hasAttribute('hidden')) {
        st.isModalOpen = true;
        onModalOpen(st);
    }
}

function onModalOpen(st) {
    ensureSwipers(st);

    const config = resolveModalConfig(st.modalRoot);
    
    // Set aria-busy (skeleton is already visible)
    st.modalRoot.setAttribute('aria-busy', 'true');
    
    // Clear previous gallery content (preserving skeleton elements)
    const existingGallery = st.modalRoot.querySelector('[data-media-gallery]');
    if (existingGallery) {
        existingGallery.remove();
    }
    
    if (config.classMap.root) {
        st.modalRoot.className = config.classMap.root;
    }

    const { wrap, modalMain, modalThumbsSlider, modalThumbsWrapper } = buildModalGallery(st, config);
    st.modalRoot.appendChild(wrap);

    // Initialize sliders AFTER DOM insertion (critical for effects, pagination, thumbs)
    initSlider(modalMain);
    if (modalThumbsSlider) {
        initSlider(modalThumbsSlider);
        wireModalThumbsSync(modalMain, modalThumbsWrapper);
    }

    // Swap skeleton → gallery once images are ready
    setupModalSkeletonSwap(st.modalRoot, wrap, modalMain);

    const closeBtn = st.modalPanel.querySelector(SELECTORS.modalClose);
    if (closeBtn) closeBtn.focus({ preventScroll: true });
}

function onModalClose(st) {
    try {
        destroySlidersWithin(st.modalRoot);
    } catch (e) { }

    // Clear content but preserve skeleton
    const gallery = st.modalRoot.querySelector('[data-media-gallery]');
    if (gallery) {
        gallery.remove();
    }

    // Reset aria-busy
    st.modalRoot.removeAttribute('aria-busy');

    if (st.openBtn) st.openBtn.focus({ preventScroll: true });
}

/**
 * Setup skeleton → gallery swap for modal galleries.
 * Atomically hides skeleton and reveals gallery once images are loaded.
 */
function setupModalSkeletonSwap(modalRoot, galleryWrap, modalMain) {
    if (!modalRoot || !modalMain || !galleryWrap) return;

    const performSwap = () => {
        // Hide ONLY the modal-level skeleton (direct child), not per-image skeletons
        const modalSkeleton = modalRoot.querySelector(':scope > [data-skeleton]');
        if (modalSkeleton) {
            modalSkeleton.hidden = true;
            modalSkeleton.classList.remove('is-static');
        }
        // Show gallery
        galleryWrap.classList.remove('invisible');
        // Clear aria-busy
        modalRoot.removeAttribute('aria-busy');
    };

    const checkImagesLoaded = () => {
        const images = Array.from(modalMain.querySelectorAll('.swiper-slide img'));
        
        if (images.length === 0) {
            performSwap();
            return;
        }

        // Focus on visible/active slides
        const visibleImages = Array.from(modalMain.querySelectorAll('.swiper-slide-active img, .swiper-slide-next img, .swiper-slide-prev img'));
        
        if (visibleImages.length === 0) {
            performSwap();
            return;
        }

        const loadedImages = visibleImages.filter(img => img.complete && img.naturalHeight !== 0);
        
        if (loadedImages.length === visibleImages.length) {
            // All visible images already loaded
            performSwap();
        } else {
            // Wait for images to load
            let loadCount = loadedImages.length;
            const total = visibleImages.length;
            
            visibleImages.forEach(img => {
                if (img.complete && img.naturalHeight !== 0) return;
                
                const onLoad = () => {
                    loadCount++;
                    if (loadCount === total) {
                        performSwap();
                    }
                };
                
                img.addEventListener('load', onLoad, { once: true });
                img.addEventListener('error', onLoad, { once: true });
            });
        }
    };

    // Use requestAnimationFrame to ensure Swiper has updated DOM classes
    requestAnimationFrame(() => {
        checkImagesLoaded();
    });
}

/* ======================================================
 * MODAL GALLERY CONSTRUCTION
 * ====================================================== */

/**
 * Build modal gallery DOM from inline gallery content.
 * Uses class map for styling and creates all controls programmatically.
 * Returns object with wrapper and slider elements for deferred initialization.
 */
function buildModalGallery(st, config) {
    const wrap = document.createElement('div');
    wrap.setAttribute('data-media-gallery', '');
    wrap.setAttribute('data-media-gallery-type', 'modal-main');
    
    // Start hidden - will be revealed after skeleton swap
    let classes = 'invisible';
    if (config.classMap.gallery) {
        classes += ' ' + config.classMap.gallery;
    }
    wrap.className = classes;

    // Build main slider
    const modalMain = buildModalMainSlider(st, config);
    wrap.appendChild(modalMain);

    // Build thumbs if enabled
    let modalThumbsWrapper = null;
    let modalThumbsSlider = null;
    if (config.thumbs && st.thumbsEl) {
        modalThumbsWrapper = buildModalThumbsSlider(st, config);
        modalThumbsSlider = modalThumbsWrapper.querySelector('[data-slider]');
        wrap.appendChild(modalThumbsWrapper);
    }

    return {
        wrap,
        modalMain,
        modalThumbsSlider,
        modalThumbsWrapper,
    };
}

/**
 * Build modal main slider with slide continuity via initialSlide.
 */
function buildModalMainSlider(st, config) {
    const slider = document.createElement('div');
    slider.setAttribute('data-slider', '');
    slider.setAttribute('data-slider-type', 'modal-main');
    slider.setAttribute('data-slider-initial-slide', String(st.lastKnownIndex));
    slider.setAttribute('data-slider-lazy', ''); // Enable lazy loading for modal
    
    // Modal hard defaults (enforced by slider.js based on type)
    // slidesPerView: 1, centeredSlides: true, loop: false
    
    if (config.grabCursor) {
        slider.setAttribute('data-slider-grab-cursor', '');
    }
    
    if (config.effect !== 'slide') {
        slider.setAttribute('data-slider-effect', config.effect);
    }
    
    if (config.classMap.slider) {
        slider.className = config.classMap.slider;
    }

    // Build track (swiper-wrapper) - MUST preserve swiper-wrapper class
    const track = document.createElement('div');
    track.className = 'swiper-wrapper';
    if (config.classMap.track) {
        track.className += ' ' + config.classMap.track;
    }

    // Clone slides from inline gallery
    const inlineSlides = st.mainEl.querySelectorAll('.swiper-slide');
    inlineSlides.forEach(inlineSlide => {
        const slide = cloneSlideContent(inlineSlide, config);
        if (config.zoom) {
            wrapInZoomContainer(slide);
        }
        track.appendChild(slide);
    });

    slider.appendChild(track);

    // Add controls if enabled
    if (config.nav) {
        const navWrapper = createNavControls(config);
        slider.appendChild(navWrapper);
    }

    if (config.pagination) {
        const paginationEl = createPagination(config);
        slider.appendChild(paginationEl);
    }

    return slider;
}

/**
 * Clone slide content with proper class handling.
 * CRITICAL: Preserve swiper-slide class, add custom classes.
 * Eagerly loads lazy images since modal is opened on-demand.
 */
function cloneSlideContent(inlineSlide, config) {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    if (config.classMap.slide) {
        slide.className += ' ' + config.classMap.slide;
    }

    // Preserve data attributes
    const label = inlineSlide.getAttribute('data-slider-label');
    if (label) {
        slide.setAttribute('data-slider-label', label);
    }

    // Clone child content
    Array.from(inlineSlide.children).forEach(child => {
        slide.appendChild(child.cloneNode(true));
    });

    // Remove cloned per-image skeletons (will be re-injected by prepareLazyImages)
    const clonedSkeletons = slide.querySelectorAll('[data-skeleton]');
    clonedSkeletons.forEach(skeleton => skeleton.remove());

    // Reset lazy loading state for cloned images
    const lazyImages = slide.querySelectorAll('img[data-lazy-src]');
    lazyImages.forEach(img => {
        // Remove src to prevent immediate loading
        img.removeAttribute('src');
        // Reset lazy loading classes
        img.classList.remove('swiper-lazy-loaded');
        img.classList.add('swiper-lazy-loading');
    });

    return slide;
}

/**
 * Wrap slide content in .swiper-zoom-container for zoom module.
 */
function wrapInZoomContainer(slide) {
    if (slide.querySelector('.swiper-zoom-container')) return;

    const zoomContainer = document.createElement('div');
    zoomContainer.className = 'swiper-zoom-container';

    while (slide.firstChild) {
        zoomContainer.appendChild(slide.firstChild);
    }

    slide.appendChild(zoomContainer);
}

/**
 * Create navigation controls programmatically.
 */
function createNavControls(config) {
    const wrapper = document.createElement('div');
    wrapper.className = config.classMap.navWrapper || 'slider-nav__center';

    const prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = config.classMap.nav || 'slider-btn';
    prevBtn.setAttribute('data-slider-prev', '');
    prevBtn.setAttribute('aria-label', 'Previous slide');
    prevBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 19-7-7 7-7"/>
    </svg>`;

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = config.classMap.nav || 'slider-btn';
    nextBtn.setAttribute('data-slider-next', '');
    nextBtn.setAttribute('aria-label', 'Next slide');
    nextBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
    </svg>`;

    wrapper.appendChild(prevBtn);
    wrapper.appendChild(nextBtn);

    return wrapper;
}

/**
 * Create pagination element programmatically.
 */
function createPagination(config) {
    const el = document.createElement('div');
    el.className = config.classMap.pagination || 'swiper-pagination';
    el.setAttribute('data-slider-pagination', '');
    return el;
}

/**
 * Build modal thumbs slider.
 * Preserves preset variant from inline thumbs slider.
 */
function buildModalThumbsSlider(st, config) {
    const wrapper = document.createElement('div');
    if (config.classMap.thumbsWrapper) {
        wrapper.className = config.classMap.thumbsWrapper;
    }

    const slider = document.createElement('div');
    slider.setAttribute('data-slider', '');
    
    // Preserve thumbs preset variant from inline gallery (e.g., media-thumbs-soft)
    const inlineThumbsType = st.thumbsEl?.getAttribute('data-slider-type') || 'media-thumbs';
    slider.setAttribute('data-slider-type', inlineThumbsType);
    if (config.classMap.thumbsSlider) {
        slider.className = config.classMap.thumbsSlider;
    }

    const track = document.createElement('div');
    track.className = 'swiper-wrapper';

    const inlineThumbs = st.thumbsEl.querySelectorAll('.swiper-slide');
    inlineThumbs.forEach(inlineThumb => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        if (config.classMap.thumbsSlide) {
            slide.className += ' ' + config.classMap.thumbsSlide;
        }

        Array.from(inlineThumb.children).forEach(child => {
            slide.appendChild(child.cloneNode(true));
        });

        track.appendChild(slide);
    });

    slider.appendChild(track);
    wrapper.appendChild(slider);

    return wrapper;
}

/**
 * Wire modal thumbs to modal main for synchronization.
 * Uses bounded retry loop for deterministic initialization.
 */
function wireModalThumbsSync(modalMain, modalThumbsWrapper) {
    const modalThumbsSlider = modalThumbsWrapper.querySelector('[data-slider]');
    if (!modalThumbsSlider) return;

    let attempts = 0;
    const MAX_ATTEMPTS = 10;

    function tryWire() {
        const mainSwiper = getSliderInstance(modalMain);
        const thumbsSwiper = getSliderInstance(modalThumbsSlider);
        
        if (mainSwiper && thumbsSwiper) {
            // Sync thumbs with main on slide change
            mainSwiper.on('slideChange', () => {
                const idx = mainSwiper.activeIndex || 0;
                if (thumbsSwiper.slideTo) {
                    try { thumbsSwiper.slideTo(idx); } catch (e) { }
                }
            });

            // Click thumb to change main
            modalThumbsSlider.addEventListener('click', (e) => {
                const slide = e.target.closest('.swiper-slide');
                if (!slide) return;

                const slides = Array.from(modalThumbsSlider.querySelectorAll('.swiper-slide'));
                const idx = slides.indexOf(slide);
                if (idx < 0) return;

                if (mainSwiper.slideTo) {
                    try { mainSwiper.slideTo(idx); } catch (e) { }
                }
            });
        } else if (++attempts < MAX_ATTEMPTS) {
            requestAnimationFrame(tryWire);
        } else {
            console.warn('[media-gallery] Failed to wire modal thumbs after', MAX_ATTEMPTS, 'attempts');
        }
    }

    tryWire();
}

/* ======================================================
 * AUTO-INIT
 * ====================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initMediaGalleries(document);
});
