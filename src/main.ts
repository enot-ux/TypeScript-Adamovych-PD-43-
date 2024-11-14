// Базовий тип товару
type BaseProduct = {
  id: number;
  name: string;
  price: number;
  description: string;
};

// Специфічний тип для електроніки
type Electronics = BaseProduct & {
  category: 'electronics';
  brand: string;
  warrantyPeriod: number; // Гарантійний термін у місяцях
};

// Специфічний тип для одягу
type Clothing = BaseProduct & {
  category: 'clothing';
  size: string;
  material: string;
  color: string;
};

// Специфічний тип для книг
type Book = BaseProduct & {
  category: 'books';
  author: string;
  pages: number;
  genre: string;
};

// Функція для пошуку товару за id
const findProduct = <T extends BaseProduct>(products: T[], id: number): T | undefined => {
  return products.find(product => product.id === id);
};

// Функція для фільтрації товарів за максимальною ціною
const filterByPrice = <T extends BaseProduct>(products: T[], maxPrice: number): T[] => {
  return products.filter(product => product.price <= maxPrice);
};

// Тип для елемента кошика
type CartItem<T> = {
  product: T;
  quantity: number;
};

// Функція для додавання товару в кошик
const addToCart = <T extends BaseProduct>(
  cart: CartItem<T>[],
  product: T,
  quantity: number
): CartItem<T>[] => {
  const existingItemIndex = cart.findIndex(item => item.product.id === product.id);
  if (existingItemIndex >= 0 && cart[existingItemIndex]) {
    // Перевіряємо, чи товар існує, перш ніж збільшувати кількість
    cart[existingItemIndex].quantity += quantity;
  } else {
    // Додаємо новий товар у кошик
    cart.push({ product, quantity });
  }
  return cart;
};

// Функція для підрахунку загальної вартості кошика
const calculateTotal = <T extends BaseProduct>(cart: CartItem<T>[]): number => {
  return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
};

// Створення тестових даних
const electronics: Electronics[] = [
  {
    id: 1,
    name: "Телефон",
    price: 10000,
    description: "Сучасний смартфон з потужним процесором",
    category: 'electronics',
    brand: "TechBrand",
    warrantyPeriod: 24
  }
];

const clothing: Clothing[] = [
  {
    id: 2,
    name: "Футболка",
    price: 500,
    description: "Зручна футболка з бавовни",
    category: 'clothing',
    size: "M",
    material: "cotton",
    color: "black"
  }
];

const books: Book[] = [
  {
    id: 3,
    name: "Книга",
    price: 300,
    description: "Захоплюючий роман",
    category: 'books',
    author: "Автор Книги",
    pages: 250,
    genre: "Фантастика"
  }
];

// Тестування функцій

// Пошук товару
const phone = findProduct(electronics, 1);
console.log("Знайдений товар:", phone);

// Фільтрація товарів за ціною
const affordableClothes = filterByPrice(clothing, 600);
console.log("Доступний одяг за ціною до 600:", affordableClothes);

// Робота з кошиком
let cart: CartItem<BaseProduct>[] = [];

if (electronics[0]) {
  cart = addToCart(cart, electronics[0], 1); // Додаємо телефон у кошик
}

if (clothing[0]) {
  cart = addToCart(cart, clothing[0], 2); // Додаємо футболки у кошик
}

// Підрахунок загальної вартості
const total = calculateTotal(cart);
console.log("Загальна вартість кошика:", total);
