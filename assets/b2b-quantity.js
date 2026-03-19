/**
 * B2B Quantity Component
 * Handles quantity increment/decrement interactions.
 * Expects buttons and input to be siblings or within the same parent container.
 */

window.B2B = window.B2B || {};

window.B2B.Quantity = (function() {
  const initializedInputs = new WeakMap();

  function init(container = document) {
    const inputs = container.querySelectorAll('[data-qty-input]');
    
    inputs.forEach((input) => {
      if (initializedInputs.has(input)) return;
      
      // Look for buttons in the same parent container
      const wrapper = input.parentElement;
      if (!wrapper) return;

      // Use :scope or just querySelector on wrapper
      const decreaseBtn = wrapper.querySelector('[data-qty-decrease]');
      const increaseBtn = wrapper.querySelector('[data-qty-increase]');

      if (!decreaseBtn && !increaseBtn) return;

      const decrease = (e) => {
        e.preventDefault();
        const current = parseInt(input.value) || 0;
        const min = parseInt(input.min) || 1;
        if (current > min) {
          input.value = current - 1;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      };

      const increase = (e) => {
        e.preventDefault();
        const current = parseInt(input.value) || 0;
        input.value = current + 1;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      };

      if (decreaseBtn) decreaseBtn.addEventListener('click', decrease);
      if (increaseBtn) increaseBtn.addEventListener('click', increase);

      initializedInputs.set(input, { decreaseBtn, increaseBtn, decrease, increase });
    });
  }

  function destroy(container = document) {
    const inputs = container.querySelectorAll('[data-qty-input]');
    inputs.forEach((input) => {
      if (initializedInputs.has(input)) {
        const handlers = initializedInputs.get(input);
        if (handlers.decreaseBtn) handlers.decreaseBtn.removeEventListener('click', handlers.decrease);
        if (handlers.increaseBtn) handlers.increaseBtn.removeEventListener('click', handlers.increase);
        initializedInputs.delete(input);
      }
    });
  }

  return {
    init,
    destroy
  };
})();
