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
import { parse } from "path";
import toast, { Toaster } from "react-hot-toast";

interface ChangeAmountProps {
  item: AddOnType | ProductType;
  className?: string;
  amount: number;
  setAmount: React.Dispatch<React.SetStateAction<number>>;
}
const delay = (ms: number | undefined)  => new Promise(
  resolve => setTimeout(resolve, ms)
);
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
      "category" in object &&
      "isInMenu" in object
    );
  }

  useEffect(() => {

    Cookies.set("tempProduct", JSON.stringify(tempProduct));
  }, [amount, item, setTempProduct, tempProduct]);

  useEffect(() => {
    const updatedAddOns = tempProduct.addOns?.map((addOn) => {
      if (addOn.id === item.id && amount!=0) {
        return { ...addOn, amount };
      }
      return addOn;
    });
    setTempProduct({ ...tempProduct, addOns: updatedAddOns });

    setIsDisabled(amount === 0);
  }, [amount, item]);

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
      const updatedAddOns = amount !== 0 ? updateAddOn() : removeAddOn();

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

  const [product, setProduct] = useState<ProductType | null>(null);
  const [addOns, setAddOns] = useState<AddOnType[]>([]);

  useEffect(() => {
    setTempProduct(JSON.parse(Cookies.get("tempProduct")|| "{}") as TempProduct);
  }, [numericId]);

  const submitOrder = async() => {
    const tempProduct = JSON.parse(Cookies.get("tempProduct") || "{}") as TempProduct;
    Cookies.set("tempProduct", "{}");
    toast.success("Added " + tempProduct.product.name + " with add ons to basket", {position:"top-right", duration:1500})
    setBasketItems([...basketItems, tempProduct]);

    await delay(1000);

    window.location.href = window.location.origin +"/menu";
  };

  const firstRender = useRef(true);

  const fetchProduct = () =>{
    fetch(window.location.origin+ "/api/products/v1.0/" + numericId)
    .then(response => response.json())
    .then(parsedData =>{
      setProduct(parsedData as ProductType);
      setTempProduct({
        addOns: [],
        product: JSON.parse(parsedData) as ProductType,
        amount: 1,
    });

    })
    .catch(error => {
      console.error('Error fetching product data:', error);
    });
  }

  const fetchAddOns = () => {
    fetch(window.location.origin+ "/api/add-ons/v1.0/", { method: "GET" })
      .then(resp => resp.json())
      .then(data => {
        setAddOns(data as AddOnType[]);
      })
      .catch(error => {
        console.error('Error fetching add-ons data:', error);
      });

  }
  useEffect(() => {
    const tempProductFromCookie = JSON.parse(Cookies.get("tempProduct") || "{}") as TempProduct;
    const hasOldEntry = !!tempProductFromCookie.product;
    
    if (firstRender.current || !hasOldEntry || tempProductFromCookie.product.id !== numericId) {
      fetchProduct();
      fetchAddOns();
      firstRender.current = false;
    }

  }, []);

  return (
    <>
      <Link
        to="/menu"
        className="absolute right-0 mr-4 border hover:bg-slate-300"
      >
        <button>X</button>
      </Link>
      <div className="flex flex-row justify-around">
        <Additions addOns={addOns} />
        <div className="flex flex-col justify-center">
          {product && <Product />}
          <div className="flex flex-col">
            <button
              onClick={submitOrder}
              className="border bg-slate-200 hover:bg-slate-300 rounded-md w-full"
            >
              order
            </button>
            <ChangeAmount
              item={tempProduct.product as ProductType}
              className="justify-center"
              amount={productAmount}
              setAmount={SetProductAmount}
            />
          </div>
        </div>
        <Toaster/>
      </div>
      </>
  );
};

const Additions: React.FC<{ addOns: AddOnType[] }> = ({ addOns }) => {

  const addOnsByCategory: { [key: string]: AddOnType[] } = {};
  addOns.forEach((addOn) => {
    if (!addOnsByCategory[addOn.category.id]) {
      addOnsByCategory[addOn.category.id] = [];
    }
    addOnsByCategory[addOn.category.id].push(addOn);
  });

  const addOnSections = Object.entries(addOnsByCategory).map(
    ([categoryId, addOns]) => ({
      sectionName: addOns[0].category.name, 
      toppings: addOns,
    })
  );

  return (
    <div className="flex flex-col">
      {addOnSections.map((section, index) => (
        <AdditionsSection key={index} section={section} />
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
      {section.toppings.map((addOn, index) => (
        <AdditionElement
          id={addOn.id}
          key={index}
          name={addOn.name}
          category={addOn.category}
          categoryId={addOn.categoryId}
          description={addOn.description}
          price={addOn.price}
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
  const {tempProduct, setTempProduct} = useProduct();


  if (!tempProduct || !tempProduct.product) {
    return <div>Loading...</div>;
  }

  const addOnsPrices = tempProduct.addOns?.map((addOn) => {
    if (isNaN(addOn.price) || isNaN(addOn.amount)) {
      return 0;
    }
    return addOn.price * addOn.amount;
  });

  // Calculate total price
  const total = addOnsPrices?.length
    ? round(
        addOnsPrices.reduce((acc, curr) => {
          return acc + curr;
        }),
        2
      )
    : 0;

  return (
    <div className="flex flex-col border border-gray-300 rounded p-4 max-w-md self-end">
      <img src={tempProduct.product.image} alt="pizza" className="max-w-full h-auto rounded mb-2" />
      <p className="font-bold">{tempProduct.product?.name}</p>
      <p className="text-gray-700">{tempProduct.product?.description}</p>
      <p className="text-blue-500 font-bold">
        {round(
          tempProduct.product?.price * tempProduct.amount +
            total * tempProduct.amount,
          2
        )}
      </p>
    </div>
  );
};

export default ProductPage;
