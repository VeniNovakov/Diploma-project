// CombinedContextProvider.js
import React from "react";
import { BasketCounterProvider } from "./BasketCounterProvider";
import { BasketContentProvider } from "./BasketContentProvider";

export const BasketProvider = ({ children }: any) => {
  return (
    <BasketCounterProvider>
      <BasketContentProvider>{children}</BasketContentProvider>
    </BasketCounterProvider>
  );
};
