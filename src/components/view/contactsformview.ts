import { EventEmitter } from "../base/events";

export class ContactsFormView {
  private formElement: HTMLElement;
  private submitButton: HTMLButtonElement;
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private events: EventEmitter;

  constructor(template: HTMLTemplateElement, events: EventEmitter) {
    const content = template.content.cloneNode(true) as DocumentFragment;
    this.events = events;
    this.formElement = content.querySelector('.form')!;
    this.submitButton = this.formElement.querySelector('.button')!;
    this.emailInput = this.formElement.querySelector('input[placeholder="Введите Email"]')!;
    this.phoneInput = this.formElement.querySelector('input[placeholder="+7 ("]')!;
  }

  //Отрисовывает форму и добавляет обработчики событий.
  render(): HTMLElement {
    this.attachListeners();
    return this.formElement;
  }

  // Устанавливает обработчики событий для формы.
  private attachListeners(): void {
    // Обработчик отправки формы
    this.formElement.addEventListener('submit', (event) => {
      event.preventDefault();
      this.onSubmit();
    });

    // Обновляет состояние кнопки отправки при изменении полей ввода
    const updateSubmitButtonState = () => {
      this.submitButton.disabled = !this.validateInputs();
    };

    this.emailInput.addEventListener('input', updateSubmitButtonState);
    this.phoneInput.addEventListener('input', updateSubmitButtonState);
  }

  //Проверяет валидность введенных данных.
  private validateInputs(): boolean {
    const emailValid = this.validateEmail(this.emailInput.value);
    const phoneValid = this.validatePhone(this.phoneInput.value);
    return emailValid && phoneValid;
  }

  //Проверяет валидность email.
  private validateEmail(email: string): boolean {
    return email.includes('@');
  }

  // Проверяет валидность телефона.
  private validatePhone(phone: string): boolean {
    const cleanedPhone = phone.replace(/\D/g, ''); // Убираем все нечисловые символы
    return /^[+\d\s()-]*$/.test(phone) && cleanedPhone.length >= 11;
  }

  // Обрабатывает отправку формы.
  private onSubmit(): void {
    if (this.validateInputs()) {
      this.events.emit('order:confirmOrder');
    }
  }

  //Возвращает значения полей ввода.
  getValues(): { email: string; phone: string } {
    return {
      email: this.emailInput.value.trim(),
      phone: this.phoneInput.value.trim(),
    };
  }
}
