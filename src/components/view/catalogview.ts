import { IProduct } from "../../types";
import { CDN_URL } from "../../utils/constants";


export class CatalogView {
  private container: HTMLElement;
  private template: HTMLTemplateElement;
  private productClickHandler: (productId: string) => void = () => {};

  constructor(container: HTMLElement, template: HTMLTemplateElement) {
    this.container = container;
    this.template = template;
  }

  // Отображает каталог товаров.
  renderCatalog(items: IProduct[]): void {
    // Очищаем контейнер перед отрисовкой
    this.container.innerHTML = '';

    // Создаем карточки товаров и добавляем их в контейнер
    items.forEach((item) => {
      const cardElement = this.createCardElement(item);
      this.container.appendChild(cardElement);
    });

    // Устанавливаем обработчик кликов для всего контейнера
    this.container.addEventListener('click', this.handleCardClick.bind(this));
  }

  // Устанавливает обработчик кликов по товарам.
  setProductClickHandler(handler: (productId: string) => void): void {
    this.productClickHandler = handler;
  }

  // Создает элемент карточки товара.
  private createCardElement(product: IProduct): HTMLElement {
    // Клонируем содержимое шаблона
    const element = this.template.content.cloneNode(true) as DocumentFragment;
    const card = element.querySelector('.gallery__item') as HTMLElement;

    // Устанавливаем данные товара
    card.dataset.id = product.id;
    const cardCategory = card.querySelector('.card__category')
    if(product.category == "софт-скил") {
      cardCategory.classList.add('card__category_soft');
    } else if (product.category == "другое") {
      cardCategory.classList.add('card__category_other');
    } else if (product.category == "дополнительное") {
      cardCategory.classList.add('card__category_additional');
    } else if (product.category == "кнопка") {
      cardCategory.classList.add('card__category_button');
    } else if (product.category == "хард-скил") {
      cardCategory.classList.add('card__category_hard');
    }
    cardCategory.textContent = product.category;

    card.querySelector('.card__title')!.textContent = product.title;
    card.querySelector('.card__price')!.textContent = `${product.price || '0'} синапсов`;

    // Устанавливаем изображение товара
    const imageEl = card.querySelector('.card__image') as HTMLImageElement;
    if (product.image) {
      imageEl.src = `${CDN_URL}${product.image}`;
      imageEl.alt = product.title;
    }

    return card;
  }

  // Обработчик кликов по карточкам товаров.
  private handleCardClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const card = target.closest('.gallery__item') as HTMLElement;

    if (card) {
      const productId = card.dataset.id;
      if (productId) this.productClickHandler(productId);
    }
  }
}
