import React, { useEffect, useState } from "react";
import { BasketItem, BasketProps, ProductType } from "../utilities/types";
import Cookies from "js-cookie";
import NavBar from "../NavBar";
import { useBasketContent } from "../providers/BasketContentProvider";
import pizza from "../images/pizza.jpg";
import { useBasket } from "../providers/BasketCounterProvider";
import { round } from "../utilities/functions/math";
import toast,{Toaster} from "react-hot-toast";
const BasketPage = () => {
  const { basketItems, setBasketItems } = useBasketContent();

  console.log(basketItems)

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
                  key={item.Id}
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
      <Toaster/>
    </div>
  );
};

const ProductOrdered = (props: BasketProps) => {
  const { basketItems, setBasketItems } = useBasketContent();
  const { setBasketCounter } = useBasket();
  const [IsButtonDisabled, setButtonDisabled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const addOnsPrices = props.item.addOns?.map((addOn) => {
    return addOn.price * addOn.amount;
  });

  const total = addOnsPrices?.length
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

  const search = (product: ProductType | BasketItem): number => {
    for (let i = 0; i < basketItems.length; i++) {
      if (JSON.stringify(basketItems[i]) === JSON.stringify(product)) {
        return i;
      }
    }
    return -1;
  };

  const addAmount = (): void => {
    const ix = search(props.item);
    if (ix !== -1) {
      const updatedItems = [...basketItems];
      updatedItems[ix].amount++;
      setBasketItems(updatedItems);
    }
  };

  const removeAmount = (): void => {
    const ix = search(props.item);
    if (ix === -1) {
      return;
    }
    const updatedItems = [...basketItems];

    if (props.item.amount > 1) {
      updatedItems[ix].amount--;
      setBasketItems(updatedItems);
    }
  };

  const deleteItem = (): void => {
    const ix = search(props.item);
    const updatedList = basketItems.filter((_, index) => index !== ix);
    if (updatedList.length === 0) {
      Cookies.remove("basket");
    }
    setBasketItems(updatedList);
    setBasketCounter(updatedList.length);
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
      <div className="text-xl font-semibold pr-2 self-end">
        $
        {round(
          props.item.product.price * props.item.amount +
            total * props.item.amount,
          2,
        )}
      </div>
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
            <div key={addOn.id} className="flex">
              <p className="mr-2">{addOn.amount}x</p>
              <p className="mr-2">{addOn.name}:</p>
              <p>${round(addOn.price * addOn.amount, 2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Checkout = () => {
  const { basketItems, setBasketItems } = useBasketContent();
  const MapBasketAndFetch = () => {
    var newArray:any = [];
    basketItems.forEach(item => {

        const productId = item.product.id;
        const productAddOns = item.addOns;
        const productAmount = item.amount;

        const mappedObject = {
            "productId": productId,
            "addOns": productAddOns?.map(addOn => ({
                "addOnId": addOn.id,
                "amount": addOn.amount
            })),
            "amount": productAmount
        };

        newArray.push(mappedObject);
    });

    const mappedJSON = {
        "wantedFor": "2024-02-21T01:24:50.415Z",
        "Items": newArray,
    };

    toast.loading("Sending order", {position: "top-center"});
    fetch(window.location.origin+ "/api/orders/v1.0", 
    {
      method:"POST",
      body:JSON.stringify(mappedJSON),
      headers:{
        "Content-Type":"application/json"
      }
    }).then(resp => {
      toast.dismiss();
      if(resp.status != 200 ){
        toast.error("Error when sending order");
        return;
      }
      return resp.json()
    }).then(data => {
 
      toast.success("Order successfully sent Order #" + data.id, {position:"top-right", duration:4000});

    }
      )
}

  return (
    <div>
      {basketItems.length && (
        <>
          <Total></Total>
          <button
            type="button"
            onClick={() => MapBasketAndFetch()}
            className="shadow-md hover:shadow-inner hover:bg-slate-100 rounded-md border-slate-400 border"
          >
            ORDER
          </button>
        </>
      )}
    </div>
  );
};

const Total = () => {
  const { basketItems, setBasketItems } = useBasketContent();

  const calcTotals = basketItems.map((item) => {
    return item.amount * item.product.price;
  }) as unknown as number[];

  const addOnsTotals = basketItems.map((item) => {
    const itemAddOnsPrices = item.addOns
      ? item.addOns.map((addOn) => {
          return addOn.amount * addOn.price;
        })
      : [];

    const itemAddOnsTotal = itemAddOnsPrices.length
      ? itemAddOnsPrices?.reduce((acc, curr) => {
          return acc + curr;
        })
      : 0;
    return itemAddOnsTotal * item.amount;
  });
  const addOnsTotal = addOnsTotals?.reduce((acc, curr) => {
    return acc + curr;
  });

  const total = calcTotals.length
    ? calcTotals.reduce((acc, curr) => {
        return acc + curr;
      })
    : 0;

  return (
    <div>
      {basketItems.length ? (
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
