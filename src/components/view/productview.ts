import { Modal } from "./modal";
import { IProduct } from "../../types";
import { CDN_URL } from "../../utils/constants";
import { EventEmitter } from "../base/events";
import { CartModel } from "../model/cartmodel";

export class ProductView {
  private modal: Modal;
  private template: HTMLTemplateElement;
  private events: EventEmitter;
  private cartModel: CartModel;

  constructor(template: HTMLTemplateElement, events: EventEmitter, cartModel: CartModel) {
    this.modal = new Modal();
    this.template = template;
    this.events = events;
    this.cartModel = cartModel;
  }

  // Отображает подробную информацию о продукте в модальном окне.
  renderProductDetails(product: IProduct): void {
    const content = this.template.content.cloneNode(true) as HTMLElement;

    // Находим элементы интерфейса
    const imageElement = content.querySelector('.card__image') as HTMLImageElement;
    const titleElement = content.querySelector('.card__title') as HTMLElement;
    const descriptionElement = content.querySelector('.card__text') as HTMLElement;
    const priceElement = content.querySelector('.card__price') as HTMLElement;
    const addButton = content.querySelector('.card__button') as HTMLButtonElement;
    const cardCategory = content.querySelector('.card__category')as HTMLButtonElement;


    // Устанавливаем данные продукта
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
    if (imageElement) {
      imageElement.src = CDN_URL + product.image;
      imageElement.alt = product.title;
    }
    if (titleElement) titleElement.textContent = product.title;
    if (descriptionElement) descriptionElement.textContent = product.description;
    if (priceElement) priceElement.textContent = `${product.price ? product.price : "0"} синапсов`;

    // Обновляем состояние кнопки в зависимости от того, добавлен ли продукт в корзину
    const updateButtonState = () => {
      const isInCart = this.cartModel.isProductAdded(product.id);
      addButton.textContent = isInCart ? 'Удалить из корзины' : 'В корзину';
    };

    updateButtonState();

    // Добавляем обработчик на кнопку добавления/удаления из корзины
    addButton.addEventListener('click', () => {
      const isInCart = this.cartModel.isProductAdded(product.id);
      if (isInCart) {
        this.events.emit('cart:remove', { productId: product.id });
      } else {
        this.events.emit('cart:add', { productId: product.id });
      }
      updateButtonState();
    });

    // Устанавливаем содержимое модального окна и открываем его
    this.modal.setContent(content);
    this.modal.open();
  }
}
