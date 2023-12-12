import React from "react";
import { createContext, useContext, useState } from "react";
import { ProductType, SelectedProductsProviderType } from "../utilities/types";

const SelectedProductsContext = createContext<SelectedProductsProviderType>({
  selectedProducts: [],
  setSelectedProducts: (products: ProductType[]) => {},
});

export const useSelectedProducts = () => {
  return useContext(SelectedProductsContext);
};

export const SelectedProductsProvider = ({ children }: any) => {
  const [selectedProducts, setSelectedProducts] = useState<ProductType[]>([]);

  return (
    <SelectedProductsContext.Provider
      value={{ selectedProducts, setSelectedProducts }}
    >
      {children}
    </SelectedProductsContext.Provider>
  );
};
