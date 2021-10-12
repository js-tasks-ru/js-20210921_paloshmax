class Tooltip {
  static instance = null;
  element;

  moveHandler = (e) => {
    this.element.style.left = e.clientX + 10 + "px";
    this.element.style.top = e.clientY + 10 + "px";
  };

  overHandler = (e) => {
    const target = e.target.closest("[data-tooltip]");
    if (!target) return;

    this.element.textContent = target.dataset.tooltip;
    document.body.append(this.element);
    document.addEventListener("pointermove", this.moveHandler);
  };

  outHandler = (e) => {
    const target = e.target.closest("[data-tooltip]");
    if (!target) return;

    this.element.remove();

    document.removeEventListener("pointermove", this.moveHandler);
  };

  constructor() {
    this.render();
    if (!Tooltip.instance) Tooltip.instance = this;
    return Tooltip.instance;
  }
  get template() {
    return `<div class="tooltip"></div>`;
  }
  render() {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = this.template;
    this.element = wrapper.firstElementChild;
  }
  initialize() {
    document.addEventListener("pointerover", this.overHandler);
    document.addEventListener("pointerout", this.outHandler);
  }
  remove() {
    if (this.element) this.element.remove();
  }
  destroy() {
    this.remove();
    this.element = null;
    Tooltip.instance = null;
  }
}

export default Tooltip;
