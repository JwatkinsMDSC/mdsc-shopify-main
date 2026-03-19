/**
 * B2B Countdown Timer JavaScript
 * Handles countdown timer functionality
 */

document.addEventListener('DOMContentLoaded', function() {
  initializeCountdownTimers();
  initializeCartCountdown();
});

/**
 * Initialize all countdown timers on the page
 */
function initializeCountdownTimers() {
  const timers = document.querySelectorAll('[data-countdown-timer]');
  
  timers.forEach(timer => {
    const endDateStr = timer.dataset.endDate;
    if (!endDateStr) return;
    
    const endDate = new Date(endDateStr);
    
    // Update immediately
    updateCountdown(timer, endDate);
    
    // Update every second
    const interval = setInterval(() => {
      const isExpired = updateCountdown(timer, endDate);
      
      if (isExpired) {
        clearInterval(interval);
        timer.classList.add('expired');
      }
    }, 1000);
  });
}

/**
 * Update countdown timer display
 * Returns true if timer has expired
 */
function updateCountdown(timer, endDate) {
  const now = new Date();
  const timeLeft = endDate - now;
  
  if (timeLeft <= 0) {
    setCountdownValues(timer, 0, 0, 0, 0);
    return true;
  }
  
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  
  setCountdownValues(timer, days, hours, minutes, seconds);
  
  return false;
}

/**
 * Set countdown timer values in the DOM
 */
function setCountdownValues(timer, days, hours, minutes, seconds) {
  const daysEl = timer.querySelector('[data-countdown-days]');
  const hoursEl = timer.querySelector('[data-countdown-hours]');
  const minutesEl = timer.querySelector('[data-countdown-minutes]');
  const secondsEl = timer.querySelector('[data-countdown-seconds]');
  
  if (daysEl) {
    daysEl.textContent = padZero(days);
  }
  
  if (hoursEl) {
    hoursEl.textContent = padZero(hours);
  }
  
  if (minutesEl) {
    minutesEl.textContent = padZero(minutes);
  }
  
  if (secondsEl) {
    secondsEl.textContent = padZero(seconds);
  }
}

/**
 * Pad number with leading zero
 */
function padZero(num) {
  return num.toString().padStart(2, '0');
}

/**
 * Initialize cart countdown timer (uses CSS variables)
 */
function initializeCartCountdown() {
  const cartCountdown = document.getElementById('b2b-cart-countdown');
  if (!cartCountdown) return;
  
  const endDate = new Date('2025-12-31T00:00:00');
  
  function tick() {
    const now = new Date();
    let diff = Math.max(0, endDate - now);
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    const seconds = Math.floor(diff / 1000) % 60;
    
    const daysEl = cartCountdown.querySelector('[data-days]');
    const hoursEl = cartCountdown.querySelector('[data-hours]');
    const minEl = cartCountdown.querySelector('[data-min]');
    const secEl = cartCountdown.querySelector('[data-sec]');
    
    if (daysEl) {
      daysEl.style.setProperty('--value', days);
      daysEl.textContent = days;
    }
    if (hoursEl) {
      hoursEl.style.setProperty('--value', hours);
      hoursEl.textContent = hours;
    }
    if (minEl) {
      minEl.style.setProperty('--value', minutes);
      minEl.textContent = minutes;
    }
    if (secEl) {
      secEl.style.setProperty('--value', seconds);
      secEl.textContent = seconds;
    }
    
    requestAnimationFrame(tick);
  }
  
  tick();
}
