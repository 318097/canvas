import React from "react";
import {
  getAuth,
  signInAnonymously,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useNavigate } from "react-router";
import { Button } from "antd";
import { validateUserInFireDb } from "../firebase";
import config from "../config";

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const handleLogin = (type) => {
    setLoading(true);
    const auth = getAuth();

    const authFn =
      type === "google"
        ? signInWithPopup(auth, new GoogleAuthProvider())
        : signInAnonymously(auth);
    authFn
      .then(async (user) => {
        const userId = user.user.uid;
        const userEmail = user.user.email || "";
        const userName = user.user.displayName || "Guest";
        const userPhoto = user.user.photoURL;

        await validateUserInFireDb({
          userId,
          userEmail,
          userName,
          userPhoto,
        });
        navigate("/home");
      })
      .catch((error) => {
        console.error("Error during anonymous login:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex justify-center items-center h-screen grid-bg">
      <div className="w-96 h-[500px] p-12 bg-white shadow-lg rounded flex flex-col items-center justify-center">
        <div className="grow flex flex-col items-center pt-6">
          <h1 className="text-2xl font-bold">{config.appName}</h1>
          <p className="text-gray-600 mb-6 text-center">{config.tagline}</p>
        </div>
        <div className="flex flex-col items-stretch justify-center w-full gap-4 ">
          <Button
            disabled={loading}
            loading={loading}
            type="primary"
            size="large"
            onClick={() => handleLogin("google")}
          >
            Login with Google
          </Button>
          <Button
            disabled={loading}
            loading={loading}
            size="large"
            onClick={() => handleLogin("anonymous")}
          >
            Login as Guest
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
