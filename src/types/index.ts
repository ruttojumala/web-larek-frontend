// Отдельный тип для способа оплаты
export type Payment = "online" | "cash" | null;


//данные товара
export interface IProduct {
  id: string;
  category: string;
  image: string;
  title: string;
  description: string;
  price: number;
}

//данные пользователя для заказа товара
export interface IOrder { 
  payment: Payment;
  address: string;
  email: string;
  phone: string;
}

//данные корзины
export interface ICart {
  items: IProduct[];
  total: number;
}

//каталог
export interface ICatalog {
  items: IProduct[];
}

//статус оплаты/оформления заказа
export interface IOrderStatus {
  total: number;
  isComplete: boolean;
}

//интерфейс для апи
export interface IApi {
	getProducts: () => Promise<IProduct[]>;
	orderProducts(order: IOrder): Promise<IOrderStatus>;
}

// Тип для ошибки валидации при заполнении заказа
export interface IErrorMessage {
  message: string;
}