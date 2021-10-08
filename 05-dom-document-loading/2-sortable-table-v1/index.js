export default class SortableTable {
  constructor(headerConfig = [], { data = [] } = {}) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.render();
    ///console.log(headerConfig, data);
  }
  get template() {
    return /* html */ `
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
          <div data-element="header" class="sortable-table__header sortable-table__row">
            ${this.headerConfig
              .map(({ id, title, sortable }) => {
                return `
                <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-order="asc">
                  <span>${title}</span>
                </div>
                `;
              })
              .join("")}
          </div>
          <div data-element="body" class="sortable-table__body">
          ${this.data
            .map(({ id, images, title, quantity, price, sales }) => {
              return `
                <a href="/products/${id}" class="sortable-table__row">
                  <div class="sortable-table__cell">
                    <img class="sortable-table-image" alt="Image" src="${
                      images && images[0].url
                    }">
                  </div>
                  <div class="sortable-table__cell">${title}</div>

                  <div class="sortable-table__cell">${quantity}</div>
                  <div class="sortable-table__cell">${price}</div>
                  <div class="sortable-table__cell">${sales}</div>
                </a>
                `;
            })
            .join("")}
          </div>
          <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
          <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
            <div>
              <p>No products satisfies your filter criteria</p>
              <button type="button" class="button-primary-outline">Reset all filters</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  render() {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = this.template;
    this.element = wrapper.firstElementChild;
    this.subElements = this.getSubElements(this.element);
  }
  sort(field, order) {
    const vector = {
      asc: 1,
      desc: -1,
    };
    const sortOpt = this.headerConfig.find((item) => item.id === field);

    if (!sortOpt.sortable) return;

    this.data.sort((a, b) => {
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

    this.subElements.header.innerHTML = this.headerConfig
      .map(({ id, title, sortable }) => {
        return `
        <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-order="${order}">
          <span>${title}</span>
           ${
             field === id
               ? `<span data-element="arrow" class="sortable-table__sort-arrow">
                    <span class="sort-arrow"></span>
                  </span>`
               : ``
           }
        </div>
        `;
      })
      .join("");

    this.subElements.body.innerHTML = this.data
      .map(({ id, images, title, quantity, price, sales }) => {
        return `
          <a href="/products/${id}" class="sortable-table__row">
            <div class="sortable-table__cell">
              <img class="sortable-table-image" alt="Image" src="${
                images && images[0].url
              }">
            </div>
            <div class="sortable-table__cell">${title}</div>

            <div class="sortable-table__cell">${quantity}</div>
            <div class="sortable-table__cell">${price}</div>
            <div class="sortable-table__cell">${sales}</div>
          </a>
          `;
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
    this.element.remove();
  }
  destroy() {
    this.remove();
  }
}
