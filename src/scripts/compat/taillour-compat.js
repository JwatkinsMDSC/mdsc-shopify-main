export function initTaillourCompat() {
  window.toggleNav = function() {
    const nav = document.getElementById('header-nav');
    if (nav) {
      nav.classList.toggle('active');
    }
  };

  console.log('✓ Taillour compatibility layer loaded');
}
