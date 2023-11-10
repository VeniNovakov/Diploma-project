import React from "react"
import { createContext, useContext, useState} from "react"
import { BasketItem } from "../types"
import { BasketItemsProvider } from "../types/provider.type"

const BasketContentContext = createContext<BasketItemsProvider>(
  {
    basketItems: [],
    setBasketItems: (items: BasketItem[]) => {}
  }
)
export const useBasketContent = () => {
  return useContext(BasketContentContext)
}

export const BasketContentProvider = ({children}:any) => {

  const [basketItems, setBasketItems] = useState<BasketItem[]>([]);

  return (
    <BasketContentContext.Provider value={{ basketItems , setBasketItems }}>
      {children}
    </BasketContentContext.Provider>
  );
}