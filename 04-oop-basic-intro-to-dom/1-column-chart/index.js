export default class ColumnChart {
  constructor({
    data = [],
    label = "",
    value = 0,
    link = "",
    chartHeight = 50,
    formatHeading = null,
  } = {}) {
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.chartHeight = chartHeight;
    this.formatHeading = formatHeading;
    this.render();
  }
  render() {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
        <div class="column-chart${
          this.data.length === 0 ? " column-chart_loading" : ""
        }" style="--chart-height: ${this.chartHeight}">
          <div class="column-chart__title">
            Total ${this.label}
            ${
              this.link
                ? `<a href="/${this.label}" class="column-chart__link">View all</a>`
                : ``
            }
          </div>
          <div class="column-chart__container">
            <div data-element="header" class="column-chart__header">
              ${
                this.formatHeading ? this.formatHeading(this.value) : this.value
              }
            </div>
            <div data-element="body" class="column-chart__chart">
              ${this.getColumnProps(this.data)
                .map(({ percent, value }) => {
                  return `<div style="--value: ${value}" data-tooltip="${percent}"></div>`;
                })
                .join("")}
            </div>
          </div>
        </div>`;
    this.element = wrapper.firstElementChild;
  }
  update() {
    let wrapper = document.createElement("div");
    let container = this.element.querySelector(".column-chart__chart");
    wrapper.innerHTML = this.getColumnProps(this.data)
      .map(({ percent, value }) => {
        return `<div style="--value: ${value}" data-tooltip="${percent}"></div>`;
      })
      .join("");
    container.append(wrapper.firstElementChild);
  }
  remove() {
    this.element.remove();
  }
  destroy() {
    this.remove();
  }
  getColumnProps(data) {
    const maxValue = Math.max(...data);
    const scale = 50 / maxValue;

    return data.map((item) => {
      return {
        percent: ((item / maxValue) * 100).toFixed(0) + "%",
        value: String(Math.floor(item * scale)),
      };
    });
  }
}
