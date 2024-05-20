export interface Prop {
  product: ProductType;
}

export interface ProductProps {
  product: ProductType;
  key: number;
}

export interface BasketProps {
  item: BasketItem;
  key?: number;
}

export interface ProductType {
  id: number;
  image: string;
  name: string;
  price: number;
  description: string;
  category: Category;
  categoryId: number;
  isAvailable: boolean;
  isInMenu: boolean;
}

export interface AddOnType {
  id: number;
  name: string;
  description: string;
  category: Category
  categoryId: number;
  price: number;
  amountInGrams: number;
}

export interface AddOnBasketType{
  addOn: AddOnType
  amount: number;

}
export interface Order {
  id: number;
  wantedFor: string;
  orderedProducts: BasketItem[];
  user: User
  isCompleted: boolean;
}

export interface User{
  name: string;
  email: string;
}
export interface Category{
  id: number;
  name: string;
}

export interface BasketItem {
  id?: number;
  basketId?: number;
  productId: number;
  addOns?: AddOnBasketType[];
  product: ProductType;
  amount: number;

}

export interface BasketType {
  id?: number;
  basketProducts?: BasketItem[]
}
