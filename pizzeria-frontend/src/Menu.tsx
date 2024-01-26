import { useBasket } from "./providers/BasketCounterProvider";
import pizza from "./images/pizza.jpg";
import menu from "./json/menu.json";
import React, { useEffect, useState } from "react";
import { ProductType, BasketItem } from "./utilities/types";
import Cookies from "js-cookie";
import { ProductProps } from "./utilities/types";
import { useBasketContent } from "./providers/BasketContentProvider";
import { Link } from "react-router-dom";
interface IFilter {
  onFilterClick: (filterType: string) => void;
}

interface IFilterItem {
  item: {
    image: string;
    alt: string;
    name: string;
  };
  onFilterClick: () => void;
}

const Menu = () => {
  const [selectedFilter, setSelectedFilter] = useState("");
  const [filteredMenu, setFilteredMenu] = useState(menu);

  const handleFilterClick = (filterType: string) => {
    setSelectedFilter(filterType);
  };

  useEffect(() => {
    if (selectedFilter.length) {
      setFilteredMenu(
        menu.filter((product) => product.category === selectedFilter),
      );
    } else {
      setFilteredMenu(menu);
    }
  }, [selectedFilter, setFilteredMenu]);

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

const Filter: React.FC<IFilter> = ({ onFilterClick }) => {
  const filterItems = [
    { image: "ds", alt: "", name: "" },
    { image: "pizza", alt: "", name: "Pizza" },
    { image: "img", alt: "", name: "Burger" },
    { image: "img", alt: "", name: "Italian Delights" },
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

const FilterItem: React.FC<IFilterItem> = ({ item, onFilterClick }) => {
  return (
    <button
      className="flex flex-col self-center justify-self-center m-2 justify-center text-center items-center"
      onClick={onFilterClick}
    >
      <img
        className="h-12 w-12 justify-self-center"
        src={item.image}
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

    setBasketCounter(
      (JSON.parse(Cookies.get("basket") || "[]") as BasketItem[]).length,
    );
  }, [basketItems, setBasketCounter]);

  const updateBasket = (product: ProductType) => {
    setBasketCounter(basketCounter + 1);

    const newBasketObj: BasketItem = {
      id: product.id,
      product: product,
      amount: 1,
    };

    if (basketItems.length === 0) {
      setBasketItems([...basketItems, newBasketObj]);
      return;
    } else {
      const updatedList: BasketItem[] = basketItems?.map((item: BasketItem) => {
        if (item.product.id === product.id && !item.addOns) {
          const updatedItem = {
            ...item,
            amount: item.amount + 1,
          };
          return updatedItem;
        } else {
          return item;
        }
      });

      if (JSON.stringify(updatedList) === JSON.stringify(basketItems)) {
        setBasketItems([...updatedList, newBasketObj]);
      } else {
        setBasketItems([...updatedList]);
      }
    }
  };

  const btnHandle = () => {
    Cookies.set(
      "tempProduct",
      JSON.stringify({
        addOns: [],
        product: menu[props.product.id - 1],
        amount: 1,
      }),
    );
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
          <button
            onClick={btnHandle}
            className="mt-3 px-4 py-2 border-2 border-black hover:bg-slate-300 focus:outline-none focus:border-slate-300"
          >
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
