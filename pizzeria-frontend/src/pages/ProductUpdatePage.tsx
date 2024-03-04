import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { Category, ProductType } from "../utilities/types";
import { useParams } from "react-router-dom";
import { ImageDialogProvider, useDialog } from "../providers/DialogProvider";
import { fetchDataWithRetry } from "../utilities/functions/fetchAndRefresh";

const UpdateProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const numericId = parseInt(id as string, 10);
  const [isPreview, setPreview] = useState(false);
  const [product, setProduct] = useState<ProductType>();

  useEffect(() => {
    if(numericId === null || isNaN(numericId)){
      return;
    }
    const url = window.location.origin+`/api/products/v1.0/${numericId}`;
    fetchDataWithRetry(url)
      .then(data => {
        setProduct(data as ProductType);
      })
      .catch(error => {
        console.error('Error fetching product data:', error);
      });

  }, [numericId]);

  return (
    <>
      <div
        className={
          "flex h-screen justify-center items-center " +
          (isPreview ? "bg-blend-soft-light" : "")
        }
      >
        <Product
          product={product as ProductType}
          isPreview={isPreview}
          setPreview={setPreview}
        />
      </div>
    </>
    ) 
};

const Product: React.FC<{
  product: ProductType;
  isPreview: Boolean;
  setPreview: React.Dispatch<React.SetStateAction<boolean>>;
}> = (props) => {
  const [editProduct, setEditProduct] = useState<ProductType>(props.product);
  const [file, setFile] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const boolean = [
    {id:1, value:true},
    {id:2, value:false}
  ];

  useEffect(() => {
  
    setEditProduct(props.product);
    const url = window.location.origin+`/api/product-categories/v1.0/`;

    fetchDataWithRetry(url)
    .then(data => {
      setCategories(data as Category[]);
    })
    .catch(error => {
      console.error('Error fetching product data:', error);
    });
  }, [props.product]);
  
  const setFileInputRef = useCallback((node: HTMLInputElement) => {
    if (node) {
      fileInputRef.current = node;
    }
  }, []);

  const doChange = (property: Partial<ProductType>) => {
    console.log(property);
    setEditProduct({ ...editProduct, ...property });
  };

  const imageChange = (file: any) => {
    setFile(file);
  };

  const submit = () => {
    console.log(editProduct);
    
    const formData = new FormData();
    formData.append('name', editProduct.name);
    formData.append('categoryId', editProduct.categoryId?.toString() ? editProduct.categoryId.toString() : "1");
    formData.append('description', editProduct.description);
    formData.append('price', editProduct.price.toString());
    formData.append('isInMenu', editProduct.isInMenu ? "true":"false");
    formData.append('isAvailable', editProduct.isAvailable ? "true": "false");
    formData.append('image', file as Blob);
    console.log(formData);

    if(editProduct?.id === undefined){
      console.log("dasdsadsadsa")
      fetchDataWithRetry(window.location.origin+`/api/products/v1.0`,formData, "POST");
    }else{
      fetchDataWithRetry(window.location.origin+`/api/products/v1.0/${editProduct?.id}`,formData, "PATCH")

    }

  };

  const handleDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    
    <>
      <div className={"flex flex-col justify-center items-center "}>
        <label>Insert image:</label>
        <div>
          <button
            className="border self-center flex flex-row text-center justify-center"
            onClick={handleDialog}
          >
            {(editProduct?.id || file) && (
              <>
                {file ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className={"h-3/6 w-4/6 object-scale-down self-center"}
                  />
                ) : (
                  <img
                    src={editProduct?.image}
                    className="h-3/6 w-4/6 object-scale-down self-center"
                    alt="pizza"
                  ></img>
                )}
              </>
            )}
            <input
              type="file"
              id="fileInput"
              alt="import image"
              onChange={(e) => imageChange(e.target.files?.item(0))}
              ref={setFileInputRef}
              className="invisible"
            />
          </button>
        </div>
        <label>Name:</label>
        <textarea
          className="border resize-none self-center object-scale-down text-center max-h-fit min-w-[182px] max-w-md"
          title="Name"
          onChange={(e) => doChange({ name: e.currentTarget.value })}
          value={editProduct?.name || " "}
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
          value={editProduct?.description || ""}
        ></textarea>
        <label>Price:</label>
        <input
          type="number"
          className="border resize-none self-center object-scale-down max-h-fit min-w-[182px] max-w-md text-center"
          title="price"
          onChange={(e) => doChange({ price: Number(e.currentTarget.value) })}
          value={editProduct?.price}
        />
        <label>Is it in the menu</label>
        <select
          onChange={(e) =>
            doChange({
              isInMenu:
                boolean[e.currentTarget.options.selectedIndex].value,
            })
          }
        >
          {boolean.length &&
            boolean.map((bool) => (
              <option value={bool.id}>{String(bool.value)}</option>
            ))}
        </select>
        <label>Is it available</label>
        <select
          onChange={(e) =>
            doChange({
              isAvailable:
                boolean[e.currentTarget.options.selectedIndex].value,
            })
          }
        >
          {boolean.length &&
            boolean.map((bool) => (
              <option value={bool.id}>{String(bool.value)}</option>
            ))}
        </select>
        <button
          onClick={() => {
            submit();
          }}
        >
          submit
        </button>
      </div>
    </>
  );
};

export default UpdateProductPage;
