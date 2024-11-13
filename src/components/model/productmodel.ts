import { IProduct } from "../../types";

export class ProductModel {
  private products: IProduct[] = [];

  getAllProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | null {
    return this.products.find(product => product.id === id) || null;
  }

  addProduct(product: IProduct): void {
    this.products.push(product);
  }

  removeProduct(id: string): void {
    this.products = this.products.filter(product => product.id !== id);
  }
}
