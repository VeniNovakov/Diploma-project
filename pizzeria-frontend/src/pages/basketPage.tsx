import React, { useEffect } from "react";
import { ProductProps } from "../types";
import Cookies from "js-cookie";
import NavBar from "../NavBar";
import { useBasketContent } from "../providers/BasketContentProvider";

const BasketPage = () => {
  const { basketItems, setBasketItems } = useBasketContent();

  useEffect(() => {
    setBasketItems(JSON.parse(Cookies.get("basket") || "[]"));
  }, [basketItems]);
  return (
    <div>
      <NavBar></NavBar>
      <div className="flex flex-row">
        <div className="flex flex-col">
          {basketItems.map((item) => {
            return (
              <ProductOrdered
                product={item.product}
                key={item.product.id}
              ></ProductOrdered>
            );
          })}
        </div>
      </div>
    </div>
  );
};
const ProductOrdered = (props: ProductProps) => {
  return <div className=""></div>;
};

export default BasketPage;
