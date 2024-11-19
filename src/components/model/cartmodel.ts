import { IProduct } from "../../types";

// Класс CartModel управляет корзиной покупок, позволяет добавлять, удалять товары и рассчитывать сумму.
export class CartModel {
  private items: IProduct[];
  private productsDatabase: IProduct[];

  // Создает экземпляр модели корзины.
  constructor(productsDatabase: IProduct[]) {
    this.items = [];
    this.productsDatabase = productsDatabase;
  }

  // Возвращает массив товаров, добавленных в корзину.
  getCartItems(): IProduct[] {
    return [...this.items]; // Возвращаем копию массива для избежания прямого изменения
  }

  //Добавляет товар в корзину по его ID.
  addToCart(productId: string): void {
    if (this.isProductAdded(productId)) {
      console.warn(`Товар с ID ${productId} уже находится в корзине.`);
      return;
    }

    const product = this.productsDatabase.find((item) => item.id === productId);
    if (product) {
      this.items.push(product);
      this.updateCartCounter();
    } else {
      console.error(`Товар с ID ${productId} не найден в базе данных.`);
    }
  }

  //Удаляет товар из корзины по его ID.
  removeFromCart(productId: string): void {
    const initialLength = this.items.length;
    this.items = this.items.filter((item) => item.id !== productId);

    if (this.items.length < initialLength) {
      this.updateCartCounter();
    }
  }

  //Очищает корзину, удаляя все товары.
  clearCart(): void {
    this.items = [];
    this.updateCartCounter();
  }

  //Рассчитывает общую сумму товаров в корзине.
  calculateTotal(): number {
    return this.items.reduce((total, item) => total + item.price, 0);
  }

  //Проверяет, добавлен ли товар в корзину.
  isProductAdded(productId: string): boolean {
    return this.items.some((item) => item.id === productId);
  }

  //Обновляет счетчик товаров в корзине (если он существует на странице).
  private updateCartCounter(): void {
    const cartCounter = document.querySelector('.header__basket-counter') as HTMLElement | null;
    if (cartCounter) {
      cartCounter.textContent = String(this.items.length);
    }
  }
}
