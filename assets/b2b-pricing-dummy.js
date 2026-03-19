window.B2B = window.B2B || {};
window.B2B.Pricing = window.B2B.Pricing || {};

window.B2B.Pricing.resolveDummy = function ({ productId, variantId, quantity }) {
  const MOCK = {
    eligible: true,
    tier: "professional",
    base_price: 900,
    compare_at_price: 1200,
    currency: "USD",
    rule: {
      type: "collection",
      name: "Pro Tier – Chemicals"
    },
    volume_pricing: [
      { min_qty: 10, unit_price: 850 },
      { min_qty: 25, unit_price: 800 }
    ],
    source: "dummy"
  };

  return new Promise(resolve => {
    setTimeout(() => resolve(MOCK), 300);
  });
};

window.__USE_DUMMY_B2B__ = true;
