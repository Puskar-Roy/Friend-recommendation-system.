import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Hero from "./components/home/Hero";
import "./index.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import { useAuthContext } from "./hooks/useAuthContext";



function App() {

  const { state } = useAuthContext();
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>  
        <Route
            path="/"
            element={state.user ? <Hero /> : <Navigate to="/login" />}
          />
        <Route
            path="/login"
            element={!state.user ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={!state.user ? <Register /> : <Navigate to="/" />}
          />

        </Routes>
        <Footer />

      </BrowserRouter>
    </>
  );
}

export default App;
