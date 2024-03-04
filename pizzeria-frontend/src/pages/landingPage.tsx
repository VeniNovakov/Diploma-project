import NavBar from "../components/NavBar";
import React from "react";

export default function LandingPage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">Welcome to pizzeria</h1>
      </div>
    </div>
  );
}