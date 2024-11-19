import { ApiListResponse, ApiPostMethods } from "../components/base/api";

// Отдельный тип для способа оплаты
export type Payment = "card" | "cash" | null;

//шаблоны в html
export type Templates = {
  success: HTMLTemplateElement | null;
  cardCatalog: HTMLTemplateElement | null;
  cardPreview: HTMLTemplateElement | null;
  cardBasket: HTMLTemplateElement | null;
  basket: HTMLTemplateElement | null;
  order: HTMLTemplateElement | null;
  contacts: HTMLTemplateElement | null;
};


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
  total: number;
  items: string[];
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
  baseUrl: string;
  get<T>(uri: string): Promise<T>;
  post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
	getProducts: () => Promise<ApiListResponse<IProduct>>;
	orderProducts(order: IOrder): Promise<IOrderStatus>;
}
