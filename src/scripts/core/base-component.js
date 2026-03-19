export class BaseComponent extends HTMLElement {
  constructor() {
    super();
    this.initialized = false;
  }

  connectedCallback() {
    if (this.initialized) return;
    
    this.init();
    this.attachEventListeners();
    this.initialized = true;
  }

  disconnectedCallback() {
    this.cleanup();
  }

  init() {
  }

  attachEventListeners() {
  }

  cleanup() {
  }

  $(selector) {
    return this.querySelector(selector);
  }

  $$(selector) {
    return this.querySelectorAll(selector);
  }

  on(event, selector, handler) {
    if (typeof selector === 'function') {
      handler = selector;
      this.addEventListener(event, handler);
    } else {
      this.addEventListener(event, (e) => {
        if (e.target.matches(selector)) {
          handler.call(e.target, e);
        }
      });
    }
  }

  emit(eventName, detail = {}) {
    const event = new CustomEvent(eventName, {
      detail,
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }

  attr(name, value = null) {
    if (value === null) {
      return this.getAttribute(name);
    }
    this.setAttribute(name, value);
  }

  hasAttr(name) {
    return this.hasAttribute(name);
  }

  removeAttr(name) {
    this.removeAttribute(name);
  }

  addClass(...classes) {
    this.classList.add(...classes);
  }

  removeClass(...classes) {
    this.classList.remove(...classes);
  }

  toggleClass(className) {
    this.classList.toggle(className);
  }

  hasClass(className) {
    return this.classList.contains(className);
  }
}
