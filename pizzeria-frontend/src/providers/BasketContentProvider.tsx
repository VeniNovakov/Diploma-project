import React, { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { BasketItem, BasketType } from "../utilities/types";
import { BasketItemsProvider } from "../utilities/types/provider.interfaces";
import Cookies from "js-cookie";
import { useBasket } from "./BasketCounterProvider";
import { fetchDataWithRetry } from "../utilities/functions/fetchAndRefresh";

const BasketContentContext = createContext<BasketItemsProvider>({
  basketItems: [],
  setBasketItems: (items: BasketItem[]) => {},
});

export const useBasketContent = () => {
  return useContext(BasketContentContext);
};

export const BasketContentProvider = ({ children }: any) => {
  const [basketItems, setBasketItems] = useState<BasketItem[]>();
  const { basketCounter, setBasketCounter } = useBasket();

  useEffect(()=>{
    fetchDataWithRetry(window.location.origin+"/api/basket/v1.0")
    .then(data => {
      setBasketItems((data as BasketType).basketProducts? (data as BasketType).basketProducts : ([] as BasketItem[]));
      setBasketCounter((data as BasketType).basketProducts?.length as number)
    })
    .catch(e=>console.log(e))
  }, [])
  
  
  return (
    <BasketContentContext.Provider value={{ basketItems, setBasketItems }}>
      {children}
    </BasketContentContext.Provider>
  );
};
