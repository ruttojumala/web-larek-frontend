import { IProduct } from "../../types";
import { ProductModel } from "../model/productmodel";
import { CatalogView } from "../view/catalogview";
import { ProductView } from "../view/productview";

export class CatalogPresenter {
  private productModel: ProductModel;
  private catalogView: CatalogView;
  private productView: ProductView;

  constructor(
    productModel: ProductModel,
    catalogView: CatalogView,
    productView: ProductView
  ) {
    this.productModel = productModel;
    this.catalogView = catalogView;
    this.productView = productView;
  }

  //Инициализирует каталог, отображая список продуктов и добавляя обработчики.
  initialize(products: IProduct[]): void {
    this.catalogView.renderCatalog(products);
    this.catalogView.setProductClickHandler(this.handleOpenProductModal.bind(this));
  }

  // Открывает модальное окно с деталями выбранного продукта.
  private handleOpenProductModal(productId: string): void {
    const product = this.productModel.getProductById(productId);
    if (product) {
      this.productView.renderProductDetails(product);
    } else {
      console.error('Товар не найден:', productId);
    }
  }
}
