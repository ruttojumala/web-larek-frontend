import { EventEmitter } from "../base/events";
import { CartModel } from "../model/cartmodel";
import { OrderModel } from "../model/ordermodel";
import { CartView } from "../view/cartview";
import { Modal } from "../view/modal";
import { CheckoutPresenter } from "./checkoutpresenter";

export class CartPresenter {
  private modal: Modal;
  private cartModel: CartModel;
  private orderModel: OrderModel;
  private cartView: CartView;
  private events: EventEmitter;
  private checkoutPresenter: CheckoutPresenter;

  constructor(
    modal: Modal,
    cartModel: CartModel,
    orderModel: OrderModel,
    cartView: CartView,
    events: EventEmitter,
    checkoutPresenter: CheckoutPresenter
  ) {
    this.modal = modal;
    this.cartModel = cartModel;
    this.orderModel = orderModel;
    this.cartView = cartView;
    this.events = events;
    this.checkoutPresenter = checkoutPresenter;
  }

  // Инициализирует работу корзины, включая подписку на события и настройку обработчиков.
  initialize(): void {
    // Настройка обработчиков взаимодействия с интерфейсом корзины
    this.cartView.setRemoveHandler(this.handleRemoveFromCart.bind(this));
    this.cartView.setCheckoutHandler(this.handleProceedToCheckout.bind(this));

    // Подписка на события добавления/удаления товаров в корзину
    this.events.on('cart:add', this.handleAddToCart.bind(this));
    this.events.on('cart:remove', this.handleRemoveFromCartEvent.bind(this));

    // Обработка успешного оформления заказа
    this.events.on('order:successful', () => {
      this.cartModel.clearCart();
      this.modal.close();
    });

    // Инициализация отображения количества товаров в корзине
    this.updateCartCounter();
  }

  // Добавляет товар в корзину на основе события.
  private handleAddToCart(data: { productId: string }): void {
    this.cartModel.addToCart(data.productId);
    this.updateCartCounter();
  }

  //Удаляет товар из корзины на основе события.
  private handleRemoveFromCartEvent(data: { productId: string }): void {
    this.cartModel.removeFromCart(data.productId);
    this.updateCartCounter();
  }

  // Обновляет отображение счетчика товаров в корзине.
  private updateCartCounter(): void {
    const cartCounter = document.querySelector('.header__basket-counter') as HTMLElement;
    const itemCount = this.cartModel.getCartItems().length;
    if (cartCounter) {
      cartCounter.textContent = itemCount.toString();
    }
  }

  // Удаляет товар из корзины через интерфейс и обновляет отображение.
  handleRemoveFromCart(productId: string): void {
    this.cartModel.removeFromCart(productId); // Удаление товара из модели

    // Обновление отображения корзины
    const items = this.cartModel.getCartItems();
    const total = this.cartModel.calculateTotal();
    this.cartView.renderCart(items, total);

    this.updateCartCounter();
  }

  // Переходит к процессу оформления заказа.
  handleProceedToCheckout(): void {
    if (this.cartModel.getCartItems().length === 0) {
      console.error('Корзина пуста.');
      return;
    }
    this.modal.close(); // Закрытие окна корзины
    this.checkoutPresenter.startCheckout();
  }
}