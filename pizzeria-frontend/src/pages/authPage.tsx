import React from "react";

const Auth = () => {
  return (
    <div className="bg-gradient-to-r from-amber-200 to-amber-400 min-h-screen flex items-center justify-center">
    <div className="bg-amber-400 p-8 rounded-md shadow-md">
        <h1 className="text-3xl font-bold mb-4 text-center text-white">Authentication</h1>
        <form className="flex flex-col space-y-4">
            <input
                type="text"
                className="w-full py-2 px-4 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Name"
            />
            <input
                type="password"
                className="w-full py-2 px-4 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Password"
            />
            <button
                className="w-full py-2 px-4 bg-amber-700 text-white rounded-md hover:bg-amber-800 focus:outline-none focus:ring focus:border-blue-300"
            >
                Log In
            </button>
        </form>
    </div>
</div>

  );
};

export default Auth;
