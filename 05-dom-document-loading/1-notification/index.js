export default class NotificationMessage {
  static activeMessage = null;
  static timerId = null;
  constructor(message, { duration = 1000, type = "success" } = {}) {
    this.message = message;
    this.duration = duration;
    this.type = type;
    this.createElement();
  }
  get template() {
    return /*html*/ `
      <div class="notification ${this.type}" style="--value:${
      this.duration / 1000
    }s">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
          <div class="notification-body">
            ${this.message}
          </div>
        </div>
      </div>
    `;
  }
  createElement() {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = this.template;
    this.element = wrapper.firstElementChild;
  }
  show(target) {
    if (NotificationMessage.activeMessage !== null)
      NotificationMessage.activeMessage.remove();

    NotificationMessage.activeMessage = this.element;

    if (target) target.append(this.element);
    else document.body.append(this.element);

    clearTimeout(NotificationMessage.timerId);
    NotificationMessage.timerId = setTimeout(() => {
      this.remove();
      NotificationMessage.activeMessage = null;
    }, this.duration);
  }
  remove() {
    if (this.element) this.element.remove();
  }
  destroy() {
    this.remove();
  }
}
