import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/landingPage";
import MenuPage from "./pages/MenuPage";
import Auth from "./pages/authPage";
import React from "react";
import { BasketContentProvider } from "./providers/BasketContentProvider";
import { BasketCounterProvider } from "./providers/BasketCounterProvider";
import BasketPage from "./pages/basketPage";
import { BasketProvider } from "./providers/BasketProvider";
const App = () => {
  return (
    <BasketProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/">
              <Route index element={<LandingPage />} />
              <Route path="menu" element={<MenuPage />} />
              <Route path="auth" element={<Auth />} />
              <Route path="basket" element={<BasketPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </BasketProvider>
  );
};

export default App;
