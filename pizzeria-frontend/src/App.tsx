import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/landingPage";
import MenuPage from "./pages/MenuPage";
import Auth from "./pages/authPage";
import React from "react";
import BasketPage from "./pages/basketPage";
import { BasketProvider } from "./providers/BasketProvider";
import ProductPage from "./pages/ProductPage";
import { EditMenuPage } from "./pages/EditMenuPage";
import UpdateMenuPage from "./pages/ProductUpdatePage";
import OrdersPage from "./pages/ordersPage";
import PizzaManPage from "./pages/PizzaManPage";
import { ProductProvider } from "./providers/TempProductProvider";

const App = () => {
  return (
    <BasketProvider>
      <ProductProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<LandingPage />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="auth" element={<Auth />} />
            <Route path="basket" element={<BasketPage />} />
            <Route path="product/:id" element={<ProductPage />} />
            <Route path="menu/edit" element={<EditMenuPage />} />
            <Route path="menu/edit/update/:id" element={<UpdateMenuPage />} />
            <Route path="menu/edit/add" element={<UpdateMenuPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="admin-profile" element={<PizzaManPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
  
      </ProductProvider>
    </BasketProvider>
  );
};

export default App;
