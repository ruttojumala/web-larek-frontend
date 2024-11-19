import { IProduct } from "../../types";

//Класс ProductModel управляет коллекцией продуктов, предоставляя методы для их добавления, удаления и получения.
export class ProductModel {
  private products: IProduct[] = [];

  //Возвращает все продукты из коллекции.
  getAllProducts(): IProduct[] {
    return [...this.products]; // Возвращает копию массива для избежания изменений извне
  }

  // Возвращает продукт по его ID.
  getProductById(id: string): IProduct | null {
    return this.products.find((product) => product.id === id) || null;
  }

  // Добавляет продукт в коллекцию.
  addProduct(product: IProduct): void {
    if (this.products.some((p) => p.id === product.id)) {
      console.warn(`Продукт с ID ${product.id} уже существует.`);
      return;
    }
    this.products.push(product);
  }

  // Удаляет продукт из коллекции по его ID.
  removeProduct(id: string): void {
    const initialLength = this.products.length;
    this.products = this.products.filter((product) => product.id !== id);

    if (this.products.length === initialLength) {
      console.warn(`Продукт с ID ${id} не найден для удаления.`);
    }
  }

  //Проверяет, существует ли продукт в коллекции.
  isProductExists(id: string): boolean {
    return this.products.some((product) => product.id === id);
  }
}
