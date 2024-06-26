import { useBasket } from "../providers/BasketCounterProvider";
import shoppingCart from "../images/shopping-cart.png";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { NavItemProps } from "../utilities/types/navBar.interfaces";
import { useIsAdmin } from "../providers/AuthProvider";
import { useIsLoggedIn } from "../providers/LoggedInProvider";

const NavBar = () => {
  const { basketCounter } = useBasket();
  const { isAdmin, setIsAdmin } = useIsAdmin();
  const { isLoggedIn, setIsLoggedIn } = useIsLoggedIn();

  const HandleSignOut = () => {
    fetch(window.location.origin + "/api/auth/v1.0/revoke", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " + (localStorage.getItem("authRefresh") || " "),
      },
    })
      .then((resp) => {
        localStorage.removeItem("authRefresh");
        localStorage.removeItem("authAccess");
        setIsLoggedIn(false);
        setIsAdmin(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="flex-start flex flex-row items-center justify-center bg-amber-200 h-full">
      {isLoggedIn ? (
        <NavItem href="/" function={HandleSignOut}>
          Sign out
        </NavItem>
      ) : null}

      {isAdmin && isLoggedIn ? (
        <NavItem href="/profile">Profile</NavItem>
      ) : (<></>
      )}
      
      {!isLoggedIn && <NavItem href="/auth">Sign in</NavItem>}

      <NavItem href="/menu">Menu</NavItem>
      {isLoggedIn && <NavItem
        href="/basket"
        basket={{
          icon: shoppingCart,
          name: "shoppingCart",
          counter: basketCounter,
        }}
        children={""}
      />}
    </div>
  );
};

const NavItem: React.FC<NavItemProps> = (props) => {
  const Navigate = () =>{
    window.location.href = props.href;
  }
  return (
    <div className="flex h-full pl-12 m-0">
      <button
        onClick={Navigate}
        className="font-serif font-medium border-2 hover:bg-amber-300"
      >
        {props.basket ? (
          <div className="relative">
            <img
              className="bg-transparent max-h-12 max-w-12 m-0"
              src={props.basket.icon}
              alt={props.basket.name}
            />
            <div className="absolute top-0 -right-1 h-4 w-4 bg-red-600 rounded-full">
              <span className="absolute top-0 right-0 h-6 w-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs">
                {props.basket.counter > 99 ? "99+" : props.basket.counter}
              </span>
            </div>
          </div>
        ) : props.function ? (
          <button onClick={props.function}>{props.children}</button>
        ) : (
          props.children
        )}
      </button>
    </div>
  );
};

export default NavBar;
