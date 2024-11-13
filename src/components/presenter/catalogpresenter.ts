import { ProductModel } from "../model/productmodel";
import { CatalogView } from "../view/catalogview";

export class CatalogPresenter {
  private productModel: ProductModel;
  private catalogView: CatalogView;

  constructor(productModel: ProductModel, catalogView: CatalogView) {
    this.productModel = productModel;
    this.catalogView = catalogView;
  }

  initialize(): void {
    // Получение товаров из модели и передача их в представление для отображения
    const products = this.productModel.getAllProducts();
    this.catalogView.renderCatalog(products);

    // Связываем обработчик открытия карточки товара
    this.catalogView.bindOpenProductModal(this.handleOpenProductModal.bind(this));
  }

  handleOpenProductModal(productId: string): void {
    const product = this.productModel.getProductById(productId);
    if (product) {
      // Логика открытия модального окна с детальной информацией о продукте
      console.log("Opening product modal for:", product);
      // Здесь можно добавить вызов метода представления для отображения модального окна
    } else {
      console.error('Product with id ${productId} not found');
    }
  }
}