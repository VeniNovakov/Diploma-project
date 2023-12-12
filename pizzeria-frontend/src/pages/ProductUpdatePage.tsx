import React, { FC, useState } from "react";
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

const ImageInsertDialog = () =>{
  const {showDialog, setShowDialog} = useDialog();

  return (
  <div>
    {
    0 && 
    <div className="flex justify-center items-center object-scale-down object-center absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/4 h-1/3 bg-slate-700">
      <input type='file'></input>
    </div>
    }
  </div>
    )

}
const Product: React.FC<{product: ProductType } & {isPreview:Boolean, setPreview:React.Dispatch<React.SetStateAction<boolean>>}> = (props) => {
  const [editProduct, setProduct] = useState<ProductType>(props.product);
  const [file, setFile] = useState(null);
  const {showDialog, setShowDialog} = useDialog();

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

  const handlePreviewClick = () => {
    if (file) {
      alert(`Previewing: ${file}`);
      props.setPreview(!props.isPreview);
    } else {
      alert('No file selected for preview.');
    }
  };

  const handleDialog = () => {
    setShowDialog(!showDialog);
  }
  
  return (
  <>
    <ImageInsertDialog/>
    <div className={"flex flex-col justify-center items-center "}>
      <label>Insert image:</label>
      <div>
      {props.isPreview && file && (
        <div>
          <button onClick={handlePreviewClick}>Preview</button>
          <div className="flex justify-center items-center">
            <button className="right-0 top-0 absolute" onClick={handlePreviewClick}>X</button>
            <img src={URL.createObjectURL(file)} alt="Preview" className={"absolute max-w-full  object-scale-down self-center " + (props.isPreview?"bg-opacity-70":" ")} />
          </div>
        </div>
      )}

      <button className="border self-center flex flex-row text-center justify-center" 
            onClick={handleDialog}
            >
        {editProduct?.id? (
          <img
            src={pizza}
            className="h-3/6 w-4/6 object-scale-down self-center"
            alt="pizza"
          ></img>
        ) : (
          <input type="file" alt="import image" onChange={e => imageChange(e.target.files?.item(0))}/>
        )}
      </button>
      </div>
      <label>Name:</label>
      <div
        contentEditable
        className="border resize-none self-center object-scale-down text-center max-h-fit min-w-[182px] max-w-md"
        title="Name"
        onKeyDown={(e) => doChange({ name: e.currentTarget.innerHTML })}
        dangerouslySetInnerHTML={{ __html: editProduct?.name || " " }}
      ></div>
      <label>Category:</label>
      <select onChange={(e) => doChange({ category: categories.categories[e.currentTarget.options.selectedIndex-1].name })}>
        <option hidden>{editProduct?.category}</option>
        {categories.categories.length && categories.categories.map(category =>(<option value={category.name}>{category.name}</option>))}
      </select>
      <label>Description:</label>
      <div
        contentEditable
        className="border resize-none self-center object-scale-down text-center min-w-[182px] max-h-fit max-w-md"
        title="description"
        onKeyUp={(e) => doChange({ description: e.currentTarget.innerHTML })}
        dangerouslySetInnerHTML={{ __html: editProduct?.description || " " }}
      ></div>
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
