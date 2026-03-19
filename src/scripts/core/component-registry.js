export class ComponentRegistry {
  constructor() {
    this.components = new Map();
    this.instances = new Map();
  }

  register(name, ComponentClass) {
    if (this.components.has(name)) {
      console.warn(`Component "${name}" is already registered`);
      return;
    }

    this.components.set(name, ComponentClass);
    console.log(`✓ Registered component: ${name}`);

    if (customElements.get(name)) {
      console.warn(`Custom element "${name}" already defined`);
      return;
    }

    customElements.define(name, ComponentClass);
  }

  get(name) {
    return this.components.get(name);
  }

  initAll(context = document) {
    this.components.forEach((ComponentClass, name) => {
      const elements = context.querySelectorAll(name);
      elements.forEach((element) => {
        if (!element.initialized) {
          this.initInstance(element, name, ComponentClass);
        }
      });
    });
  }

  initInContext(context) {
    this.initAll(context);
  }

  initInstance(element, name, ComponentClass) {
    const instanceId = this.generateInstanceId(name);
    element.setAttribute('data-instance-id', instanceId);
    element.initialized = true;

    this.instances.set(instanceId, {
      element,
      component: ComponentClass,
      name
    });
  }

  destroyInstance(instanceId) {
    const instance = this.instances.get(instanceId);
    if (instance && instance.element.disconnectedCallback) {
      instance.element.disconnectedCallback();
    }
    this.instances.delete(instanceId);
  }

  generateInstanceId(name) {
    return `${name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  clear() {
    this.instances.forEach((instance, id) => {
      this.destroyInstance(id);
    });
    this.instances.clear();
  }
}
