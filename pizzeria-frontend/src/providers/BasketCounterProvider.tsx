import { createContext, useContext, useState } from "react";
import React from "react";

const BasketContext = createContext(
  {
    basketCounter: 0 as number,
    setBasketCounter: (amount: number) => {} 
  }
);

export const useBasket = () => {
  return useContext(BasketContext);
}

export const BasketCounterProvider = ({children}:any) => {
  const [basketCounter, setBasketCounter] = useState(0); // Initialize basket counter state
  
  return (
    <BasketContext.Provider value={{ basketCounter, setBasketCounter }}>
      {children}
    </BasketContext.Provider>
  );
}