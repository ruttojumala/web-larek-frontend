export class PageView {
  private rootElement: HTMLElement;

  constructor(rootElement: HTMLElement) {
    this.rootElement = rootElement;
  }

  renderPage(content: HTMLElement): void {
    // Очищаем содержимое root элемента
    this.rootElement.innerHTML = '';
    
    // Добавляем новый контент
    this.rootElement.appendChild(content);
  }
}