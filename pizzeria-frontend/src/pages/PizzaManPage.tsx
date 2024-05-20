import { Link } from "react-router-dom";
import React from "react";

const PizzaManPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">PizzaMan Dashboard</h1>
      <div className="space-y-4">
        <Link to="/orders">
          <button className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-300">
            Go to Orders Page
          </button>
        </Link>

        <Link to="/menu/edit">
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-300">
            Edit Menu
          </button>
        </Link>

        <Link to="/">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-300">
            Go to Landing Page
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PizzaManPage;
