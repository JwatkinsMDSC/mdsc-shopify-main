/**
 * B2B Tooltips Component
 * Handles tooltip creation, positioning, and lifecycle.
 * Uses a portal attached to document.body to avoid z-index and overflow issues.
 */

window.B2B = window.B2B || {};

window.B2B.Tooltips = (function() {
  let portalRoot;
  let floating;
  let content;
  // Use WeakMap to store event handlers for proper cleanup
  const initializedElements = new WeakMap();

  function initTooltipSystem() {
    if (!portalRoot) {
      portalRoot = document.getElementById("tooltip-root");
      if (!portalRoot) {
        portalRoot = document.createElement("div");
        portalRoot.id = "tooltip-root";
        document.body.appendChild(portalRoot);
      }
    }

    if (!floating) {
      floating = document.createElement("div");
      floating.className = "tooltip-floating";
      
      // Use Popover API if available to ensure tooltips appear above top-layer elements (like dialogs)
      if (typeof floating.showPopover === 'function') {
        floating.popover = "manual";
        // Reset default popover styles
        floating.style.margin = "0";
        floating.style.inset = "auto";
        floating.style.overflow = "visible"; // Allow arrow to overflow
        floating.style.border = "none"; // Remove default border
        floating.style.padding = "0"; // Remove default padding
        floating.style.background = "transparent"; // Remove default background
      }

      const arrow = document.createElement("div");
      arrow.className = "tooltip-floating-arrow";
      floating.appendChild(arrow);

      content = document.createElement("div");
      content.className = "tooltip-floating-content";
      floating.appendChild(content);

      portalRoot.appendChild(floating);

      // Hide tooltip on scroll
      window.addEventListener("scroll", () => {
        if (floating && floating.classList.contains("visible")) {
          floating.classList.remove("visible");
        }
      }, true);
    }
  }

  function init(container = document) {
    initTooltipSystem();

    const triggers = container.querySelectorAll(".tooltip-portal[data-tip]");
    
    triggers.forEach((trigger) => {
      if (initializedElements.has(trigger)) return;
      
      const text = trigger.getAttribute("data-tip");
      const colorVariants = ['tooltip-primary', 'tooltip-secondary', 'tooltip-info', 'tooltip-success', 'tooltip-warning', 'tooltip-danger', 'tooltip-white'];
      const colorClass = colorVariants.find(cls => trigger.classList.contains(cls));

      const show = () => {
        if (!content || !floating) return;
        
        content.textContent = text;

        colorVariants.forEach(cls => floating.classList.remove(cls));
        if (colorClass) {
          floating.classList.add(colorClass);
        }

        // Show popover if supported
        if (floating.popover === "manual") {
          try {
            floating.showPopover();
          } catch (e) {
            // Ignore if already showing
          }
        }

        const rect = trigger.getBoundingClientRect();

        floating.style.opacity = "0";
        floating.style.visibility = "visible";
        floating.style.pointerEvents = "none";

        const tipHeight = floating.offsetHeight;

        floating.style.left = rect.left + rect.width / 2 + "px";
        floating.style.top = rect.top - tipHeight - 8 + "px";

        floating.style.opacity = "";
        floating.style.visibility = "";

        floating.classList.add("visible");
      };

      const hide = () => {
        if (floating) {
          floating.classList.remove("visible");
          if (floating.popover === "manual") {
            try {
              floating.hidePopover();
            } catch (e) {
              // Ignore
            }
          }
        }
      };

      trigger.addEventListener("mouseenter", show);
      trigger.addEventListener("mouseleave", hide);
      trigger.addEventListener("focusin", show);
      trigger.addEventListener("focusout", hide);

      // Store handlers for cleanup
      initializedElements.set(trigger, { show, hide });
    });
  }

  function destroy(container = document) {
    const triggers = container.querySelectorAll(".tooltip-portal[data-tip]");
    triggers.forEach((trigger) => {
      if (initializedElements.has(trigger)) {
        const handlers = initializedElements.get(trigger);
        trigger.removeEventListener("mouseenter", handlers.show);
        trigger.removeEventListener("mouseleave", handlers.hide);
        trigger.removeEventListener("focusin", handlers.show);
        trigger.removeEventListener("focusout", handlers.hide);
        initializedElements.delete(trigger);
      }
    });
  }

  return {
    init,
    destroy
  };
})();
