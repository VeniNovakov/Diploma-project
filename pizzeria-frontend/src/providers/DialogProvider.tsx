import Cookies from "js-cookie";
import { createContext, useContext, useState } from "react";
import React from "react";
import { BasketItem } from "../utilities/types";

const ImageDialogContext = createContext({
  showDialog: false, 
  setShowDialog: (amount: boolean) => {},
});

export const useDialog = () => {
  return useContext(ImageDialogContext);
};

export const ImageDialogProvider = ({ children }: any) => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <ImageDialogContext.Provider value={{ showDialog, setShowDialog }}>
      {children}
    </ImageDialogContext.Provider>
  );
};
