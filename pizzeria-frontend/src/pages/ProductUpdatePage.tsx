import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { ProductType } from "../utilities/types";
import menu from "../json/menu.json";
import { useParams } from "react-router-dom";
import pizza from "../images/pizza.jpg";
import categories from '../json/categories.json'
import { ImageDialogProvider, useDialog } from "../providers/DialogProvider";

const UpdateMenuPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const numericId = parseInt(id as string, 10);
  const [isPreview, setPreview] = useState(false);
  
  return (
    <ImageDialogProvider>
      <div className={"flex h-screen justify-center items-center " + (isPreview ? "bg-blend-soft-light" : "")}>
        <Product product={menu[numericId - 1]} isPreview={isPreview} setPreview={setPreview}/>
      </div>
    </ImageDialogProvider>
  );
};


const Product: React.FC<{product: ProductType } & {isPreview:Boolean, setPreview:React.Dispatch<React.SetStateAction<boolean>>}> = (props) => {
  const [editProduct, setProduct] = useState<ProductType>(props.product);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const setFileInputRef = useCallback((node: HTMLInputElement) => {
    if (node) {
      fileInputRef.current = node;
    }
  }, []);

  const doChange = (property: Partial<ProductType>) => {
    console.log(property)
    setProduct({ ...editProduct, ...property });
  };

  const imageChange = (file: any)=>{
    setFile(file);
  }

  const submit = () => {
    console.log(editProduct);
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
      {(editProduct?.id || !file) && (
        <>
          {file ? (
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className={"h-3/6 w-4/6 object-scale-down self-center"}
            />
          ) : (
            <img
              src={pizza}
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
          className="invisible absolute"
      />
    </button>
      </div>
      <label>Name:</label>
      <textarea
        className="border resize-none self-center object-scale-down text-center max-h-fit min-w-[182px] max-w-md"
        title="Name"
        onChange={(e) => doChange({ name: e.currentTarget.value })}
        value={editProduct?.name || " " }
      ></textarea>
      <label>Category:</label>
      <select onChange={(e) => doChange({ category: categories.categories[e.currentTarget.options.selectedIndex-1].name })}>
        <option hidden>{editProduct?.category}</option>
        {categories.categories.length && categories.categories.map(category =>(<option value={category.name}>{category.name}</option>))}
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

export default UpdateMenuPage;
