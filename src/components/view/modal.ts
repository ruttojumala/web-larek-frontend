export class Modal {
  private modalElement: HTMLElement;
  private overlayElement: HTMLElement;

  constructor(initialContent?: HTMLElement | string) {
    // Создаем элементы для модального окна и оверлея
    this.modalElement = document.createElement('div');
    this.modalElement.classList.add('modal');
    
    this.overlayElement = document.createElement('div');
    this.overlayElement.classList.add('overlay');

    // Добавляем оверлей и модальное окно в документ
    document.body.appendChild(this.overlayElement);
    document.body.appendChild(this.modalElement);

    // Добавляем обработчик клика на оверлей для закрытия модального окна
    this.overlayElement.addEventListener('click', () => this.close());
  }

  open(): void {
    // Отображаем модальное окно и оверлей
    this.overlayElement.style.display = 'block';
    this.modalElement.style.display = 'block';
  }

  close(): void {
    // Скрываем модальное окно и оверлей
    this.overlayElement.style.display = 'none';
    this.modalElement.style.display = 'none';
  }
}