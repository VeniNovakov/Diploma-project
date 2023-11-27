import React, { useEffect, useRef, useState } from "react";
import pizza from "../images/pizza.jpg";
import menu from "../json/menu.json";
import { AddOn, ProductType } from "../types";
import { useParams } from "react-router-dom";
import add_ons from '../json/add-ons.json'
import Cookies from "js-cookie";
import { useBasketContent } from "../providers/BasketContentProvider";

 
interface AddOnType {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface AddOnBasketType extends AddOnType{
  amount: number;
}

interface ToppingSection {
  sectionName: string;
  toppings: AddOnType[];
}

interface ChangeAmountProps {
  item: AddOnType | ProductType;
  className?: string; 
  amount: number;
  setAmount: React.Dispatch<React.SetStateAction<number>>;
}

interface TempCookie {
  addOns: AddOnBasketType[];
  product: ProductType;
  amount: number
}

const ChangeAmount: React.FC<ChangeAmountProps> = ({item, className, amount, setAmount}) => {
  const [isDisabled, setIsDisabled] = useState(true);

  function instanceOfProduct(object: any): object is ProductType {
    return 'id' in object &&'name' in object && 'price' in object && 'description' in object && 'category' in object;
  }
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      Cookies.remove('tempProduct');
      firstRender.current = false;
      return;
    }

    if(instanceOfProduct(item)){
      if(Cookies.get('tempProduct')){
        let ck: TempCookie = JSON.parse(Cookies.get('tempProduct') || ' ');
      
        ck.amount = amount;
        Cookies.set('tempProduct', JSON.stringify(ck));
      }else{
        Cookies.set('tempProduct', JSON.stringify({addOns: [] as AddOnType[], product: item, amount: amount}))
      }
      return
    }
    if(Cookies.get('tempProduct')){
      const ck: TempCookie = JSON.parse(Cookies.get('tempProduct') || '');
      const updatedAddOns = ck.addOns ? ck.addOns?.map((addOn => {
        if (addOn?.id === item?.id) {
          const updatedItem = {
            ...item,
            amount: amount,
          };
          return amount ? updatedItem: null;
        } else {
          return addOn;
        }
      })).filter(addOn => addOn !== null):[]

      if(updatedAddOns.length < ck.addOns.length){
        Cookies.set('tempProduct', JSON.stringify({...ck, addOns: [...updatedAddOns.filter(addOn => addOn !== null)]}));
        return;
      }
      if(JSON.stringify(updatedAddOns) === JSON.stringify(ck.addOns)){
        Cookies.set('tempProduct', JSON.stringify({...ck, addOns: [...ck.addOns, {...item, amount}]}))
      }else{
        Cookies.set('tempProduct', JSON.stringify({...ck, addOns: [...updatedAddOns]}));
      }
    }
    }, [amount])

  const removeAmount = () => {
    if (amount > 1 && instanceOfProduct(item)) {
      amount--;
      setAmount(amount); 
    }else if(amount > 0 && !instanceOfProduct(item)){
      amount--;
      setAmount(amount); 
    }

    if(amount === 1 && instanceOfProduct(item)){
      console.log('dsadsad');
    }else if(amount === 0 && !instanceOfProduct(item)){
      setIsDisabled(true);
    }
    
  };

  const addAmount = () => {
    setAmount(amount + 1);
    if(isDisabled){
      setIsDisabled(false);
    }
  };



  return (
    <div className={`flex flex-row ${className || ''}`}>
      <button onClick={removeAmount} className={`border self-end`} >
        -
      </button>
      <p>{amount}</p>
      <button onClick={addAmount} className="border self-end">
        +
      </button>
    </div>
  )
}


const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const numericId = parseInt(id as string, 10);
  const [ productAmount, SetProductAmount ] = useState(1);
  const {basketItems, setBasketItems} = useBasketContent();
  const selectedItem: ProductType | undefined = menu.find((item) => item.id === numericId);
  const submitOrder = () => {
    //when clicked it will add it to the basket cookie
    const tempProduct = JSON.parse(Cookies.get('tempProduct') || '');
    Cookies.set('basket', JSON.stringify([...basketItems, tempProduct]));
    setBasketItems(JSON.parse(Cookies.get('basket') || '[]'));
  }


  return (
    <div className="flex flex-row justify-around">
      <Additions sections={add_ons.toppingSections} />
      <div className="flex flex-col justify-center">
        {selectedItem && <Product {...menu[numericId - 1]} amount={productAmount} />}
        <div className="flex flex-col">
          <button onClick={submitOrder} className="border bg-slate-200 hover:bg-slate-300 rounded-md w-full">order</button>
          <ChangeAmount item={menu[numericId-1]} className="justify-center" amount={productAmount} setAmount={SetProductAmount}/>
        </div>
      </div>
    </div>
  );
};

const Additions: React.FC<{ sections: ToppingSection[] }> = ({ sections }) => {
  return (
    <div className="flex flex-col">
      {sections.map((section) => (
        <AdditionsSection key={section.sectionName} section={section} />
      ))}
    </div>
  );
};

const AdditionsSection: React.FC<{ section: ToppingSection }> = ({ section }) => {
  return (
    <div className="flex-col border rounded-md p-12 bg-amber-100">
      <h3 className="font-bold self-start">{section.sectionName}</h3>
      {section.toppings.map((topping) => (
        <AdditionElement id={topping.id} name={topping.name} description={topping.description} price={topping.price}/>
      ))}
    </div>
  );
};

const AdditionElement = (topping: AddOnType) => {
  const [ amount, setAmount ] = useState<number>(0)
  return (
    <div className="flex flex-row overflow-hidden">
      <div className="group/item flex-row flex">
        <p className="">{topping.name}</p>
        <div className="flex absolute rounded-md invisible group/item group-active/item:visible group-hover/item:scale-110 group-hover/item:cursor-default bg-slate-300  transition group-active/item:ease-in-out delay-150 duration-300">
          <p>{topping.description}</p>
        </div>
      </div>
      <ChangeAmount item={topping} amount={amount} setAmount={setAmount}/>
    </div>
  );
};


const Product = (props: ProductType & {amount: number}) => {
  return (
    <div className="flex flex-col border border-gray-300 rounded p-4 max-w-md self-end">
      <img src={pizza} alt="pizza" className="max-w-full h-auto rounded mb-2" />
      <p className="font-bold">{props.name}</p>
      <p className="text-gray-700">{props.description}</p>
      <p className="text-blue-500 font-bold">{props.price * props.amount}</p>
    </div>
  );
};

export default ProductPage;
