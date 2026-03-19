/**
 * B2B Currency Menu Component
 * Handles positioning of the currency popover and updates the button text.
 */

window.B2B = window.B2B || {};

window.B2B.CurrencyMenu = (function() {
  const MENU_ID = 'b2b-header-currency-menu';
  const TRIGGER_SELECTOR = `[popovertarget="${MENU_ID}"]`;

  function updatePosition(trigger, menu) {
    const rect = trigger.getBoundingClientRect();
    
    // Reset styles to measure correctly
    menu.style.margin = '0';
    menu.style.position = 'fixed';
    menu.style.inset = 'auto'; // Reset inset
    
    const menuRect = menu.getBoundingClientRect();
    
    // Calculate position (bottom-left aligned)
    let top = rect.bottom + 8; // 8px gap
    let left = rect.left;

    // Check if it overflows the right edge of the viewport
    if (left + menuRect.width > window.innerWidth) {
      // Align to the right edge of the trigger instead
      left = rect.right - menuRect.width;
    }

    // Ensure it doesn't go off the left edge
    if (left < 8) {
        left = 8;
    }

    menu.style.top = `${top}px`;
    menu.style.left = `${left}px`;
  }

  function init(root = document) {
    const menu = root.getElementById ? root.getElementById(MENU_ID) : root.querySelector(`#${MENU_ID}`);
    // The trigger might be inside the root or outside (if root is a section)
    // But usually the header is static.
    // If root is document, we find it.
    const trigger = root.querySelector ? root.querySelector(TRIGGER_SELECTOR) : document.querySelector(TRIGGER_SELECTOR);

    if (!menu || !trigger) return;

    // Handle positioning
    // We listen for the 'toggle' event on the popover
    menu.addEventListener('toggle', (event) => {
      if (event.newState === 'open') {
        updatePosition(trigger, menu);
        
        // Add resize listener to update position if window is resized while open
        window.addEventListener('resize', () => updatePosition(trigger, menu), { once: true });
      }
    });

    // Handle currency selection text update
    const buttons = menu.querySelectorAll('button[name="country_code"]');
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        // Get the text content, e.g., "Canada (CAD $)"
        const text = button.textContent.trim();
        // Extract the currency part. The format is "Name (ISO SYMBOL)"
        // We want "ISO SYMBOL"
        const match = text.match(/\((.*?)\)$/);
        if (match && match[1]) {
            const currencyText = match[1]; // e.g. "CAD $"
            
            // Update the trigger button text
            const span = trigger.querySelector('span');
            if (span) {
                span.textContent = currencyText;
            }
        }
      });
    });
    
    // Initial position check (in case it's already open)
    if (menu.matches(':popover-open')) {
        updatePosition(trigger, menu);
    }
  }

  return {
    init
  };
})();
