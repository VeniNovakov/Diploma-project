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
  categorId: number;
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
}

export interface AddOnBasketType extends AddOnType {
  addOn: AddOnType;
  amount: number;

}
export interface Order {
  Id: number;
  wantedFor: string;
  orderedProducts: BasketItem[];
}
interface Category{
  id: number;
  name: string;
}
export interface BasketItem {
  id: number;
  productId:number;
  addOns?: AddOnBasketType[];
  product: ProductType;
  amount: number;
}
