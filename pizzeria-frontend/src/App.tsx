import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/landingPage";
import MenuPage from "./pages/MenuPage";
import Auth from "./pages/authPage";
import React, { useEffect, useState } from "react";
import BasketPage from "./pages/basketPage";
import { BasketProvider } from "./providers/BasketProvider";
import ProductPage from "./pages/ProductPage";
import { EditMenuPage } from "./pages/EditMenuPage";
import OrdersPage from "./pages/ordersPage";
import PizzaManPage from "./pages/PizzaManPage";
import { ProductProvider } from "./providers/TempProductProvider";
import UpdateProductPage from "./pages/ProductUpdatePage";
import UpdateAddOnPage from "./pages/AddOnUpdate";
import { fetchDataWithRetry } from "./utilities/functions/fetchAndRefresh";
import { AuthProvider, useIsAdmin } from "./providers/AuthProvider";

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchDataWithRetry(window.location.origin+ '/api/auth/v1.0/isAdmin')
      .then(response => {setIsAdmin(response)})
      .catch(error => console.error('Error checking admin status:', error));
  }, [window.location.href]);
  
  return (
    <AuthProvider>
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
              {isAdmin && (
                  <>
                    <Route path="menu/edit" element={<EditMenuPage />} />
                    <Route path="menu/edit/product/update/:id" element={<UpdateProductPage />} />
                    <Route path="menu/edit/product/add" element={<UpdateProductPage />} />
                    <Route path="menu/edit/addOn/update/:id" element={<UpdateAddOnPage />} />
                    <Route path="menu/edit/addOn/add" element={<UpdateAddOnPage />} />
                    <Route path="orders" element={<OrdersPage />} />
                    <Route path="profile" element={<PizzaManPage />} />
                  </>
                )}
            </Route>
          </Routes>
        </BrowserRouter>
    
        </ProductProvider>
      </BasketProvider>
    </AuthProvider>
  );
};

export default App;
