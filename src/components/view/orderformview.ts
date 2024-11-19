import { Payment } from "../../types";
import { EventEmitter } from "../base/events";

export class OrderFormView {
  private formElement: HTMLElement;
  private submitButton: HTMLButtonElement;
  private paymentButtons: NodeListOf<HTMLButtonElement>;
  private addressInput: HTMLInputElement;
  private events: EventEmitter;
  private selectedPayment: Payment | null = null;

  constructor(template: HTMLTemplateElement, events: EventEmitter) {
    const content = template.content.cloneNode(true) as HTMLElement;

    // Инициализация элементов формы
    this.formElement = content.querySelector('.form')!;
    this.submitButton = this.formElement.querySelector('.order__button')!;
    this.paymentButtons = this.formElement.querySelectorAll('.button_alt');
    this.addressInput = this.formElement.querySelector('input[placeholder="Введите адрес"]')!;
    this.events = events;

    // Устанавливаем начальное состояние кнопки отправки
    this.submitButton.disabled = true;
  }

  // Отображает форму заказа и прикрепляет обработчики событий.
  render(): HTMLElement {
    this.attachListeners();
    return this.formElement;
  }

  // Добавляет обработчики событий к элементам формы.
  private attachListeners(): void {
    // Обработчик отправки формы
    this.formElement.addEventListener('submit', (event) => {
      event.preventDefault();
      this.onSubmit();
    });

    // Обновление состояния кнопки отправки при изменении выбора оплаты или адреса
    const updateSubmitButtonState = () => {
      const isValid = this.selectedPayment !== null && this.addressInput.value.trim().length > 0;
      this.submitButton.disabled = !isValid;
    };

    // Обработчик выбора метода оплаты
    this.paymentButtons.forEach((button) => {
      button.addEventListener('click', () => {
        this.paymentButtons.forEach((btn) => btn.classList.remove('button_alt-activ'));
        button.classList.add('button_alt-activ');
        this.selectedPayment = button.getAttribute('name') as Payment;
        updateSubmitButtonState();
      });
    });

    // Обработчик ввода адреса доставки
    this.addressInput.addEventListener('input', updateSubmitButtonState);
  }

  // Обрабатывает отправку формы.
  private onSubmit(): void {
    if (this.selectedPayment && this.addressInput.value.trim()) {
      this.events.emit('order:nextStep');
    }
  }

  // Возвращает текущие значения формы.
  getValues(): { payment: Payment; address: string } {
    return {
      payment: this.selectedPayment,
      address: this.addressInput.value.trim(),
    };
  }
}
