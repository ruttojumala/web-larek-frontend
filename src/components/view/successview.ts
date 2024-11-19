import { EventEmitter } from "../base/events";
import { Modal } from "./modal";

export class SuccessView {
  private modal: Modal;
  private template: HTMLTemplateElement;
  private events: EventEmitter;

  constructor(template: HTMLTemplateElement, events: EventEmitter) {
    this.modal = new Modal();
    this.template = template;
    this.events = events;
  }

  // Отображает сообщение о успешной оплате.
  render(totalSpent: number): void {
    const content = this.template.content.cloneNode(true) as HTMLElement;

    const descriptionElement = content.querySelector('.order-success__description') as HTMLElement;
    const closeButton = content.querySelector('.order-success__close') as HTMLButtonElement;

    // Обновляем текст описания с учетом потраченной суммы
    if (descriptionElement) {
      descriptionElement.textContent = `Списано ${totalSpent} синапсов`;
    }

    // Добавляем обработчик на кнопку закрытия
    closeButton?.addEventListener('click', () => {
      this.modal.close();
      this.events.emit('success:close');
    });

    // Устанавливаем содержимое модального окна и открываем его
    this.modal.setContent(content);
    this.modal.open();
  }
}
