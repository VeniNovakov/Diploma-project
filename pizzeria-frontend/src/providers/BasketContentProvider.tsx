import React from "react";
import { createContext, useContext, useState } from "react";
import { BasketItem } from "../utilities/types";
import { BasketItemsProvider } from "../utilities/types/provider.type";
import Cookies from "js-cookie";

const BasketContentContext = createContext<BasketItemsProvider>({
  basketItems: [],
  setBasketItems: (items: BasketItem[]) => {},
});

export const useBasketContent = () => {
  return useContext(BasketContentContext);
};

export const BasketContentProvider = ({ children }: any) => {
  const [basketItems, setBasketItems] = useState<BasketItem[]>(
    JSON.parse(Cookies.get("basket") || "[]"),
  );

  return (
    <BasketContentContext.Provider value={{ basketItems, setBasketItems }}>
      {children}
    </BasketContentContext.Provider>
  );
};
