/**
 * B2B Drag Scroll Component
 * Enables drag-to-scroll functionality for horizontal scrolling containers.
 */

window.B2B = window.B2B || {};

window.B2B.DragScroll = (function() {
  const initializedScrollers = new WeakMap();

  function init(container = document) {
    const scrollers = container.querySelectorAll('.product-card-variants');
    
    scrollers.forEach((scroller) => {
      if (initializedScrollers.has(scroller)) return;
      
      let isDown = false;
      let startX;
      let scrollLeft;
      
      const onMouseDown = (e) => {
        isDown = true;
        scroller.style.cursor = 'grabbing';
        startX = e.pageX - scroller.offsetLeft;
        scrollLeft = scroller.scrollLeft;
      };
      
      const onMouseLeave = () => {
        isDown = false;
        scroller.style.cursor = 'grab';
      };
      
      const onMouseUp = () => {
        isDown = false;
        scroller.style.cursor = 'grab';
      };
      
      const onMouseMove = (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - scroller.offsetLeft;
        const walk = (x - startX) * 2;
        scroller.scrollLeft = scrollLeft - walk;
      };

      scroller.addEventListener('mousedown', onMouseDown);
      scroller.addEventListener('mouseleave', onMouseLeave);
      scroller.addEventListener('mouseup', onMouseUp);
      scroller.addEventListener('mousemove', onMouseMove);

      // Store handlers for cleanup
      initializedScrollers.set(scroller, { onMouseDown, onMouseLeave, onMouseUp, onMouseMove });
    });
  }

  function destroy(container = document) {
    const scrollers = container.querySelectorAll('.product-card-variants');
    scrollers.forEach((scroller) => {
      if (initializedScrollers.has(scroller)) {
        const handlers = initializedScrollers.get(scroller);
        scroller.removeEventListener('mousedown', handlers.onMouseDown);
        scroller.removeEventListener('mouseleave', handlers.onMouseLeave);
        scroller.removeEventListener('mouseup', handlers.onMouseUp);
        scroller.removeEventListener('mousemove', handlers.onMouseMove);
        initializedScrollers.delete(scroller);
      }
    });
  }

  return {
    init,
    destroy
  };
})();
