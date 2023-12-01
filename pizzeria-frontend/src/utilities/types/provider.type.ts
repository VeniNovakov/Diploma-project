import { BasketItem, ProductType } from "./product.type";

export type BasketItemsProvider = {
  basketItems: BasketItem[];
  setBasketItems: Function;
};
export type TempProductProvider = {
  tempProduct: TempProduct;
  setTempProduct: Function;
};

interface AddOnType {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface AddOnBasketType extends AddOnType{
  amount: number;
}
export interface TempProduct {
  addOns: AddOnBasketType[];
  product: ProductType;
  amount: number
}