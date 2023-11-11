import { useBasket } from "./providers/BasketCounterProvider";
import pizza from "./images/pizza.jpg";
import menu from "./json/menu.json";
import React, { useEffect } from "react";
import { ProductType, BasketItem } from "./types";
import Cookies from "js-cookie";
import { ProductProps } from "./types";
import { useBasketContent } from "./providers/BasketContentProvider";

const Menu = () => {
  return (
    <div>
      <Filter />
      <div className="flex flex-wrap items-center justify-center">
        {menu.map((product) => (
          <Product product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
};

const Filter = () => {
  return (
    <div className="flex self-center items-center justify-center">
      <FilterItem item={{ img: pizza, alt: "", name: "pizza" }} />
      <FilterItem item={{ img: "img", alt: "", name: "not pizza" }} />
      <FilterItem item={{ img: "img", alt: "", name: "not pizza" }} />
    </div>
  );
};

const FilterItem = (props: any) => {
  return (
    <button className="flex flex-col self-center justify-self-center m-2 justify-center text-center items-center">
      <img
        className="h-12 w-12 justify-self-center"
        src={props.item.img}
        alt={props.item.alt}
      ></img>
      <div className="justify-self-center">{props.item.name}</div>
    </button>
  );
};

const Product = (props: ProductProps) => {
  const { basketCounter, setBasketCounter } = useBasket();
  const { basketItems, setBasketItems } = useBasketContent();

  useEffect(() => {
    Cookies.set("basket", JSON.stringify(basketItems));
    setBasketCounter(basketItems.length);
  }, [basketItems]);

  const updateBasket = (product: ProductType) => {
    setBasketCounter(basketCounter + 1);

    const newBasketObj: BasketItem = { product: product, amount: 1 };

    if (basketItems.length === 0) {
      setBasketItems([...basketItems, newBasketObj]);
      Cookies.set("basket", JSON.stringify(newBasketObj));
      return;
    }

    const updatedList: BasketItem[] = basketItems.map((item: BasketItem) => {
      if (item.product.id === product.id) {
        const updatedItem = {
          ...item,
          amount: item.amount + 1,
        };
        return updatedItem;
      } else {
        return item;
      }
    });

    console.log(basketItems);
    console.log(updatedList);
    JSON.stringify(updatedList) === JSON.stringify(basketItems)
      ? setBasketItems([...updatedList, newBasketObj])
      : setBasketItems(updatedList);

    Cookies.set("basket", JSON.stringify(basketItems));
  };

  return (
    <div className="font-medium flex relative items-center content-center flex-col justify-center m-2 h-60 w-60 border">
      <img src={pizza} className="h-3/6 w-4/6 fa" alt="pizza"></img>
      <p className="self-center">{props.product.name}</p>
      <p className="self-center">{props.product.price}</p>
      <button
        className="border-2 self-center hover:bg-slate-300"
        onClick={() => updateBasket(props.product)}
      >
        add to basket
      </button>
    </div>
  );
};

export default Menu;
