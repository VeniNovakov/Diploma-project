export interface Prop {
  product: ProductType;
}

export interface ProductProps {
  product: ProductType;
  key: number;
}

export interface BasketProps {
  item: BasketItem;
  key: number;
}

export interface ProductType {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
}

export interface AddOnType {
  id: number;
  name: string;
  description: string;
  price: number;
}

export interface AddOnBasketType extends AddOnType {
  amount: number;
}

export interface BasketItem {
  addOns?: AddOnBasketType[];
  product: ProductType;
  amount: number;
}
