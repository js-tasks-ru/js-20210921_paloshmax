export default class ColumnChart {
  element;
  subElements;
  chartHeight = 50;

  constructor({
    data = [],
    label = "",
    value = 0,
    link = "",
    formatHeading = (data) => data,
  } = {}) {
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.formatHeading = formatHeading;
    this.render();
  }
  get template() {
    return `
      <div class="column-chart${
        this.data.length === 0 ? " column-chart_loading" : ""
      }" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">${this.getTitle(this.label)}</div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">
            ${this.getHeader(this.value)}
          </div>
          <div data-element="body" class="column-chart__chart">
            ${this.getBody(this.data)}
          </div>
        </div>
      </div>`;
  }
  render() {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = this.template;
    this.element = wrapper.firstElementChild;
    this.subElements = this.getSubElements(this.element);
  }
  update() {
    this.subElements.body.innerHTML = this.getBody(this.data);
  }
  getTitle(label) {
    return `Total ${label}${this.getLink()}`;
  }
  getLink() {
    return this.link
      ? `<a href="/${this.label}" class="column-chart__link">View all</a>`
      : ``;
  }
  getHeader(value) {
    return this.formatHeading(value);
  }
  getBody(data) {
    const maxValue = Math.max(...data);
    const scale = this.chartHeight / maxValue;

    return data
      .map((item) => {
        const percents = ((item / maxValue) * 100).toFixed(0) + "%";
        const value = Math.floor(item * scale);

        return `<div style="--value: ${value}" data-tooltip="${percents}"></div>`;
      })
      .join("");
  }
  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll("[data-element]");

    for (const sub of elements) {
      const name = sub.dataset.element;
      result[name] = sub;
    }

    return result;
  }
  remove() {
    if (this.element) this.element.remove();
  }
  destroy() {
    this.remove();
    this.element = null;
    this.subElements = null;
  }
}
