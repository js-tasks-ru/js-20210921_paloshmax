const BACKEND_URL = "https://course-js.javascript.ru";

export default class ColumnChart {
  element;
  subElements;
  chartHeight = 50;

  constructor({
    url = "",
    range = {
      from: new Date(),
      to: new Date(),
    },
    label = "",
    link = "",
    formatHeading = (data) => data,
  } = {}) {
    this.url = new URL(url, BACKEND_URL);
    this.range = range;
    this.label = label;
    this.link = link;
    this.formatHeading = formatHeading;
    this.render();
    this.update(this.range.from, this.range.to);
  }
  get template() {
    return `
      <div class="column-chart column-chart_loading" style="--chart-height: ${
        this.chartHeight
      }">
        <div class="column-chart__title">${this.getTitle(this.label)}</div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header"></div>
          <div data-element="body" class="column-chart__chart"></div>
        </div>
      </div>`;
  }
  render() {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = this.template;
    this.element = wrapper.firstElementChild;
    this.subElements = this.getSubElements(this.element);
  }
  async update(from, to) {
    this.element.classList.add("column-chart_loading");
    this.url.searchParams.set("from", from.toISOString());
    this.url.searchParams.set("to", to.toISOString());
    const data = await this.loadData(this.url);

    this.setRange(from, to);

    if (data && Object.values(data).length) {
      this.subElements.header.innerHTML = this.getHeader(data);
      this.subElements.body.innerHTML = this.getBody(data);
      this.element.classList.remove("column-chart_loading");
    }

    return data;
  }
  async loadData(url) {
    const response = await fetch(url.toString());
    if (response.ok) {
      return response.json();
    } else throw Error(response.status);
  }
  setRange(from, to) {
    this.range.from = from;
    this.range.to = to;
  }
  getHeader(data) {
    return this.formatHeading(
      Object.values(data).reduce((acc, item) => (acc += item), 0)
    );
  }
  getTitle(label) {
    return `Total ${label}${this.getLink()}`;
  }
  getLink() {
    return this.link
      ? `<a href="/${this.label}" class="column-chart__link">View all</a>`
      : ``;
  }
  getBody(data) {
    const maxValue = Math.max(...Object.values(data));
    const scale = this.chartHeight / maxValue;

    return Object.values(data)
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
