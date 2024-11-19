export class Modal {
  private modalElement: HTMLElement;
  private contentContainer: HTMLElement;

  constructor() {
    this.modalElement = document.createElement('div');
    this.modalElement.classList.add('modal');

    // Контейнер для содержимого модального окна
    const container = document.createElement('div');
    container.classList.add('modal__container');
    this.modalElement.appendChild(container);

    // Кнопка закрытия модального окна
    const closeButton = document.createElement('button');
    closeButton.classList.add('modal__close');
    closeButton.setAttribute('aria-label', 'закрыть');
    closeButton.addEventListener('click', () => this.close());
    container.appendChild(closeButton);

    // Контейнер для пользовательского контента
    this.contentContainer = document.createElement('div');
    this.contentContainer.classList.add('modal__content');
    container.appendChild(this.contentContainer);

    // Добавляем модальное окно в DOM
    document.body.appendChild(this.modalElement);

    // Закрытие окна при клике вне контейнера
    this.modalElement.addEventListener('click', (event) => this.handleOutsideClick(event, container));
  }

  //Обрабатывает клик вне модального окна и закрывает его.
  private handleOutsideClick(event: MouseEvent, container: HTMLElement): void {
    if (!container.contains(event.target as Node)) {
      this.close();
    }
  }

  // Устанавливает содержимое модального окна.
  setContent(content: HTMLElement | string): void {
    if (typeof content === 'string') {
      this.contentContainer.innerHTML = content;
    } else {
      this.contentContainer.innerHTML = '';
      this.contentContainer.appendChild(content);
    }
  }

  // Возвращает контейнер содержимого модального окна.
  getContent(): HTMLElement {
    return this.contentContainer;
  }

  // Открывает модальное окно, закрывая другие активные модальные окна.
  open(): void {
    const activeModal = document.querySelector('.modal_active');
    if (activeModal) {
      activeModal.classList.remove('modal_active');
    }
    this.modalElement.classList.add('modal_active');
  }

  //Закрывает текущее модальное окно.
  close(): void {
    this.modalElement.classList.remove('modal_active');
  }
}
