import { IProduct } from "../../types";

export class CatalogView {
  renderCatalog(items: IProduct[]): void {
    // Логика отображения товаров в каталоге
    console.log("Rendering catalog with items:", items);
    // Здесь можно добавить код для отрисовки товаров в каталоге (например, добавление элементов в DOM)
  }

  bindOpenProductModal(handler: (productId: string) => void): void {
    // Пример привязки обработчика для открытия модального окна
    // В реальной реализации здесь будет код, который добавит слушатели событий на карточки товаров в каталоге
    console.log("Bind handler for opening product modal");
  }
}
