import { BasketItem } from "./product.type";

export type BasketItemsProvider = {
  basketItems: BasketItem[],
  setBasketItems: Function
}