export default class SortableTable {
  element;
  subElements;

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = Array.isArray(data) ? data : data.data;
    this.render();
  }
  get template() {
    return /* html */ `
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
          ${this.getHeader()}
          ${this.getBody()}
        </div>
      </div>
    `;
  }
  getHeader() {
    return `<div data-element="header" class="sortable-table__header sortable-table__row">
      ${this.headerConfig.map((item) => this.getHeaderRow(item)).join("")}
    </div>`;
  }
  getHeaderRow({ id, title, sortable }) {
    return `
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
        <span>${title}</span>
        <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>
      </div>
    `;
  }
  getBody() {
    return `<div data-element="body" class="sortable-table__body">
      ${this.getBodyRows(this.data)}
    </div>`;
  }
  getBodyRows(data) {
    return data
      .map((item) => {
        return `
      <a href="/products/${item.id}" class="sortable-table__row">
        ${this.getBodyRow(item)}
      </a>
      `;
      })
      .join("");
  }
  getBodyRow(item) {
    const cells = this.headerConfig.map(({ id, template }) => {
      return { id, template };
    });
    return cells
      .map(({ id, template }) => {
        return template
          ? template(item[id])
          : `<div class="sortable-table__cell">${item[id]}</div>`;
      })
      .join("");
  }
  render() {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = this.template;
    this.element = wrapper.firstElementChild;
    this.subElements = this.getSubElements(this.element);
  }
  sortData(field, order) {
    const data = [...this.data];
    const vector = {
      asc: 1,
      desc: -1,
    };
    const sortOpt = this.headerConfig.find((item) => item.id === field);

    if (!sortOpt.sortable) return data;

    return data.sort((a, b) => {
      if (sortOpt.sortType === "string") {
        return (
          a[field].localeCompare(b[field], ["ru", "en"], {
            caseFirst: "upper",
          }) * vector[order]
        );
      }
      if (sortOpt.sortType === "number") {
        return (a[field] - b[field]) * vector[order];
      }
    });
  }
  sort(field, order) {
    const sortedData = this.sortData(field, order);
    const currentColumn = this.subElements.header.querySelector(
      `.sortable-table__cell[data-id=${field}]`
    );

    Array.prototype.forEach.call(this.subElements.header.children, (item) => {
      item.dataset.order = "";
    });

    currentColumn.dataset.order = order;

    this.subElements.body.innerHTML = this.getBodyRows(sortedData);
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
