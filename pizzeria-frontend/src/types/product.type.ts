export interface Prop {
  product: ProductType;
};

export interface ProductProps {
  product: ProductType;
  key: number;
};

export interface BasketProps {
  item: BasketItem;
  key: number;
};

export interface ProductType {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
};
export interface AddOn {
  id: number;
  name: string;
  amount: number;
}
export interface BasketItem {
  product: ProductType;
  addOns? : AddOn[]
  amount: number;
};
