/**
 * Form Helpers
 *
 * Purpose:
 * Provide consistent, accessible, and declarative
 * UX enhancements for HTML forms.
 *
 * Form helpers reduce boilerplate by handling
 * common interaction patterns such as:
 * - Preventing double submission
 * - Managing submit button state
 * - Focusing the first invalid field
 *
 * This module:
 * - Does NOT perform validation
 * - Does NOT submit forms
 * - Does NOT handle business logic
 *
 * It only improves form behavior and usability.
 *
 * Usage:
 *   Import once in global.js:
 *
 *     import './core/ui/form-helpers';
 *
 *   Author forms using:
 *     - data-form
 *     - data-submit
 */

/* ======================================================
 * SELECTORS
 * ====================================================== */

/**
 * Centralized selectors used by the form helpers.
 */
const SELECTORS = {
  form: '[data-form]',
  submit: '[data-submit]',
};

/* ======================================================
 * HELPERS
 * ====================================================== */

/**
 * Disable all submit buttons within a form.
 *
 * @param {HTMLFormElement} form
 */
function disableSubmit(form) {
  const buttons = form.querySelectorAll(SELECTORS.submit);

  buttons.forEach(button => {
    button.disabled = true;
    button.classList.add('is-loading');
  });
}

/**
 * Enable all submit buttons within a form.
 *
 * @param {HTMLFormElement} form
 */
function enableSubmit(form) {
  const buttons = form.querySelectorAll(SELECTORS.submit);

  buttons.forEach(button => {
    button.disabled = false;
    button.classList.remove('is-loading');
  });
}

/**
 * Focus the first invalid field inside a form.
 *
 * Uses aria-invalid or native :invalid state.
 *
 * @param {HTMLFormElement} form
 */
function focusFirstInvalidField(form) {
  const invalid =
    form.querySelector('[aria-invalid="true"]') ||
    form.querySelector(':invalid');

  if (invalid && typeof invalid.focus === 'function') {
    invalid.focus();
  }
}

/* ======================================================
 * INITIALIZATION
 * ====================================================== */

/**
 * Initialize form helpers within a given context.
 *
 * This function is:
 * - Idempotent
 * - Shopify section reload safe
 *
 * @param {Document|HTMLElement} context
 */
function initFormHelpers(context = document) {
  const forms = context.querySelectorAll(SELECTORS.form);

  forms.forEach(form => {
    if (form.__formHelpersBound) return;
    form.__formHelpersBound = true;

    // On submit: disable submit buttons
    form.addEventListener('submit', () => {
      disableSubmit(form);
    });

    // On reset: re-enable submit buttons
    form.addEventListener('reset', () => {
      enableSubmit(form);
    });

    // On invalid: focus first invalid field
    form.addEventListener(
      'invalid',
      (e) => {
        e.preventDefault();
        focusFirstInvalidField(form);
        enableSubmit(form);
      },
      true
    );
  });
}

/* ======================================================
 * LIFECYCLE HOOKS (DAWN-GRADE)
 * ====================================================== */

/**
 * Initial page load
 */
document.addEventListener('DOMContentLoaded', () => {
  initFormHelpers();
});

/**
 * Shopify section reload support
 */
document.addEventListener('shopify:section:load', (e) => {
  initFormHelpers(e.target);
});
