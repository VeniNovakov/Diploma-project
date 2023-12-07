import React from "react";
import { createContext, useContext, useState } from "react";
import {
  TempProductProvider,
  TempProduct,
} from "../utilities/types/provider.interfaces";
import Cookies from "js-cookie";

const TempProductContext = createContext<TempProductProvider>({
  tempProduct: JSON.parse(Cookies.get("tempProduct") || "{}"),
  setTempProduct: (tempProduct: TempProduct) => {},
});

export const useProduct = () => {
  return useContext(TempProductContext);
};

export const ProductProvider = ({ children }: any) => {
  const [tempProduct, setTempProduct] = useState<TempProduct>(
    JSON.parse(Cookies.get("tempProduct") || "{}"),
  );

  return (
    <TempProductContext.Provider value={{ tempProduct, setTempProduct }}>
      {children}
    </TempProductContext.Provider>
  );
};
