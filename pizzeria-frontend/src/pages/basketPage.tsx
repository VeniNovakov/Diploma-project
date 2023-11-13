import React, { useEffect, useRef, useState } from "react";
import { BasketItem, BasketProps } from "../types";
import Cookies from "js-cookie";
import NavBar from "../NavBar";
import { useBasketContent } from "../providers/BasketContentProvider";
import pizza from '../images/pizza.jpg'
import { useBasket } from "../providers/BasketCounterProvider";
const BasketPage = () => {
  const { basketItems, setBasketItems } = useBasketContent();
  const ref = useRef(true)
  ref.current = false

  
  return (
    <div>
      <NavBar></NavBar>
      <div className="flex flex-row">
        <div className="flex flex-col">
          {basketItems?.map((item) => {
            return (
              <ProductOrdered
                item={item}
                key={item.product.id}
              ></ProductOrdered>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ProductOrdered = (props: BasketProps) => {
  const { basketItems, setBasketItems } = useBasketContent();
  const { basketCounter, setBasketCounter} = useBasket();

  const ref = useRef(true)
  
  useEffect(() => {
    console.log('basketItems:');

    setBasketCounter(basketItems.length);
  
    const basketString = JSON.stringify(basketItems);
  
    Cookies.set('basket', basketString);
  
    console.log('not first render');
  }, [basketItems, setBasketCounter, setBasketItems]);

  const search = (id: number): number => {
    for (let i = 0; i < basketItems.length; i++) {
      if (id === basketItems[i].product.id) {
        return i;
      }
    }
    return -1;
  };

  const addAmount = (): void => {
    const ix = search(props.item.product.id);
    if (ix !== -1) {
      const updatedItems = [...basketItems];
      updatedItems[ix].amount++;
      setBasketItems(updatedItems);
    }

  };

  const removeAmount = (): void => {
    const ix = search(props.item.product.id);
    if (ix !== -1 && props.item.amount > 1) {
      const updatedItems = [...basketItems];
      updatedItems[ix].amount--;
      setBasketItems(updatedItems);

    }
  };

  const deleteItem = (): void => {
      const updatedList = [...basketItems.filter(
        (bItem) => props.item.product.id !== bItem.product.id
      )];
      if(updatedList.length === 0){
        Cookies.remove('basket')
      }
        setBasketItems(updatedList)
        setBasketCounter(updatedList.length)
    
    
  };

  let operations = {
    "+": addAmount,
    "-": removeAmount,
    "x": deleteItem
  };

  const updateBasket = (option: '+' | '-' | 'x'):void => {
    console.log('got here')
    operations[option]();
  }

  return( 
<div className="flex flex-row justify-between items-center border p-2 mb-2 bg-white rounded-lg shadow-md">
    <img src={pizza} className='object-scale-down h-16 w-16 border-black' alt='pizza'></img>
    <div className='flex flex-col ml-4'>
        <div className="text-lg font-semibold">{props.item.product.name}</div>
        <div className="flex flex-row items-center mt-2">
            <button onClick={() => updateBasket('-')} className="border p-1 hover:bg-slate-300">-</button>
            <div className="mx-2">{props.item.amount}</div>
            <button onClick={() => updateBasket('+')} className="border p-1 hover:bg-slate-300">+</button>
        </div>
    </div>
    <div className="text-xl font-semibold pr-2">${props.item.product.price * props.item.amount}</div>
    <button className="border p-1 hover:bg-slate-300" onClick={() => updateBasket('x')}>X</button>
</div>
);
};

export default BasketPage;
