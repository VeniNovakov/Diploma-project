import React, { useEffect, useRef, useState } from "react";
import pizza from "../images/pizza.jpg";
import menu from "../json/menu.json";
import { AddOnType, ProductType } from "../utilities/types";
import { Link, useParams } from "react-router-dom";
import add_ons from "../json/add-ons.json";
import Cookies from "js-cookie";
import { useBasketContent } from "../providers/BasketContentProvider";
import { ProductProvider, useProduct } from "../providers/TempProductProvider";
import { round } from "../utilities/functions/math";
import { TempProduct } from "../utilities/types/provider.interfaces";
import { AddOnsSection } from "../utilities/types/addOns.interfaces";

interface ChangeAmountProps {
  item: AddOnType | ProductType;
  className?: string;
  amount: number;
  setAmount: React.Dispatch<React.SetStateAction<number>>;
}

const ChangeAmount: React.FC<ChangeAmountProps> = ({
  item,
  className,
  amount,
  setAmount,
}) => {
  const [isDisabled, setIsDisabled] = useState(true);

  const { tempProduct, setTempProduct } = useProduct();
  function instanceOfProduct(object: any): object is ProductType {
    return (
      "id" in object &&
      "name" in object &&
      "price" in object &&
      "description" in object &&
      "category" in object
    );
  }

  useEffect(() => {
    Cookies.set("tempProduct", JSON.stringify(tempProduct));
  }, [amount, item, setTempProduct, tempProduct]);

  const removeAddOn = () => {
    setIsDisabled(true);
    return tempProduct.addOns?.filter((addOn) => {
      return addOn.id !== item.id;
    });
  };

  const addAddOn = () => {
    return [...tempProduct.addOns, { ...item, amount }];
  };

  const updateAddOn = () => {
    return tempProduct.addOns?.map((addOn) => {
      if (addOn.id === item.id) {
        return {
          ...addOn,
          amount,
        };
      }
      return addOn;
    });
  };

  const removeAmount = () => {
    if (amount > 1) {
      amount--;
      setAmount(amount);
    } else if (amount > 0 && !instanceOfProduct(item)) {
      amount--;
      setAmount(amount);
    }

    if (instanceOfProduct(item)) {
      setTempProduct({ ...tempProduct, amount });
      setIsDisabled(true && amount === 1);
    } else if (!instanceOfProduct(item)) {
      const updatedAddOns = amount ? updateAddOn() : removeAddOn();

      setTempProduct({ ...tempProduct, addOns: updatedAddOns });
      setIsDisabled(amount === 0);
    }
  };

  const addAmount = () => {
    amount++;
    setAmount(amount);

    if (!instanceOfProduct(item)) {
      const updatedAddOns = amount === 1 ? addAddOn() : updateAddOn();

      setTempProduct({
        ...tempProduct,
        addOns: updatedAddOns,
      });
    } else if (instanceOfProduct(item)) {
      setTempProduct({ ...tempProduct, amount });
    }

    if (isDisabled) {
      setIsDisabled(false);
    }
  };

  return (
    <div className={`flex flex-row ${className || ""}`}>
      <button onClick={removeAmount} className={`border self-end`}>
        -
      </button>
      <p>{amount}</p>
      <button onClick={addAmount} className="border self-end">
        +
      </button>
    </div>
  );
};

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const numericId = parseInt(id as string, 10);
  const [productAmount, SetProductAmount] = useState(1);
  const { basketItems, setBasketItems } = useBasketContent();
  const { tempProduct, setTempProduct } = useProduct();

  const selectedItem: ProductType | undefined = menu.find(
    (item) => item.id === numericId,
  );

  const submitOrder = () => {
    const tempProduct = JSON.parse(Cookies.get("tempProduct") || "{}");
    Cookies.set("tempProduct", "{}");
    setBasketItems([...basketItems, tempProduct]);
  };

  const firstRender = useRef(true);
  useEffect(() => {
    const tempProductFromCookie = JSON.parse(
      Cookies.get("tempProduct") || "{}",
    ) as TempProduct;

    const hasOldEntry = !!tempProductFromCookie.product;

    if (
      firstRender.current ||
      !hasOldEntry ||
      tempProductFromCookie.product.id !== numericId - 1
    ) {
      Cookies.set(
        "tempProduct",
        JSON.stringify({ addOns: [], product: menu[numericId - 1], amount: 1 }),
      );

      setTempProduct({ addOns: [], product: menu[numericId - 1], amount: 1 });

      firstRender.current = false;
    } else {
      setTempProduct(tempProductFromCookie);
    }
  }, [numericId, setTempProduct]);

  return (
    <ProductProvider>
      <Link
        to="/menu"
        className="absolute right-0 mr-4 border hover:bg-slate-300"
      >
        <button>X</button>
      </Link>
      <div className="flex flex-row justify-around">
        <Additions sections={add_ons.toppingSections} />
        <div className="flex flex-col justify-center">
          {selectedItem && <Product />}
          <div className="flex flex-col">
            <button
              onClick={submitOrder}
              className="border bg-slate-200 hover:bg-slate-300 rounded-md w-full"
            >
              order
            </button>
            <ChangeAmount
              item={menu[numericId - 1]}
              className="justify-center"
              amount={productAmount}
              setAmount={SetProductAmount}
            />
          </div>
        </div>
      </div>
    </ProductProvider>
  );
};

const Additions: React.FC<{ sections: AddOnsSection[] }> = ({ sections }) => {
  return (
    <div className="flex flex-col">
      {sections.map((section) => (
        <AdditionsSection key={section.sectionName} section={section} />
      ))}
    </div>
  );
};

const AdditionsSection: React.FC<{ section: AddOnsSection }> = ({
  section,
}) => {
  return (
    <div className="flex-col border rounded-md p-12 bg-amber-100">
      <h3 className="font-bold self-start">{section.sectionName}</h3>
      {section.toppings.map((topping, index) => (
        <AdditionElement
          id={topping.id}
          key={index}
          name={topping.name}
          description={topping.description}
          price={topping.price}
        />
      ))}
    </div>
  );
};

const AdditionElement = (topping: AddOnType) => {
  const [amount, setAmount] = useState<number>(0);
  return (
    <div className="flex flex-row overflow-hidden">
      <div className="group/item flex-row flex">
        <p className="">{topping.name}</p>
        <div className="flex absolute rounded-md invisible group/item group-active/item:visible group-hover/item:scale-110 group-hover/item:cursor-default bg-slate-300  transition group-active/item:ease-in-out delay-150 duration-300">
          <p>{topping.description}</p>
        </div>
      </div>
      <ChangeAmount item={topping} amount={amount} setAmount={setAmount} />
    </div>
  );
};

const Product = () => {
  const { tempProduct } = useProduct();
  const addOnsPrices = tempProduct.addOns?.map((addOn) => {
    if (isNaN(addOn.price) || isNaN(addOn.amount)) {
      return 0;
    }
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

  return (
    <div className="flex flex-col border border-gray-300 rounded p-4 max-w-md self-end">
      <img src={pizza} alt="pizza" className="max-w-full h-auto rounded mb-2" />
      <p className="font-bold">{tempProduct.product?.name}</p>
      <p className="text-gray-700">{tempProduct.product?.description}</p>
      <p className="text-blue-500 font-bold">
        {round(
          tempProduct.product?.price * tempProduct.amount +
            total * tempProduct.amount,
          2,
        )}
      </p>
    </div>
  );
};

export default ProductPage;