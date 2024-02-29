import { Link } from "react-router-dom";
import React, { useState } from "react";

const PizzaManPage = () => {
  const [isAuth, setAuth] = useState<boolean>(true);
  
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Link to="/orders">
        <button className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-full mb-4 focus:outline-none focus:shadow-outline">
          Go to Orders Page
        </button>
      </Link>

      <Link to="/menu/edit">
        <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline">
          Edit Menu
        </button>
      </Link>
    </div>
  );
};

export default PizzaManPage;
