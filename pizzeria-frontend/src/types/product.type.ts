export type Prop = {
  product: ProductType;
};

export type ProductProps = {
  product: ProductType; // Assuming ProductType is another type/interface you have defined
  key: number; // Assuming the key is a number
};

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
