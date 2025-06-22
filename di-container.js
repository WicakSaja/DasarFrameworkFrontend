class DIContainer {
  constructor() {
    this.factories = {};
    this.instances = {};
  }

  register(name, factoryFn) {
    this.factories[name] = factoryFn;
  }

  get(name) {
    if (!this.instances[name]) {
      const factory = this.factories[name];
      if (!factory) throw new Error(`Service '${name}' not registered`);
      this.instances[name] = factory(this);
    }
    return this.instances[name];
  }
}
