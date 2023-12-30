import React, { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { BasketItem } from "../utilities/types";
import { BasketItemsProvider } from "../utilities/types/provider.interfaces";
import Cookies from "js-cookie";
import { useBasket } from "./BasketCounterProvider";

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

  const { basketCounter, setBasketCounter } = useBasket();
  useEffect(() => {
    Cookies.set("basket", JSON.stringify(basketItems));

    setBasketCounter(
      (JSON.parse(Cookies.get("basket") || "[]") as BasketItem[]).length,
    );
  }, [basketItems, setBasketCounter]);
  
  return (
    <BasketContentContext.Provider value={{ basketItems, setBasketItems }}>
      {children}
    </BasketContentContext.Provider>
  );
};
