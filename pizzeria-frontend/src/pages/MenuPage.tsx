import { BasketProvider } from "../providers/BasketProvider";
import Menu from "../Menu";
import NavBar from "../NavBar";
import React from "react";

const MenuPage = () => {
  return (
    <BasketProvider>
      <NavBar></NavBar>
      <Menu></Menu>
    </BasketProvider>
  );
};

export default MenuPage;
