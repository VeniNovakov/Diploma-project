export type Prop = {
  product: ProductType;
};

export type ProductProps = {
  product: ProductType;
  key: number; 
};

export type BasketProps = {
  item: BasketItem;
  key: number; 
}

export type ProductType = {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
};
export type BasketItem = {
  product: ProductType;
  amount: number;
};
