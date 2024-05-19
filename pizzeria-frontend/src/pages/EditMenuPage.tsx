import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SelectedProductsProvider, useSelectedProducts } from "../providers/SelectedProductsProvider";
import { fetchDataWithRetry } from "../utilities/functions/fetchAndRefresh"; 
import { AddOnType, Category, ProductProps, ProductType } from "../utilities/types";
interface FiltersProps {
  categories: Category[];
  applyFilters: (category: Category | null, availability?: boolean | null, inMenu?: boolean | null) => void;
}

export const EditMenuPage: React.FC = () => {
  const [selectedContainer, setSelectedContainer] = useState<"products" | "addOns">("products");

  return (
    <SelectedProductsProvider>
      {selectedContainer === "products" ? (
        <EditProductsContainer />
      ) : (
        <EditAddOnsContainer />
      )}
      <div>
        <button onClick={() => setSelectedContainer("products")}>Edit Products</button>
        <button onClick={() => setSelectedContainer("addOns")}>Edit Add-Ons</button>
      </div>
    </SelectedProductsProvider>
  );
};

const EditProductsContainer: React.FC = () => {
  const { selectedProducts, setSelectedProducts } = useSelectedProducts();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [categoryFilter, setCategoryFilter] = useState<Category | null>(null);
  const [availabilityFilter, setAvailabilityFilter] = useState<boolean | null>(null);
  const [inMenuFilter, setInMenuFilter] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const url = window.location.origin+"/api/products/v1.0";
        const url2 = window.location.origin+"/api/product-categories/v1.0";

        const data = await fetchDataWithRetry(url);
        const data2 = await fetchDataWithRetry(url2);

        setProducts(data);
        setCategories(data2);
      } catch (error) {

        console.error("Error fetching menu data:", error);
        return(
          <div>PAGE ENTRY PROHIBITED</div>
          )
      }
    };
    fetchMenuData();
  }, []);

  const removeProducts = async () => {
    selectedProducts.forEach(product =>{
      console.log(product.id);
      fetchDataWithRetry(window.location.origin + `/api/products/v1.0/${product.id}`,null, "DELETE").then().catch()
    })
  };

  const applyFilters = (category: Category | null, availability?: boolean | null, inMenu?: boolean | null) => {
    setCategoryFilter(category);
    setAvailabilityFilter(availability as boolean);
    setInMenuFilter(inMenu as boolean);
  };
  const filteredProducts = products.filter(product => {
    if (categoryFilter && product.category.id !== categoryFilter.id) {
      return false;
    }
    if (availabilityFilter !== null && product.isAvailable !== availabilityFilter) {
      return false;
    }
    if (inMenuFilter !== null && product.isInMenu !== inMenuFilter) {
      return false;
    }
    return true; 
  });

  return (
    <div>
      <Filters categories={categories} applyFilters={applyFilters}/>
      <div className="flex items-center overflow-hidden justify-center border border-b-gray-300 ">
        <div className="flex flex-row overflow-scroll overflow-x-hidden flex-wrap items-center justify-center max-h-screen">
          {filteredProducts.map((product) => (
            <Product product={product as unknown as ProductType} key={product.id} />
          ))}
        </div>
      </div>
      <div className="fixed flex flex-row bottom-0 right-0 p-4 justify-around items-stretch">
        <Link to={"/menu/edit/product/update/" + selectedProducts[0]?.id}>
          <button
            disabled={selectedProducts.length !== 1}
            className={
              selectedProducts.length === 1 ? "bg-blue-400" : "bg-gray-400"
            }
          >
            Edit Product
          </button>
        </Link>
        <Link to="/menu/edit/product/add">
          <button className="bg-green-500 hover:bg-green-600 rounded text-white">
            Add a Product
          </button>
        </Link>
        <button
          disabled={selectedProducts.length <= 0}
          className={
            selectedProducts.length >= 1 ? "bg-red-500 hover:bg-red-600" : "bg-gray-400"
          }
          onClick={()=>removeProducts()}>
          Delete
        </button>
        <button
          disabled={selectedProducts.length <= 0}
          className={
            selectedProducts.length >= 1 ? "bg-rose-600 hover:bg-rose-700" : "bg-gray-400"
          }>
          Remove from menu
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
        <img src={prop.product.image} className="h-3/6 w-4/6 object-cover" alt="pizza"></img>
        <p className="mt-2 text-center text-lg font-semibold">
          {prop.product.name}
        </p>
        <p className="mt-1 text-center text-gray-600">${prop.product.price}</p>
      </div>
    </button>
  );
};
const EditAddOnsContainer: React.FC = () => {
  const [addOns, setAddOns] = useState<AddOnType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<Category | null>(null);

  useEffect(() => {
    const fetchAddOnsData = async () => {
      try {
        const url = `${window.location.origin}/api/add-ons/v1.0`;
        const url2 = `${window.location.origin}/api/add-on-categories/v1.0`;
        const data = await fetchDataWithRetry(url);
        const data2 = await fetchDataWithRetry(url2);
        setAddOns(data);
        setCategories(data2);
      } catch (error) {
        console.error("Error fetching add-ons data:", error);
      }
    };
    fetchAddOnsData();
  }, []);

  const applyFilters = (category: Category | null) => {
    setCategoryFilter(category);
  };

  const filteredAddOns = addOns.filter(addOn => {
    if (categoryFilter && addOn.category.id !== categoryFilter.id) {
      return false;
    }
    return true;
  });


  return (
    <div>
      <Filters categories={categories} applyFilters={applyFilters} />
      <div className="flex items-center overflow-hidden justify-center border border-b-gray-300">
        <div className="flex flex-row overflow-scroll overflow-x-hidden flex-wrap items-center justify-center max-h-screen">
          {filteredAddOns.map((addOn) => (
            <Link to={"/menu/edit/addOn/update/"+addOn.id}>
              <AddOn addOn={addOn} key={addOn.id} />
            </Link>
          ))}
        </div>
        
      </div>
        <Link to="/menu/edit/addOn/add">
          <button className="bg-green-500 hover:bg-green-600 rounded text-white">
            Add an add on
          </button>
        </Link>
    </div>
  );
};

const AddOn: React.FC<{ addOn: AddOnType}> = ({ addOn }) => {
  return (
    <div>
      <div className={"font-medium flex flex-col items-center justify-center m-2 h-60 w-60 border rounded-md max-h-full "}>
        <p className="mt-2 text-center text-lg font-semibold">{addOn.name}</p>
        <p className="mt-1 text-center text-gray-600">${addOn.price}</p>
      </div>
    </div>
  );
};

const Filters: React.FC<FiltersProps> = ({ categories, applyFilters }) => {

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    const selectedCategory = categories.find(cat => cat.id === parseInt(categoryId)) || null;
    applyFilters(selectedCategory, null, null);
  };

  const handleAvailabilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const availability = e.target.value === "" ? null : e.target.value === "true";
    applyFilters(null, availability, null);
  };

  const handleInMenuChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const inMenu = e.target.value === "" ? null : e.target.value === "true";
    applyFilters(null, null, inMenu);
  };

  return (
    <div className="flex items-center justify-between p-4">
      <select className="mr-4" onChange={handleCategoryChange}>
        <option value="">All Categories</option>
        {categories.map(category => (
          <option key={category.id} value={category.id}>{category.name}</option>
        ))}
      </select>

      <select className="mr-4" onChange={handleAvailabilityChange}>
        <option value="">All Availability</option>
        <option value="true">Available</option>
        <option value="false">Not Available</option>
      </select>

      <select onChange={handleInMenuChange}>
        <option value="">All In Menu</option>
        <option value="true">In Menu</option>
        <option value="false">Not In Menu</option>
      </select>
    </div>
  );
};