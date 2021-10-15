export default class SortableTable {
  element;
  subElements;

  sortClickHandler = (event) => {
    const target = event.target.closest(".sortable-table__cell");
    if (target) {
      const value =
        !target.dataset.order || target.dataset.order === "asc"
          ? "desc"
          : "asc";
      this.sort(target.dataset.id, value);
    }
  };
  constructor(
    headerConfig = [],
    {
      data = [],
      sorted = {
        id: headerConfig.find((item) => item.sortable).id,
        order: "asc",
      },
    } = {}
  ) {
    this.headerConfig = headerConfig;
    this.data = Array.isArray(data) ? data : data.data;
    this.sorted = sorted;
    this.sortedData = [];
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
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}"${this.getSortedField(
      id
    )}>
        <span>${title}</span>
        <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>
      </div>
    `;
  }
  getBody() {
    return `<div data-element="body" class="sortable-table__body">
      ${this.getBodyRows(this.sortedData)}
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
  getSortedField(id) {
    return this.sorted.id === id ? "data-order=" + this.sorted.order : "";
  }
  render() {
    const wrapper = document.createElement("div");
    this.sortedData = this.sortData(this.sorted.id, this.sorted.order);
    wrapper.innerHTML = this.template;
    this.element = wrapper.firstElementChild;
    this.subElements = this.getSubElements(this.element);
    this.addEventListeners();
  }
  sortData(field, order) {
    const data = [...this.data];
    const vector = {
      asc: 1,
      desc: -1,
    };
    const sortOpt = this.headerConfig.find((item) => item.id === field);

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
    const sortableItem = this.headerConfig.find(({ id }) => id === field);
    if (!sortableItem.sortable) return;

    const sortedData = this.sortData(field, order);

    [...this.subElements.header.children].forEach((item) => {
      if (item.dataset.id === field) item.dataset.order = order;
      else delete item.dataset.order;
    });

    this.subElements.body.innerHTML = this.getBodyRows(sortedData);
  }
  addEventListeners() {
    this.subElements.header.addEventListener(
      "pointerdown",
      this.sortClickHandler
    );
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
