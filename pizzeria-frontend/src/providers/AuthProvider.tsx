
import React, { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { ProductType, SelectedProductsProviderType } from "../utilities/types";
import { fetchDataWithRetry } from "../utilities/functions/fetchAndRefresh";

const isAdminContext = createContext({
  isAdmin: false,
  setIsAdmin: (isAdmin: boolean) => {},
});

export const useIsAdmin = () => {
  return useContext(isAdminContext);
};

export const AuthProvider = ({ children }: any) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchDataWithRetry(window.location.origin+ '/api/auth/v1.0/isAdmin')
      .then(response => {setIsAdmin(response)})
      .catch(error => console.error('Error checking admin status:', error));
  }, [window.location.href]);

  return (
    <isAdminContext.Provider
      value={{ isAdmin, setIsAdmin }}
    >
      {children}
    </isAdminContext.Provider>
  );
};

