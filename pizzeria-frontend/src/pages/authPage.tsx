import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

interface RegisterDto {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Auth: React.FC = () => {
  const [formData, setFormData] = useState<RegisterDto>({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  const { name, email, password, confirmPassword } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: e.target.value });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email) && isRegistering) {
        toast.error("Email format is wrong", {duration:2000})
        return;
      }

    fetch(`${window.location.origin}/api/auth/v1.0/${isRegistering ? "register" : "login"}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      handleSuccess(data); 
    })
    .catch(error => {
      handleError(error); 
    });
  };
  
  const handleSuccess = (data: any) => {
    localStorage.setItem("authRefresh", data.refreshToken);
    localStorage.setItem("authAccess", data.accessToken);
    window.location.href = "/"
    console.log(`${isRegistering ? "Register" : "Login"} successful`, data);
  };
  
  const handleError = (error: any) => {
    toast.error(`${isRegistering ? "Register" : "Login"} failed`, error);
  };

  const toggleAuthAction = () => {
    setIsRegistering(!isRegistering);
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
  };

  return (
    <div className="bg-gradient-to-r from-amber-200 to-amber-400 min-h-screen flex items-center justify-center">
      <div className="bg-amber-400 p-8 rounded-md shadow-md">
        <h1 className="text-3xl font-bold mb-4 text-center text-white">
          {isRegistering ? "Register" : "Login"}
        </h1>
        <form className="flex flex-col space-y-4" onSubmit={onSubmit}>
        {isRegistering && (
            <input
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              className="w-full py-2 px-4 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring focus:border-blue-300"
              placeholder="name"
            />
          )}
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            className="w-full py-2 px-4 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Email"
          />

          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            className="w-full py-2 px-4 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Password"
          />
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={onChange}
            className="w-full py-2 px-4 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Confirm Password"
          />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-amber-700 text-white rounded-md hover:bg-amber-800 focus:outline-none focus:ring focus:border-blue-300"
          >
            {isRegistering ? "Register" : "Log In"}
          </button>
        </form>
        <button
          onClick={toggleAuthAction}
          className="w-full mt-4 py-2 px-4 bg-gray-700 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring focus:border-blue-300"
        >
          {isRegistering ? "Already have an account? Log In" : "Don't have an account? Register"}
        </button>
      </div>
      <Toaster/>
    </div>
  );
};

export default Auth;
