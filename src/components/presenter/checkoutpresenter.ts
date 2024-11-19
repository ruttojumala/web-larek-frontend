import { Payment, Templates } from "../../types";
import { Api } from "../base/api";
import { EventEmitter } from "../base/events";
import { CartModel } from "../model/cartmodel";
import { OrderModel } from "../model/ordermodel";
import { ContactsFormView } from "../view/contactsformview";
import { Modal } from "../view/modal";
import { OrderFormView } from "../view/orderformview";
import { SuccessView } from "../view/successview";

export class CheckoutPresenter {
  private modal: Modal;
  private orderModel: OrderModel;
  private cartModel: CartModel;
  private events: EventEmitter;
  private currentStep = 1;
  private orderFormView: OrderFormView;
  private contactsFormView: ContactsFormView;
  private api: Api;
  private successView: SuccessView;

  constructor(
    modal: Modal,
    orderModel: OrderModel,
    cartModel: CartModel,
    templates: Templates,
    events: EventEmitter,
    api: Api,
    successView: SuccessView
  ) {
    this.modal = modal;
    this.orderModel = orderModel;
    this.cartModel = cartModel;
    this.events = events;
    this.orderFormView = new OrderFormView(templates.order, this.events);
    this.contactsFormView = new ContactsFormView(templates.contacts, this.events);
    this.api = api;
    this.successView = successView;
  }

  //Инициализирует процесс оформления заказа.
  initialize(): void {
    this.renderCurrentStep();
    this.events.on('order:nextStep', this.handleNextStep.bind(this));
    this.events.on('order:confirmOrder', this.handleConfirmOrder.bind(this));
  }

  //Отображает текущий шаг оформления заказа в модальном окне.
  private renderCurrentStep(): void {
    if (this.currentStep === 1) {
      this.modal.setContent(this.orderFormView.render());
    } else if (this.currentStep === 2) {
      this.modal.setContent(this.contactsFormView.render());
    }
  }

  //Устанавливает адрес доставки в модель заказа.
  private handleSetDeliveryAddress(address: string): void {
    this.orderModel.setDeliveryAddress(address);
  }

  // Устанавливает способ оплаты в модель заказа.
  private handleSetPaymentMethod(payment: Payment): void {
    this.orderModel.setPaymentMethod(payment);
  }

  // Устанавливает контактную информацию в модель заказа.
  private handleSetContactInfo(email: string, phone: string): void {
    this.orderModel.setContactInfo(email, phone);
  }

  //Проверяет корректность адреса доставки.
  private validateAddress(): boolean {
    const { address } = this.orderFormView.getValues();
    return !!address.trim();
  }

  // Проверяет корректность контактной информации.
  private validateContactInfo(): boolean {
    const { email, phone } = this.contactsFormView.getValues();
    return email.includes('@') && phone.length > 10;
  }

  // Переход к следующему шагу оформления заказа.
  private handleNextStep(): void {
    if (this.currentStep === 1 && this.validateAddress()) {
      const { payment, address } = this.orderFormView.getValues();
      if (['card', 'cash'].includes(payment)) {
        this.handleSetDeliveryAddress(address);
        this.handleSetPaymentMethod(payment as Payment);
        this.currentStep = 2;
        this.renderCurrentStep();
      } else {
        console.error('Некорректный способ оплаты.');
      }
    }
  }

  // Подтверждает заказ и отправляет его на сервер.
  private handleConfirmOrder(): void {
    if (this.currentStep === 2 && this.validateContactInfo()) {
      const { email, phone } = this.contactsFormView.getValues();
      this.handleSetContactInfo(email, phone);

      this.modal.setContent('<h2>Оформляем ваш заказ...</h2>');

      this.api.orderProducts(this.orderModel.getOrder())
        .then((response) => {
          if (response.total) {
            this.successView.render(response.total);
            this.events.emit('order:successful');
            this.cartModel.clearCart();
          } else {
            this.modal.setContent('<h2>Произошла ошибка. Попробуйте снова.</h2>');
          }
        })
        .catch((error) => {
          console.error('Ошибка при оформлении заказа:', error);
          this.modal.setContent('<h2>Ошибка сервера.</h2>');
        });
    }
  }

  // Запускает процесс оформления заказа.
  startCheckout(): void {
    this.orderModel.setTotal(this.cartModel.calculateTotal());
    this.orderModel.setItems(this.cartModel.getCartItems());
    this.currentStep = 1;
    this.renderCurrentStep();
    this.modal.open();
  }
}
