const BACKEND_URL = "https://course-js.javascript.ru";

export default class SortableTable {
  element;
  subElements;
  isLoading = false;

  sortClickHandler = (event) => {
    const target = event.target.closest("[data-sortable='true']");
    if (target) {
      const value =
        !target.dataset.order || target.dataset.order === "asc"
          ? "desc"
          : "asc";
      target.dataset.order = value;

      [...this.subElements.header.children].forEach((item) => {
        if (item.dataset.id === target.dataset.id) item.dataset.order = value;
        else delete item.dataset.order;
      });

      if (this.isSortLocally) {
        this.sortOnClient(target.dataset.id, value);
      } else {
        this.subElements.body.innerHTML = "";
        this.sortOnServer(target.dataset.id, value);
      }
    }
  };
  scrollLoadDataHandler = async () => {
    const bottom = this.element.getBoundingClientRect().bottom;
    if (
      bottom < document.documentElement.clientHeight &&
      !this.isLoading &&
      !this.isSortLocally
    ) {
      this.start = this.end;
      this.end = this.start + this.step;

      this.isLoading = true;

      const data = await this.loadData(
        this.sorted.id,
        this.sorted.order,
        this.start,
        this.end
      );
      this.update(data);
      this.isLoading = false;
    }
  };
  constructor(
    headerConfig = [],
    {
      url = "",
      isSortLocally = false,
      sorted = {
        id: headerConfig.find((item) => item.sortable).id,
        order: "asc",
      },
      step = 20,
      start = 0,
      end = start + step,
    } = {}
  ) {
    this.headerConfig = headerConfig;
    this.url = new URL(url, BACKEND_URL);
    this.isSortLocally = isSortLocally;
    this.sorted = sorted;
    this.step = step;
    this.start = start;
    this.end = end;
    this.render();
  }
  get template() {
    return /* html */ `
      <div class="sortable-table">
        ${this.getHeader()}
        ${this.getBody()}
        <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
        <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
          No products
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
    return `<div data-element="body" class="sortable-table__body"></div>`;
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
  addRows(data) {
    this.data = data;
    this.subElements.body.innerHTML = this.getBodyRows(data);
  }
  renderRows(data) {
    if (data.length) {
      this.element.classList.remove("sortable-table_empty");
      this.addRows(data);
    } else this.element.classList.add("sortable-table_empty");
  }
  update(data) {
    const records = document.createElement("div");
    this.data = [...this.data, ...data];
    records.innerHTML = this.getBodyRows(data);
    this.subElements.body.append(...records.childNodes);
  }
  async render() {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = this.template;
    this.element = wrapper.firstElementChild;
    this.subElements = this.getSubElements(this.element);
    const data = await this.loadData(
      this.sorted.id,
      this.sorted.order,
      this.start,
      this.end
    );
    this.renderRows(data);
    this.addEventListeners();
  }
  async loadData(id, order, start = this.start, end = this.end) {
    this.url.searchParams.set("_sort", id);
    this.url.searchParams.set("_order", order);
    this.url.searchParams.set("_start", start);
    this.url.searchParams.set("_end", end);

    this.element.classList.add("sortable-table_loading");

    const data = await this.requestData(this.url);

    this.element.classList.remove("sortable-table_loading");

    return data;
  }
  async requestData(url) {
    const response = await fetch(url.toString());
    if (response.ok) {
      return response.json();
    } else throw Error(response.status);
  }
  sortOnClient(id, order) {
    const sortedData = this.sortData(id, order);
    this.subElements.body.innerHTML = this.getBodyRows(sortedData);
  }
  async sortOnServer(id, order) {
    const data = await this.loadData(id, order, this.start, this.end);
    this.renderRows(data);
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
  addEventListeners() {
    this.subElements.header.addEventListener(
      "pointerdown",
      this.sortClickHandler
    );
    document.addEventListener("scroll", this.scrollLoadDataHandler);
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
