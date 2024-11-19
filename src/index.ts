import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import { Templates } from './types';
import { Api } from './components/base/api';
import { API_URL } from './utils/constants';
import { ProductModel } from './components/model/productmodel';
import { Modal } from './components/view/modal';
import { CartView } from './components/view/cartview';
import { CatalogView } from './components/view/catalogview';
import { CatalogPresenter } from './components/presenter/catalogpresenter';
import { ProductView } from './components/view/productview';
import { CartPresenter } from './components/presenter/cartpresenter';
import { CartModel } from './components/model/cartmodel';
import { OrderModel } from './components/model/ordermodel';
import { CheckoutPresenter } from './components/presenter/checkoutpresenter';
import { SuccessView } from './components/view/successview';

const templates: Templates = {
  success: document.querySelector('#success'),
  cardCatalog: document.querySelector('#card-catalog'),
  cardPreview: document.querySelector('#card-preview'),
  cardBasket: document.querySelector('#card-basket'),
  basket: document.querySelector('#basket'),
  order: document.querySelector('#order'),
  contacts: document.querySelector('#contacts'),
};

// Инициализация EventEmitter для управления событиями
const events = new EventEmitter();

// Инициализация API с базовым URL
const api = new Api(API_URL);

// Инициализация моделей
const productModel = new ProductModel();
let cartModel: CartModel;
const orderModel = new OrderModel(cartModel);

// Инициализация представлений
const catalogContainer = document.querySelector('.gallery') as HTMLElement;
const catalogView = new CatalogView(catalogContainer, templates.cardCatalog);
const cartView = new CartView(templates.basket);
const successView = new SuccessView(templates.success, events);

// Инициализация презентеров
let cartPresenter: CartPresenter;

// Подключение обработчика для кнопки корзины
const basketButton = document.querySelector('.header__basket') as HTMLButtonElement;
basketButton?.addEventListener('click', () => {
  events.emit('basket:open');
});

// Событие открытия корзины
events.on('basket:open', () => {
  if (!cartModel) {
    console.error('Корзина еще не инициализирована.');
    return;
  }
  const cartItems = cartModel.getCartItems();
  const total = cartModel.calculateTotal();
  cartView.renderCart(cartItems, total);
  cartView.setCheckoutHandler(() => {
    cartPresenter.handleProceedToCheckout();
  });
});

// Загрузка данных по API
api.getProducts()
  .then((response) => {
    // Добавление товаров в модель каталога
    response.items.forEach((item) => productModel.addProduct(item));

    // Инициализация модели корзины после загрузки товаров
    const productsDatabase = productModel.getAllProducts();
    cartModel = new CartModel(productsDatabase);

    // Инициализация остальных классов
    const productView = new ProductView(templates.cardPreview, events, cartModel);

    const catalogPresenter = new CatalogPresenter(productModel, catalogView, productView);
    catalogPresenter.initialize(productModel.getAllProducts());

    const checkoutPresenter = new CheckoutPresenter(
      new Modal(),
      orderModel,
      cartModel,
      templates,
      events,
      api,
      successView
    );
    checkoutPresenter.initialize();

    cartPresenter = new CartPresenter(
      new Modal(),
      cartModel,
      orderModel,
      cartView,
      events,
      checkoutPresenter
    );
    cartPresenter.initialize();
  })
  .catch((error) => {
    console.error('Ошибка загрузки продуктов:', error);
  });

// Обработчик удаления товара из корзины
cartView.setRemoveHandler((productId) => {
  if (!cartModel) {
    console.error('Корзина еще не инициализирована.');
    return;
  }
  cartModel.removeFromCart(productId);
  const cartItems = cartModel.getCartItems();
  const total = cartModel.calculateTotal();
  cartView.renderCart(cartItems, total); 
});
