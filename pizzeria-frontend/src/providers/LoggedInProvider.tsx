
import React, { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { ProductType, SelectedProductsProviderType } from "../utilities/types";
import { fetchDataWithRetry } from "../utilities/functions/fetchAndRefresh";

const isLoggedInContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: (isLoggedIn: boolean) => {},
});

export const useIsLoggedIn = () => {
  return useContext(isLoggedInContext);
};

export const LoggedInProvider = ({ children }: any) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("authRefresh"));
  
  useEffect( () => {
    setIsLoggedIn(!!localStorage.getItem("authRefresh"))
  },[window.location.href]);

  return (
    <isLoggedInContext.Provider
      value={{ isLoggedIn, setIsLoggedIn }}
    >
      {children}
    </isLoggedInContext.Provider>
  );
};

