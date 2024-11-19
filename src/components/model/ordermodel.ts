import { IOrder, IProduct, Payment } from "../../types";
import { CartModel } from "./cartmodel";

//Класс OrderModel управляет процессом оформления заказа, включая установку данных, проверку корректности и подтверждение.
export class OrderModel {
  private deliveryAddress: string | null = null; // Адрес доставки
  private paymentMethod: Payment | null = null; // Способ оплаты
  private contactEmail: string | null = null; // Контактная почта
  private contactPhone: string | null = null; // Контактный телефон
  private total: number = 0; // Общая сумма заказа
  private items: string[] = []; // Список ID товаров в заказе
  private cartModel: CartModel; // Модель корзины

  constructor(cartModel: CartModel) {
    this.cartModel = cartModel;
  }

  //Устанавливает адрес доставки.
  setDeliveryAddress(address: string): void {
    this.deliveryAddress = address.trim();
  }

  // Устанавливает способ оплаты.
  setPaymentMethod(payment: Payment): void {
    this.paymentMethod = payment;
  }

  // Устанавливает контактную информацию.
  setContactInfo(email: string, phone: string): void {
    this.contactEmail = email.trim();
    this.contactPhone = phone.trim();
  }

  // Устанавливает общую сумму заказа.
  setTotal(total: number): void {
    this.total = total > 0 ? total : 0; // Проверка на неотрицательное значение
  }

  // Устанавливает список товаров.
  setItems(items: IProduct[]): void {
    this.items = items
      .filter((product) => product.price != null && product.price > 0)
      .map((product) => product.id);
  }

  //Проверяет корректность адреса доставки.
  validateAddress(): boolean {
    if (!this.deliveryAddress) {
      console.error('Адрес доставки не указан.');
      return false;
    }
    return true;
  }

  // Проверяет корректность контактной информации.
  validateContactInfo(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+\d\s-]*$/;

    if (!this.contactEmail || !emailRegex.test(this.contactEmail)) {
      console.error('Некорректный email.');
      return false;
    }

    if (!this.contactPhone || !phoneRegex.test(this.contactPhone)) {
      console.error('Некорректный номер телефона.');
      return false;
    }

    return true;
  }

  //Подтверждает заказ.
  confirmOrder(): boolean {
    if (!this.validateAddress() || !this.validateContactInfo()) {
      console.error('Проверьте корректность введенных данных.');
      return false;
    }

    if (this.cartModel.getCartItems().length === 0) {
      console.error('Корзина пуста.');
      return false;
    }

    console.log('Заказ успешно оформлен!');
    return true;
  }

  // Возвращает данные заказа в виде объекта.
  getOrder(): IOrder {
    return {
      payment: this.paymentMethod,
      address: this.deliveryAddress as string,
      email: this.contactEmail as string,
      phone: this.contactPhone as string,
      total: this.total,
      items: this.items,
    };
  }
}
