import React from "react";
import { getAuth, signInAnonymously } from "firebase/auth";
import { useNavigate } from "react-router";

const Auth = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    const auth = getAuth();
    signInAnonymously(auth)
      .then(() => {
        console.log("Anonymous login successful");
        navigate("/home");
      })
      .catch((error) => {
        console.error("Error during anonymous login:", error);
      });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <button
        className="px-4 py-2 text-lg font-medium text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  );
};

export default Auth;
