import React, { FC, useEffect, useState } from "react";
import { AddOnType, Category, ProductType } from "../utilities/types";
import { useParams } from "react-router-dom";
import { fetchDataWithRetry } from "../utilities/functions/fetchAndRefresh";
import toast, { Toaster } from "react-hot-toast";

const UpdateAddOnPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const numericId = parseInt(id as string, 10);

  const [product, setProduct] = useState<AddOnType>();

  useEffect(() => {
    if(numericId === null || isNaN(numericId)){
      return;
    }
    const url = window.location.origin+`/api/add-ons/v1.0/${numericId}`;
    fetchDataWithRetry(url)
      .then(data => {
        setProduct(data as AddOnType);
      })
      .catch(error => {
        console.error('Error fetching product data:', error);
      });

  }, [numericId]);

  return (
        <AddOn
          addOn={product as AddOnType}
        />
  );
};

const AddOn: React.FC<{
  addOn: AddOnType;

}> = (props) => {
  const [editAddOn, setEditAddOn] = useState<AddOnType>(props.addOn);
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
  
    setEditAddOn(props.addOn);
    const url = window.location.origin+`/api/add-on-categories/v1.0/`;

    fetchDataWithRetry(url)
    .then(data => {
      setCategories(data as Category[]);
    })
    .catch(error => {
      console.error('Error fetching product data:', error);
    });
  }, [props.addOn]);
  
  const doChange = (property: Partial<AddOnType>) => {
    if(property?.category){
      property.categoryId = property.category.id;
    }
    setEditAddOn({ ...editAddOn, ...property });
  };

  const remove = () => {
    const url = window.location.origin+`/api/add-ons/v1.0/${editAddOn?.id}`;

    fetchDataWithRetry(url, null, "DELETE")
    .then(data => {
        toast.success("Successfully deleted add on", {duration:3000});
        setTimeout(navigate, 2700);
    })
    .catch(error => {
      console.error('Error fetching addOn data:', error);
    });
  }

  const navigate = () =>{
    window.location.href = "/menu/edit";

  }
  
  const submit = () => {
    
    const newAddOn: Partial<AddOnType> = {
      name: editAddOn.name,
      description: editAddOn.description,
      categoryId: editAddOn.category.id,
      amountInGrams: editAddOn.amountInGrams,
      price: editAddOn.price,
    }

    if(editAddOn?.id === undefined){
      fetchDataWithRetry(window.location.origin+`/api/add-ons/v1.0`,JSON.stringify(newAddOn), "POST", {'Content-type':'application/json'})
      .then(data =>{
        toast.success("Successfully added add on", {duration:3000})
        setTimeout(navigate, 2700);
      }
      )
      .catch()
    }else{
      fetchDataWithRetry(window.location.origin+`/api/add-ons/v1.0/${editAddOn?.id}`,JSON.stringify(newAddOn), "PATCH", {'Content-type':'application/json'})
      .then(data =>{
        toast.success("Successfully edited add on", {duration:3000})
        setTimeout(navigate, 2700);
      }
      )
      .catch()
    }

  };

  return (
    <>
      <div className={"flex flex-col justify-center items-center "}>
       
        <label>Name:</label>
        <textarea
          className="border resize-none self-center object-scale-down text-center max-h-fit min-w-[182px] max-w-md"
          title="Name"
          onChange={(e) => doChange({ name: e.currentTarget.value })}
          value={editAddOn?.name || " "}
        ></textarea>
        <label>Category:</label>
        <select
          onChange={(e) =>
            doChange({
              categoryId:categories[e.currentTarget.options.selectedIndex].id,
              category:{
                id: categories[e.currentTarget.options.selectedIndex].id,
                name: categories[e.currentTarget.options.selectedIndex].name,
              },
            })
          }
        >
          {categories.length &&
            categories.map((category) => (
              <option value={category.id}>{category.name}</option>
            ))}
        </select>
        <label>Description:</label>
        <textarea
          className="border resize-none self-center object-scale-down text-center min-w-[182px] max-h-fit max-w-md"
          title="description"
          onChange={(e) => doChange({ description: e.currentTarget.value })}
          value={editAddOn?.description || ""}
        ></textarea>
        <label>Price:</label>
        <input
          type="number"
          className="border resize-none self-center object-scale-down max-h-fit min-w-[182px] max-w-md text-center"
          title="price"
          onChange={(e) => doChange({ price: Number(e.currentTarget.value) })}
          value={editAddOn?.price}
        />
        <label>Amount in Grams per serving:</label>
        <input
          type="number"
          className="border resize-none self-center object-scale-down max-h-fit min-w-[182px] max-w-md text-center"
          title="price"
          onChange={(e) => doChange({ amountInGrams: Number(e.currentTarget.value) })}
          value={editAddOn?.amountInGrams}
        />
        <button
          onClick={() => {
            submit();
          }}
        >
          submit
        </button>
        <button
        className={!editAddOn?.id? "invisible":" border bg-red-500 hover:bg-red-600"}
          onClick={() => {
            remove();
          }}
        >
          remove
        </button>
        <Toaster/>
      </div>
    </>
  );
};

export default UpdateAddOnPage;
