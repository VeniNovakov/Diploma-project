import { useBasket } from "./providers/BasketCounterProvider";
import React, { useEffect, useRef, useState } from "react";
import { ProductType, BasketItem, Category } from "./utilities/types";
import Cookies from "js-cookie";
import { ProductProps } from "./utilities/types";
import { useBasketContent } from "./providers/BasketContentProvider";
import { Link } from "react-router-dom";
import { useProduct } from "./providers/TempProductProvider";
import toast, { Toaster } from "react-hot-toast";
interface IFilter {
  onFilterClick: (filterType: Category | null) => void;
}

interface IFilterItem {
  item: Category| null
  onFilterClick: () => void;
}

const Menu = () => {
  const [selectedFilter, setSelectedFilter] = useState<Category>();
  const [filteredMenu, setFilteredMenu] = useState<ProductType[]>([]);
  const [menu, setMenu] = useState<ProductType[]>([]);
  const firstRender = useRef(true);

  const handleFilterClick = (filterType: Category | null) => {
    setSelectedFilter(filterType as Category);
  };
  useEffect(() => {
    toast.loading("loading data");
    if(firstRender.current){
      fetch(window.location.origin+ "/api/products/v1.0")
      .then(resp => resp.json())
      .then(data => {
        toast.dismiss();

        setFilteredMenu(data);
        setMenu(data);
      })
  }
  firstRender.current=false;

  toast.dismiss();
  },[])
  useEffect(() => {
    if (selectedFilter?.id) {
      setFilteredMenu(
        menu.filter((product) => product.category.id === selectedFilter.id && product.isInMenu),
      );
    } else {
      setFilteredMenu(menu);
    }
  }, [selectedFilter, setFilteredMenu]);

  return (
    <div>
      <Filter onFilterClick={handleFilterClick} />
      <div className="flex flex-wrap items-center justify-center">
        {Array.isArray(filteredMenu) && filteredMenu.map((product) => (
          <Product product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
};

const Filter: React.FC<IFilter> = ({ onFilterClick }) => {
  const [ filterItems, setFilterItems ] = useState<Category[]>([]) 
  const firstRender = useRef(false)
  useEffect(() => {
    if(!firstRender.current){
    fetch(window.location.origin + "/api/product-categories/v1.0").then(data => data.json()).then(data =>{
      setFilterItems(data as Category[]);
    }
    )
    firstRender.current = true; 
}},[])
  return (
    <div className="flex self-center items-center justify-center">
      {filterItems.map((item, index) => (
        <FilterItem
          item={item}
          key={index}
          onFilterClick={() => onFilterClick(item)}
        />
      ))}
      <button onClick={() => onFilterClick(null)}>reset</button>
    </div>
  );
};

const FilterItem: React.FC<IFilterItem> = ({ item, onFilterClick }) => {
  return (
    <button
      className="flex flex-col self-center justify-self-center m-2 justify-center text-center items-center"
      onClick={onFilterClick}
    >

      <div className="justify-self-center break-all">{item?.name}</div>
    </button>
  );
};

const Product = (props: ProductProps) => {
  const { basketItems, setBasketItems } = useBasketContent();
  const { basketCounter, setBasketCounter } = useBasket();
  const { tempProduct, setTempProduct } = useProduct();
  useEffect(() => {
    Cookies.set("tempProduct", JSON.stringify(tempProduct));
  }, [tempProduct, setTempProduct]);
  
  useEffect(() => {
    Cookies.set("basket", JSON.stringify(basketItems));
    setBasketCounter(
      (JSON.parse(Cookies.get("basket") || "[]") as BasketItem[]).length,
    );
  }, [basketItems, setBasketCounter]);

  const updateBasket = (product: ProductType) => {
    setBasketCounter(basketCounter + 1);

    const newBasketObj: BasketItem = {
      productId: product.id,
      product: product,
      amount: 1,
    };

    if (basketItems.length === 0) {
      toast("Added " + newBasketObj.product.name + " to the basket", {position: "top-right",duration: 4000})

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
        toast("Added " + newBasketObj.product.name + " to the basket", {position: "top-right",duration: 4000})

        setBasketItems([...updatedList, newBasketObj]);
      } else {
        toast("Added amount to" + newBasketObj.product.name + " in the basket", {position: "top-right",duration: 4000})

        setBasketItems([...updatedList]);
      }
    }
  };

  const btnHandle = () => {
   
   fetch(window.location.origin+ "/api/products/v1.0/" + props.product.id)
   .then(data => data.json())
    .then(parsed =>{
      setTempProduct({
          addOns: [],
          product: parsed as ProductType,
          amount: 1,
        },
      );

    }
    )
   }

  return (
    <div className="font-medium flex flex-col items-center justify-center m-2 h-60 w-60 border rounded-md max-h-full ">
      <img src={props.product.image} className="h-3/6 w-4/6 object-cover" alt="pizza"></img>
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
      <Toaster/>
    </div>
  );
};

export default Menu;
