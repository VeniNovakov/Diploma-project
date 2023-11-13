import Cookies from "js-cookie";
import { createContext, useContext, useState } from "react";
import React from "react";
import { BasketItem } from "../types";

const BasketContext = createContext({
  basketCounter: (JSON.parse(Cookies.get('basket') || '[]') as  BasketItem[]).length,
  setBasketCounter: (amount: number) => {},
});

export const useBasket = () => {
  return useContext(BasketContext);
};

export const BasketCounterProvider = ({ children }: any) => {
  const [basketCounter, setBasketCounter] = useState(
    (JSON.parse(Cookies.get('basket') || '[]') as  BasketItem[]).length,
  );

  return (
    <BasketContext.Provider value={{ basketCounter, setBasketCounter }}>
      {children}
    </BasketContext.Provider>
  );
};
