class SidePanel {
  element;

  onToggle = (event) => {
    const target = event.target.closest(".sidebar__nav_bottom");
    if (target) {
      document.body.classList.toggle("is-collapsed-sidebar");
    }
  };
  constructor(title = "", list = [], toggleBtnName = "Toggle sidebar") {
    this.title = title;
    this.list = list;
    this.toggleBtnName = toggleBtnName;

    this.render();
  }
  get template() {
    return `
			<aside class="sidebar">
				<h2 class="sidebar__title">
					<a href="/">${this.title}</a>
				</h2>
				<ul class="sidebar__nav">
					${this.list
            .map(({ page, text }) => {
              return `
								<li>
									<a href="/" data-page="${page}">
										<i class="icon-${page}"></i>
										<span>${text}</span>
									</a>
								</li>
							`;
            })
            .join("")}
				</ul>
				<ul class="sidebar__nav sidebar__nav_bottom">
        	<li>
        	  <button type="button" class="sidebar__toggler">
        	    <i class="icon-toggle-sidebar"></i> 
							<span>${this.toggleBtnName}</span>
        	  </button>
        	</li>
      	</ul>
			</aside>
		`;
  }
  render() {
    const element = document.createElement("div");
    element.innerHTML = this.template;
    this.element = element.firstElementChild;

    this.events("add");
  }
  events(type) {
    this.element[`${type}EventListener`]("pointerup", this.onToggle);
  }
  remove() {
    if (this.element) this.element.remove();
  }
  destroy() {
    this.remove();
    this.events("remove");
    this.element = null;
  }
}

export default SidePanel;
