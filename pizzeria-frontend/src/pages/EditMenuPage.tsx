import React, { useState } from "react";
import menu from "../json/menu.json";
import { ProductProps } from "../utilities/types";
import pizza from "../images/pizza.jpg";
import {
  SelectedProductsProvider,
  useSelectedProducts,
} from "../providers/SelectedProductsProvider";
import { Link } from "react-router-dom";

export const EditMenuPage: React.FC = () => {
  return (
    <SelectedProductsProvider>
      <EditMenuContainer />
    </SelectedProductsProvider>
  );
};

const EditMenuContainer: React.FC = () => {
  const { selectedProducts, setSelectedProducts } = useSelectedProducts();

  const tempPrint = () => {
    console.log(selectedProducts);
  };
  return (
    <div>
      <div className="flex items-center overflow-hidden justify-center border border-b-gray-300 ">
        <div className="flex flex-row overflow-scroll overflow-x-hidden flex-wrap items-center justify-center max-h-screen">
          {menu.map((product) => (
            <Product product={product} key={product.id} />
          ))}
        </div>
      </div>
      <div className="fixed flex flex-row bottom-0 right-0 p-4">
        <Link to={"/menu/edit/update/" + selectedProducts[0]?.id}>
          <button
            disabled={selectedProducts.length !== 1}
            className={
              selectedProducts.length === 1 ? "bg-blue-400" : "bg-gray-400"
            }
          >
            Edit Product
          </button>
        </Link>
        <Link to="/menu/edit/add">
          <button className="bg-green-500 hover:bg-green-600 rounded text-white">
            Add a Product
          </button>
        </Link>
        <button
          onClick={() => tempPrint()}
          className="bg-green-500 hover:bg-green-600 rounded text-white"
        >
          print
        </button>
      </div>
    </div>
  );
};

const Product: React.FC<ProductProps> = (prop) => {
  const [isSelected, setSelected] = useState(false);

  const { selectedProducts, setSelectedProducts } = useSelectedProducts();

  const updateSelection = () => {
    const bool = selectedProducts.includes(prop.product);

    if (!bool) {
      setSelectedProducts(
        selectedProducts.filter((product) => product.id !== prop.product.id),
      );
      setSelectedProducts([...selectedProducts, prop.product]);
    } else {
      setSelectedProducts(
        selectedProducts.filter((product) => product.id !== prop.product.id),
      );
    }
  };

  const handleSelection = () => {
    updateSelection();
    setSelected(!isSelected);
  };

  return (
    <button onClick={() => handleSelection()}>
      <div
        className={
          "font-medium flex flex-col items-center justify-center m-2 h-60 w-60 border rounded-md max-h-full " +
          (isSelected ? "bg-gray-300" : "bg-white")
        }
      >
        <img src={pizza} className="h-3/6 w-4/6 object-cover" alt="pizza"></img>
        <p className="mt-2 text-center text-lg font-semibold">
          {prop.product.name}
        </p>
        <p className="mt-1 text-center text-gray-600">${prop.product.price}</p>
      </div>
    </button>
  );
};
