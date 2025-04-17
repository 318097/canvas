import "./App.css";
import Raw from "./components/Raw";
import Auth from "./components/Auth";
import { Route, Routes } from "react-router";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, getConfigFromFirestore, validateUserInFireDb } from "./firebase";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setInitialState } from "./store";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        await validateUserInFireDb();
        const userConfig = await getConfigFromFirestore();
        dispatch(setInitialState(userConfig));
      } else {
        navigate("/auth");
      }
    });
  }, []);
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Raw />} />
        <Route path="/home" element={<Raw />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </div>
  );
}

export default App;
