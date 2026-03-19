export class SectionRegistry {
  constructor() {
    this.sections = new Map();
    this.instances = new Map();
  }

  register(type, SectionClass) {
    if (this.sections.has(type)) {
      console.warn(`Section type "${type}" is already registered`);
      return;
    }

    this.sections.set(type, SectionClass);
    console.log(`✓ Registered section: ${type}`);
  }

  get(type) {
    return this.sections.get(type);
  }

  initAll(context = document) {
    const sectionElements = context.querySelectorAll('[data-section-id]');
    sectionElements.forEach((element) => {
      this.init(element);
    });
  }

  init(element) {
    const sectionId = element.getAttribute('data-section-id');
    const sectionType = element.getAttribute('data-section-type');

    if (!sectionId || !sectionType) {
      return;
    }

    if (this.instances.has(sectionId)) {
      console.log(`Section ${sectionId} already initialized`);
      return;
    }

    const SectionClass = this.sections.get(sectionType);

    if (!SectionClass) {
      return;
    }

    try {
      const instance = new SectionClass(element);
      this.instances.set(sectionId, {
        instance,
        element,
        type: sectionType
      });

      if (typeof instance.init === 'function') {
        instance.init();
      }

      console.log(`✓ Initialized section: ${sectionType} (${sectionId})`);
    } catch (error) {
      console.error(`Failed to initialize section ${sectionType}:`, error);
    }
  }

  destroy(sectionId) {
    const section = this.instances.get(sectionId);

    if (!section) {
      return;
    }

    if (typeof section.instance.destroy === 'function') {
      section.instance.destroy();
    }

    this.instances.delete(sectionId);
    console.log(`✓ Destroyed section: ${sectionId}`);
  }

  getInstance(sectionId) {
    const section = this.instances.get(sectionId);
    return section ? section.instance : null;
  }

  clear() {
    this.instances.forEach((section, id) => {
      this.destroy(id);
    });
    this.instances.clear();
  }
}
