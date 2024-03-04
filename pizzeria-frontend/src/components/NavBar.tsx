import { useBasket } from "../providers/BasketCounterProvider";
import shoppingCart from "../images/shopping-cart.png";
import { Link } from "react-router-dom";
import React from "react";
import { NavItemProps } from "../utilities/types/navBar.interfaces";
import { useIsAdmin } from "../providers/AuthProvider";

const NavBar = () => {
  const { basketCounter } = useBasket();
  const {isAdmin, setIsAdmin} = useIsAdmin();

  return (
    <div className=" flex-start flex flex-row items-center justify-center bg-amber-200 h-full ">
      {isAdmin ? 
      <NavItem href="/profile">Profile</NavItem>:<NavItem href="/auth">Sign in</NavItem>
    }
      <NavItem href="/menu">Menu</NavItem>
      <NavItem
        href="/basket"
        basket={{
          icon: shoppingCart,
          name: "shoppingCart",
          counter: basketCounter,
        }} children={""}/>
    </div>
  );
};

const NavItem: React.FC<NavItemProps> = (props) => {
  return (
    <div className=" flex h-full pl-12 m-0">
      <Link
        to={props.href}
        className="font-serif font-medium border-2 hover:bg-amber-300 "
      >
        {props.basket ? (
          <div className="relative">
            <img
              className="bg-transparent  max-h-12 max-w-12 m-0"
              src={props.basket.icon}
              alt={props.basket.name}
            />
            <div className=" absolute top-0 -right-1 h-4 w-4 bg-red-600 rounded-full">
            <span className="absolute top-0 right-0 h-6 w-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs">
                {props.basket.counter > 99 ? "99+" : props.basket.counter}
              </span>
            </div>
          </div>
        ) : (
          props.children
        )}{" "}
      </Link>
    </div>
  );
}

export default NavBar;
