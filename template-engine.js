class TemplateEngine {
  constructor(state = {}, rootElement, di) {
    this.state = state;
    this.root = rootElement;
    this.di = di;

    for (const key in di.factories) {
      Object.defineProperty(this.state, key, {
        get: () => di.get(key),
      });
    }

    this.initBindings();
    this.updateView();
  }

  initBindings() {
    const inputs = this.root.querySelectorAll("[data-model]");
    inputs.forEach((input) => {
      const key = input.getAttribute("data-model");
      input.value = this.state[key] || "";
      input.addEventListener("input", () => {
        this.state[key] = input.value;
        this.updateView();
      });
    });
  }

  updateView() {
    const bound = this.root.querySelectorAll("[data-bind]");
    bound.forEach((el) => {
      const expr = el.getAttribute("data-bind");
      try {
        const func = new Function(...Object.keys(this.state), `return ${expr}`);
        el.textContent = func(...Object.values(this.state));
      } catch {
        el.textContent = "";
      }
    });

    const inputs = this.root.querySelectorAll("[data-model]");
    inputs.forEach((input) => {
      const key = input.getAttribute("data-model");
      if (document.activeElement !== input) {
        input.value = this.state[key] || "";
      }
    });
  }

  set(key, value) {
    this.state[key] = value;
    this.updateView();
  }
}
