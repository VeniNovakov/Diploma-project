import React, { useEffect, useState } from "react";
import pizza from "../images/pizza.jpg";
import menu from "../json/menu.json";
import { ProductType } from "../types";
import { useParams } from "react-router-dom";
import add_ons from '../json/add-ons.json'

interface Addition {
  id: number;
  name: string;
}

interface AdditionsSectionProps {
  section: {
    id: number;
    name: string;
    additions: Addition[];
  };
}

interface AdditionProps {
  name: string;
}

interface Topping {
  id: number;
  name: string;
  description: string;
}

interface ToppingSection {
  sectionName: string;
  toppings: Topping[];
}
interface ChangeAmountProps {
  className?: string; 
}

const ChangeAmount: React.FC<ChangeAmountProps> = ({className}) => {
  const [ amount, setAmount ] = useState(0);

  const removeAmount = () => {
    if (amount > 0) {
      setAmount(amount - 1);
    }
  };

  const addAmount = () => {
    setAmount(amount + 1);
  };

  return (
    <div className={`flex flex-row ${className || ''}`}>
      <button onClick={removeAmount} className="border self-end">
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

  useEffect(() => {
    if (!isNaN(numericId)) {
      console.log(numericId);
    } else {
      console.error("Invalid or undefined ID");
    }
  }, [id]);



  const selectedItem: ProductType | undefined = menu.find((item) => item.id === numericId);

  return (
    <div className="flex flex-row justify-around">
      <Additions sections={add_ons.toppingSections} />
      <div className="flex flex-col justify-center">
        {selectedItem && <Product {...menu[numericId - 1]} />}
        <div className="flex flex-col">
          <button className="border bg-slate-200 hover:bg-slate-300 rounded-md w-full">order</button>
          <ChangeAmount className="justify-center"/>
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
        <AdditionElement key={topping.id} name={topping.name} />
      ))}
    </div>
  );
};

const AdditionElement = ({ name }: any) => {

  return (
    <div className="flex flex-row">
      <p>{name}</p>
      <ChangeAmount/>
    </div>
  );
};


const Product = (props: ProductType) => {
  return (
    <div className="flex flex-col border border-gray-300 rounded p-4 max-w-md self-end">
      <img src={pizza} alt="pizza" className="max-w-full h-auto rounded mb-2" />
      <p className="font-bold">{props.name}</p>
      <p className="text-gray-700">{props.description}</p>
      <p className="text-blue-500 font-bold">{props.price}</p>
    </div>
  );
};

export default ProductPage;
