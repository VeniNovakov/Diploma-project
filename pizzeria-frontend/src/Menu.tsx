import { useBasket } from "./providers/BasketCounterProvider";
import pizza from "./images/pizza.jpg";
import menu from "./json/menu.json";
import React, { useEffect, useState } from "react";
import { ProductType, BasketItem } from "./types";
import Cookies from "js-cookie";
import { ProductProps } from "./types";
import { useBasketContent } from "./providers/BasketContentProvider";
import { Link } from "react-router-dom";

const Menu = () => {
  const [selectedFilter, setSelectedFilter] = useState("");

  const handleFilterClick = (filterType: string) => {
    setSelectedFilter(filterType);
  };

  const filteredMenu = selectedFilter
    ? menu.filter((product) => product.category === selectedFilter)
    : menu;

  return (
    <div>
      <Filter onFilterClick={handleFilterClick} />
      <div className="flex flex-wrap items-center justify-center">
        {filteredMenu.map((product) => (
          <Product product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
};

const Filter = ({ onFilterClick }: any) => {
  const filterItems = [
    { img: "ds", alt: "", name: ''},
    { img: "pizza", alt: "", name: "Pizza" },
    { img: "img", alt: "", name: "Burger" },
    { img: "img", alt: "", name: "Italian Delights" },
  ];

  return (
    <div className="flex self-center items-center justify-center">
      {filterItems.map((item, index) => (
        <FilterItem
          item={item}
          key={index}
          onFilterClick={() => onFilterClick(item.name)}
        />
      ))}
    </div>
  );
};

const FilterItem = ({ item, onFilterClick }: any) => {
  return (
    <button
      className="flex flex-col self-center justify-self-center m-2 justify-center text-center items-center"
      onClick={onFilterClick}
    >
      <img
        className="h-12 w-12 justify-self-center"
        src={item.img}
        alt={item.alt}
      ></img>
      <div className="justify-self-center break-all">{item.name}</div>
    </button>
  );
};

const Product = (props: ProductProps) => {
  const { basketItems, setBasketItems } = useBasketContent();
  const { basketCounter, setBasketCounter } = useBasket();

  useEffect(() => {
    Cookies.set("basket", JSON.stringify(basketItems));
    console.log(basketItems);
    setBasketCounter(
      (JSON.parse(Cookies.get("basket") || "[]") as BasketItem[]).length,
    );
  }, [basketItems, setBasketCounter]);

  const updateBasket = (product: ProductType) => {
    setBasketCounter(basketCounter + 1);

    const newBasketObj: BasketItem = { product: product, amount: 1 };

    if (basketItems.length === 0) {
      console.log(basketItems);

      setBasketItems([...basketItems, newBasketObj]);
      return;
    } else {
      const updatedList: BasketItem[] = basketItems?.map((item: BasketItem) => {
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
      
      if(JSON.stringify(updatedList) === JSON.stringify(basketItems)){
        setBasketItems([...updatedList, newBasketObj])
      }else{
        setBasketItems([...updatedList]);
      }
    }
  };

  return (
    <div className="font-medium flex flex-col items-center justify-center m-2 h-60 w-60 border rounded-md max-h-full ">
      <img src={pizza} className="h-3/6 w-4/6 object-cover" alt="pizza"></img>
      <p className="mt-2 text-center text-lg font-semibold">
        {props.product.name}
      </p>
      <p className="mt-1 text-center text-gray-600">${props.product.price}</p>
      <div className="flex flex-row">
        <Link to={"/product/" + props.product.id}>
          <button className="mt-3 px-4 py-2 border-2 border-black hover:bg-slate-300 focus:outline-none focus:border-slate-300">
            change
          </button>
        </Link>
        <button
          className="mt-3 px-4 py-2 border-2 border-black hover:bg-slate-300 focus:outline-none focus:border-slate-300"
          onClick={() => updateBasket(props.product)}
        >
          Add to Basket
        </button>
      </div>
    </div>
  );
};

export default Menu;
