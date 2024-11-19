import { IProduct } from "../../types";
import { Modal } from "./modal";

export class CartView {
  private modal: Modal;
  private template: HTMLTemplateElement;

  constructor(template: HTMLTemplateElement) {
    this.modal = new Modal();
    this.template = template;
  }

  // Отображает содержимое корзины в модальном окне.
  renderCart(items: IProduct[], total: number): void {
    const content = this.modal.getContent();

    // Если элементов корзины еще нет, создаем их структуру
    if (!content.querySelector('.basket__list')) {
      const basketList = document.createElement('ul');
      basketList.classList.add('basket__list');
      content.appendChild(basketList);

      const actions = document.createElement('div');
      actions.classList.add('modal__actions');
      actions.innerHTML = `
        <button class="button checkout-button">Оформить</button>
        <span class="basket__price">${total} синапсов</span>
      `;
      content.appendChild(actions);
    }

    const basketList = content.querySelector('.basket__list') as HTMLElement;
    const totalPrice = content.querySelector('.basket__price') as HTMLElement;
    const checkoutButton = content.querySelector('.checkout-button') as HTMLButtonElement;

    // Очищаем содержимое списка товаров
    basketList.innerHTML = '';

    // Добавляем товары в список
    items.forEach((item, index) => {
      const listItem = this.createBasketItem(item, index + 1);
      basketList.appendChild(listItem);
    });

    // Обновляем общую сумму
    if (totalPrice) totalPrice.textContent = `${total} синапсов`;

    // Деактивируем кнопку оформления заказа, если корзина пуста
    if (checkoutButton) checkoutButton.disabled = total === 0;

    // Открываем модальное окно
    this.modal.open();
  }

  // Обновляет общую сумму корзины.
  updateTotal(total: number): void {
    const totalPrice = this.modal.getContent().querySelector('.basket__price') as HTMLElement;
    if (totalPrice) totalPrice.textContent = `${total} синапсов`;
  }

  // Создает элемент списка для товара в корзине.
  private createBasketItem(product: IProduct, index: number): HTMLElement {
    const listItem = document.createElement('li');
    listItem.classList.add('basket__item', 'card', 'card_compact');
    listItem.dataset.id = product.id;

    listItem.innerHTML = `
      <span class="basket__item-index">${index}</span>
      <span class="card__title">${product.title}</span>
      <span class="card__price">${product.price || '0'} синапсов</span>
      <button class="basket__item-delete" aria-label="удалить"></button>
    `;

    return listItem;
  }

  // Устанавливает обработчик удаления товаров из корзины.
  setRemoveHandler(handler: (productId: string) => void): void {
    this.modal.getContent().addEventListener('click', (event) => {
      const target = event.target as HTMLElement;

      if (target.classList.contains('basket__item-delete')) {
        event.stopPropagation();
        const item = target.closest('.basket__item') as HTMLElement;

        if (item?.dataset.id) {
          handler(item.dataset.id);
        }
      }
    });
  }

  // Устанавливает обработчик оформления заказа.
  setCheckoutHandler(handler: () => void): void {
    const content = this.modal.getContent();
    const checkoutButton = content.querySelector('.checkout-button') as HTMLButtonElement;

    if (!checkoutButton) return;

    // Удаляем предыдущие обработчики и добавляем новый
    checkoutButton.replaceWith(checkoutButton.cloneNode(true));
    const newCheckoutButton = content.querySelector('.checkout-button') as HTMLButtonElement;

    newCheckoutButton.addEventListener('click', handler);
  }
}
