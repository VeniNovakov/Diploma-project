import React, { useEffect, useRef, useState } from "react";
import { BasketProps } from "../types";
import Cookies from "js-cookie";
import NavBar from "../NavBar";
import { useBasketContent } from "../providers/BasketContentProvider";
import pizza from "../images/pizza.jpg";
import { useBasket } from "../providers/BasketCounterProvider";

function round(num: number, fractionDigits: number): number {
  return Number(num.toFixed(fractionDigits));
}

const BasketPage = () => {
  const { basketItems, setBasketItems } = useBasketContent();

  return (
    <div>
      <NavBar></NavBar>
      <div className="flex flex-row justify-around">
        <div className="flex flex-col">
          {basketItems.length ? (
            basketItems.map((item) => {
              return (
                <ProductOrdered
                  item={item}
                  key={item.product.id}
                ></ProductOrdered>
              );
            })
          ) : (
            <div>NO items in basket</div>
          )}

          <Checkout></Checkout>
        </div>
        <div className="flex flex-col">
          <label>More information about the order:</label>
          <textarea
            className="border border-slate-300"
            placeholder="IDK"
          ></textarea>
        </div>
      </div>
    </div>
  );
};

const ProductOrdered = (props: BasketProps) => {
  const { basketItems, setBasketItems } = useBasketContent();
  const { setBasketCounter } = useBasket();
  const IsButtonDisabled = props.item.amount === 1 ? true:false

  useEffect(() => {
    console.log("basketItems:");

    setBasketCounter(basketItems.length);

    const basketString = JSON.stringify(basketItems);

    Cookies.set("basket", basketString);

  }, [basketItems, setBasketCounter]);

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
    if(ix === -1){
      return;
    }
    const updatedItems = [...basketItems];

    if(props.item.amount > 1){
      updatedItems[ix].amount--;
      setBasketItems(updatedItems);
    }

  };

  const deleteItem = (): void => {
    const updatedList = [
      ...basketItems.filter(
        (bItem) => props.item.product.id !== bItem.product.id,
      ),
    ];
    if (updatedList.length === 0) {
      Cookies.remove("basket");
    }
    setBasketItems(updatedList);
    setBasketCounter(updatedList.length);
  };

  let operations = {
    "+": addAmount,
    "-": removeAmount,
    "x": deleteItem,
  };

  const updateBasket = (option: "+" | "-" | "x"): void => {
    operations[option]();
  };

  return (
    <div className="flex flex-row justify-between items-center border p-2 mb-2 bg-white rounded-lg shadow-md flex-wrap">
      <img
        src={pizza}
        className="object-scale-down h-16 w-16 border-black"
        alt="pizza"
      ></img>
      <div className="flex flex-col ml-4">
        <div className="text-lg font-semibold overflow-hidden">
          {props.item.product.name}
        </div>
        <div className="flex flex-row items-center mt-2">
          <button
            disabled={IsButtonDisabled}
            onClick={() => updateBasket("-")}
            className="border p-1 enabled:hover:bg-slate-300"
          >
            -
          </button>
          <div className="mx-2">{props.item.amount}</div>
          <button
            onClick={() => updateBasket("+")}
            className="border p-1 hover:bg-slate-300"
          >
            +
          </button>
        </div>
      </div>
      <div className="text-xl font-semibold pr-2 self-end">
        ${round(props.item.product.price * props.item.amount, 2)}
      </div>
      <button
        className="border p-1 hover:bg-red-300 self-end"
        onClick={() => updateBasket("x")}
      >
        X
      </button>
    </div>
  );
};

const Checkout = () => {
  const { basketItems, setBasketItems } = useBasketContent();
  return (
    <div>
      {basketItems.length ? (
        <>
          <Total></Total>
          <button
            type="button"
            className="shadow-md hover:shadow-inner hover:bg-slate-100 rounded-md border-slate-400 border"
          >
            ORDER
          </button>
        </>
      ) : (
        <div></div>
      )}
    </div>
  );
};
const Total = () => {
  const { basketItems, setBasketItems } = useBasketContent();
  const calcTotals = basketItems.map((item) => {
    return item.amount * item.product.price;
  }) as unknown as number[];
  const total = calcTotals.length
    ? round(
        calcTotals.reduce((acc, curr) => {
          return acc + curr;
        }),
        2,
      )
    : 0;

  return (
    <div>
      {basketItems.length ? (
        <div className="flex flex-row justify-between shadow-xl rounded">
          total:
          <div className="flex justify-end">{total}</div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
export default BasketPage;
