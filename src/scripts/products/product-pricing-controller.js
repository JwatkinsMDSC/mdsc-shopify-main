/**
 * @file src/scripts/products/product-pricing-controller.js
 * @description Handles pricing calculations and updates (Shopify-native).
 * @see THEME_ARCHITECTURE.md
 */

window.B2B = window.B2B || {};
window.B2B.Controllers = window.B2B.Controllers || {};

/**
 * Pricing Controller
 * - State-driven DOM updates
 * - JS owns visibility of retail vs B2B pricing blocks
 * - Liquid renders both blocks, hidden by default
 */
window.B2B.Controllers.Pricing = {
  init(root) {
    const state = root.productState;
    if (!state) {
      if (window.__ENGINE_DEBUG__) {
        throw new Error('[B2B][PricingController] init without ProductState');
      }
      return;
    }

    if (window.__ENGINE_DEBUG__) {
      console.log('[B2B][PricingController] init', root);
    }

    // Idempotency: clean up prior subscription if re-init happens
    if (root._pricingUnsubscribe) {
      root._pricingUnsubscribe();
      delete root._pricingUnsubscribe;
    }

    // Cache key elements (safe even if missing)
    const wrapper = root.querySelector("[data-pricing-wrapper]");
    const retailWrap = root.querySelector("[data-pricing-retail]");
    const b2bWrap = root.querySelector("[data-pricing-b2b]");

    // If no wrapper exists, this product instance may not render pricing (safe)
    if (!wrapper) return;

    // Retail targets
    const retailBaseEls = wrapper.querySelectorAll("[data-base-price]");
    const retailCompareEls = wrapper.querySelectorAll("[data-compare-price]");
    const retailSaveEls = wrapper.querySelectorAll("[data-you-save]");

    // B2B targets
    const b2bPriceEls = wrapper.querySelectorAll("[data-b2b-price]");
    const b2bSavingsEls = wrapper.querySelectorAll("[data-b2b-savings]");

    // Money formatter
    const formatMoney = (cents) => {
      if (window.Shopify && typeof window.Shopify.formatMoney === "function") {
        return window.Shopify.formatMoney(cents);
      }
      return "$" + (cents / 100).toFixed(2);
    };

    /**
     * B2B Context Resolver
     * This must be stable and not rely on persistent DOM outside root.
     * We read from a root data attribute that Liquid sets.
     */
    const isB2BCustomer = () => {
      const val = document.body.getAttribute("data-b2b-customer");
      return val === "true";
    };

    /**
     * Show exactly one pricing block.
     * Liquid renders both blocks hidden. JS decides.
     */
    const setPricingVisibility = (showB2B) => {
      if (retailWrap) {
        retailWrap.classList.toggle("hidden", showB2B);
      }
      if (b2bWrap) {
        b2bWrap.classList.toggle("hidden", !showB2B);
      }
    };

    /**
     * Retail UI Update
     * Uses state as authority.
     */
    const renderRetail = (current, computed) => {
      // base price
      retailBaseEls.forEach((el) => {
        el.textContent = formatMoney(computed.finalPrice);
      });

      // compare at
      const hasCompare =
        typeof current.compareAtPrice === "number" &&
        current.compareAtPrice > computed.finalPrice;

      retailCompareEls.forEach((el) => {
        if (hasCompare) {
          el.textContent = formatMoney(current.compareAtPrice);
          el.style.display = "";
        } else {
          el.style.display = "none";
        }
      });

      // savings badge
      retailSaveEls.forEach((el) => {
        if (computed.savings > 0) {
          el.style.display = "";
          // If snippet includes nested span, keep it flexible
          const amountNode = el.querySelector("[data-savings-amount]");
          if (amountNode) {
            amountNode.textContent = formatMoney(computed.savings);
          } else {
            // fallback: replace whole text
            el.textContent = "Save " + formatMoney(computed.savings);
          }
        } else {
          el.style.display = "none";
        }
      });
    };

    /**
     * B2B UI Update
     * Uses state.b2b.pricing as authority.
     */
    const renderB2B = (current, computed) => {
      if (!current.b2b || !current.b2b.pricing) return;

      const pricing = current.b2b.pricing;
      // Use base_price from B2B service + any local upgrades
      const b2bBase = pricing.base_price; 
      const b2bFinal = b2bBase + computed.upgradeTotal;
      
      // Calculate savings vs Retail Final
      const savingsVsRetail = Math.max(0, computed.finalPrice - b2bFinal);

      b2bPriceEls.forEach((el) => {
        el.textContent = formatMoney(b2bFinal);
      });

      b2bSavingsEls.forEach((el) => {
        if (savingsVsRetail > 0) {
          el.textContent = "You save " + formatMoney(savingsVsRetail);
          el.style.display = "";
        } else {
          el.style.display = "none";
        }
      });
    };

    /**
     * Compute derived totals from state.
     * - upgrades: [{ price: cents }, ...]
     */
    const computePricing = (current) => {
      const upgradeTotal = Array.isArray(current.upgrades)
        ? current.upgrades.reduce((sum, u) => sum + (u && u.price ? u.price : 0), 0)
        : 0;

      const base = typeof current.basePrice === "number" ? current.basePrice : 0;
      const finalPrice = base + upgradeTotal;

      const compare = typeof current.compareAtPrice === "number" ? current.compareAtPrice : 0;
      const savings = compare > finalPrice ? (compare - finalPrice) : 0;

      return { upgradeTotal, finalPrice, savings };
    };

    // Track last resolved params to prevent loops/redundant calls
    // Prevents resolver loops when state.setState triggers subscribe again
    let lastResolved = { variantId: null, quantity: null };

    // Subscribe to state and drive UI updates
    if (window.__ENGINE_DEBUG__) {
      console.log('[B2B][PricingController] subscribed to state', state);
    }
    root._pricingUnsubscribe = state.subscribe((current) => {
      if (window.__ENGINE_DEBUG__) {
        console.log('[B2B][PricingController] state updated', current);
      }
      const computed = computePricing(current);
      const isB2B = isB2BCustomer();
      
      // Phase 3: Dummy B2B Resolver Integration
      // Task 3.1.1: Add explicit eligibility guard
      if (isB2B && current.b2b && current.b2b.enabled && window.__USE_DUMMY_B2B__ && window.B2B.Pricing.resolveDummy) {
        const { variantId, quantity } = current;
        
        // Only fetch if params changed
        if (variantId !== lastResolved.variantId || quantity !== lastResolved.quantity) {
          lastResolved = { variantId, quantity };
          
          window.B2B.Pricing.resolveDummy({ 
            productId: current.productId, 
            variantId, 
            quantity 
          }).then((pricing) => {
            // Task 3.1.3: Support optional global overrides for demo
            const eligible = typeof window.__B2B_FORCE_ELIGIBLE__ === "boolean"
              ? window.__B2B_FORCE_ELIGIBLE__
              : pricing.eligible;

            // Update state with new pricing
            // Note: This will trigger subscribe again, but params won't have changed
            state.setState({
              b2b: {
                enabled: true,
                eligible: eligible,
                pricing: pricing
              }
            });
          });
        }
      }

      // Visibility now driven by state eligibility (if B2B customer)
      // Fallback to retail if not eligible or not B2B
      const showB2B = isB2B && current.b2b && current.b2b.eligible;

      setPricingVisibility(showB2B);

      if (showB2B) {
        renderB2B(current, computed);
      } else {
        renderRetail(current, computed);
      }

      // External integration event only
      root.dispatchEvent(
        new CustomEvent("price:update", {
          detail: {
            mode: showB2B ? "b2b" : "retail",
            basePrice: current.basePrice,
            compareAtPrice: current.compareAtPrice,
            upgradeTotal: computed.upgradeTotal,
            finalPrice: computed.finalPrice,
            savings: computed.savings
          }
        })
      );
    });
  },

  destroy(root) {
    if (window.__ENGINE_DEBUG__) {
      console.log('[B2B][PricingController] destroy', root);
    }
    if (root._pricingUnsubscribe) {
      root._pricingUnsubscribe();
      delete root._pricingUnsubscribe;
    }
  }
};
