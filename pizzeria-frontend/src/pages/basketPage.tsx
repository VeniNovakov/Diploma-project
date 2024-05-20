import React, { useEffect, useRef, useState } from "react";
import { BasketItem, BasketProps, BasketType, Order, ProductType } from "../utilities/types";
import NavBar from "../components/NavBar";
import { useBasketContent } from "../providers/BasketContentProvider";
import { useBasket } from "../providers/BasketCounterProvider";
import { round } from "../utilities/functions/math";
import toast,{Toaster} from "react-hot-toast";
import { fetchDataWithRetry } from "../utilities/functions/fetchAndRefresh";
import { useIsLoggedIn } from "../providers/LoggedInProvider";

const BasketPage = () => {
  const { basketItems, setBasketItems } = useBasketContent();
  const [basketUpdateTrigger, setBasketUpdateTrigger] = useState(false);
  const {isLoggedIn, setIsLoggedIn } = useIsLoggedIn();
  if(!isLoggedIn){
    window.location.href = '/';
  }
  useEffect(()=>{

    fetchDataWithRetry(window.location.origin+"/api/basket/v1.0")
    .then(data => {
      setBasketItems((data as BasketType).basketProducts)
    })
    .catch(e=>console.log(e))
  }, [basketUpdateTrigger]);

  return (
    <div>
      <NavBar></NavBar>
      <div className="flex flex-row justify-around">
        <div className="flex flex-col">
          {Array.isArray(basketItems) && basketItems.length  ? (
            basketItems.map((item) => {
              return (
                <ProductOrdered
                  item={item}
                  key={item.id}
                  triggerUpdate={() => setBasketUpdateTrigger(!basketUpdateTrigger)}
                ></ProductOrdered>
              );
            })
          ) : (
            <div>No items present in basket</div>
          )}
          <Checkout triggerUpdate={() => setBasketUpdateTrigger(!basketUpdateTrigger)}></Checkout>
        </div>
      </div>
      <Toaster/>
    </div>
  );
};

const ProductOrdered = (props: BasketProps & { triggerUpdate: () => void }) => {
  const { basketItems, setBasketItems } = useBasketContent();
  const { setBasketCounter } = useBasket();
  const [IsButtonDisabled, setButtonDisabled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const addOnsPrices = props.item.addOns?.map((addOn) => {
    return addOn.addOn.price * addOn.amount;
  });

  const total = Array.isArray(addOnsPrices) && addOnsPrices?.length
    ? round(
        addOnsPrices.reduce((acc, curr) => {
          return acc + curr;
        }),
        2,
      )
    : 0;

  useEffect(() => {
    setButtonDisabled(props.item.amount === 1);
  }, [props.item.amount]);

  const addAmount = (): void => {
    fetchDataWithRetry(window.location.origin + `/api/basket/v1.0/${props.item.productId}?`+ new URLSearchParams({add: "true"}), null, "PUT")
    .then(data => {
      props.triggerUpdate();
    })
    .catch(e => console.log(e))
  };

  const removeAmount = (): void => {
    fetchDataWithRetry(window.location.origin + `/api/basket/v1.0/${props.item.productId}?`+ new URLSearchParams({add: "false"}), null, "PUT")
    .then(data => {
      props.triggerUpdate();
    })
    .catch(e => console.log(e))
  };

  const deleteItem = (): void => {
    fetchDataWithRetry(window.location.origin + `/api/basket/v1.0/${props.item.productId}?`, null, "DELETE")
    .then(data => {
      props.triggerUpdate();
    })
    .catch(e => console.log(e))
  };

  let operations = {
    "+": addAmount,
    "-": removeAmount,
    x: deleteItem,
  };

  const updateBasket = (option: "+" | "-" | "x"): void => {
    operations[option]();
  };

  return (
    <div
      className="flex flex-row justify-between items-center border p-2 mb-2 bg-white rounded-lg shadow-md flex-wrap"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={props.item.product.image}
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
      {props.item.product.price * props.item.amount +
              total * props.item.amount != 0 &&
        <div className="text-xl font-semibold pr-2 self-end">
          kldsak;dkal;dklas;kals;dkasl;dk;lkl;lkkkkkkkkkkkkkkkkkkk
          $
          {round(
            props.item.product.price * props.item.amount +
              total * props.item.amount,
            2,
          )}
        </div>
      }
      <button
        className="border p-1 hover:bg-red-300 self-end"
        onClick={() => updateBasket("x")}
      >
        X
      </button>
      {isHovered && (
        <div className="absolute left-0 mt-8 p-2 bg-white border rounded-lg shadow-md">
          <p className="font-bold">Add-ons:</p>
          {props.item.addOns?.map((addOn) => (
            <div key={addOn.addOn.id} className="flex">
              <p className="mr-2">{addOn.amount}x</p>
              <p className="mr-2">{addOn.addOn.name}:</p>
              <p>${round(addOn.addOn.price * addOn.amount, 2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Checkout = (props: { triggerUpdate: () => void }) => {
  const { basketItems, setBasketItems } = useBasketContent();
  const CompleteOrder = () =>{
    fetchDataWithRetry(window.location.origin + "/api/orders/v1.0", null, "POST")
    .then(data => {
      toast.success("Successfully placed order #" + (data as Order).id, {duration:3000})
      props.triggerUpdate();
    })
    .catch(e => console.log(e))
  }

  return (
    <div>
      {Array.isArray(basketItems) && basketItems.length != 0 ?(
        <>
        dkslad;alkd;laskd;laskd;laskdl;sakdl;sakd;lkk
          <Total></Total>
          <button
            type="button"
            onClick={() => CompleteOrder()}
            className="shadow-md hover:shadow-inner hover:bg-slate-100 rounded-md border-slate-400 border"
          >
            ORDER
          </button>
        </>
      ):<></>}
    </div>
  );
};

const Total = () => {
  const { basketItems, setBasketItems } = useBasketContent();

  const calcTotals = basketItems.map((item) => {
    return item.amount * item.product.price;
  }) as unknown as number[];

  const addOnsTotals = basketItems.map((item) => {

    const itemAddOnsPrices = Array.isArray(item.addOns)
      ? item.addOns.map((addOn) => {
          return addOn.amount * addOn.addOn.price;
        })
      : [];

    const itemAddOnsTotal = Array.isArray(itemAddOnsPrices)
      ? itemAddOnsPrices?.reduce((acc, curr) => {
          return acc + curr;
        }, 0)
      : 0;

    return itemAddOnsTotal * item.amount;
  });

  const addOnsTotal = Array.isArray(addOnsTotals) ? addOnsTotals?.reduce((acc, curr) => {
    return acc + curr;
  }, 0): 0;

  const total = Array.isArray(calcTotals)
    ? calcTotals.reduce((acc, curr) => {
        return acc + curr;
      }, 0)
    : 0;

  return (
    <div>
      {Array.isArray(basketItems) && total + addOnsTotal != 0 ? (
        <div className="flex flex-row justify-between shadow-xl rounded">
          total:
          <div className="flex justify-end">
            {round(total + addOnsTotal, 2)}
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default BasketPage;
