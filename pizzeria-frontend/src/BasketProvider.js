import { createContext, useContext, useState } from "react";

const BasketContext = createContext();

export function useBasket(){
  return useContext(BasketContext);
}

export function BasketProvider({children}){
  const [basketCounter, setBasketCounter] = useState(0); // Initialize basket counter state
  
  return (
    <BasketContext.Provider value={{ basketCounter, setBasketCounter }}>
      {children}
    </BasketContext.Provider>
  );
}