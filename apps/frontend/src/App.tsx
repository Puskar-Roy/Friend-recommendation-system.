import { BrowserRouter, Route, Routes } from "react-router-dom";
import Hero from "./components/home/Hero";
import "./index.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";



function App() {


  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={<Hero />}
          />
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/register"
            element={<Register />}
          />

        </Routes>
        <Footer />

      </BrowserRouter>
    </>
  );
}

export default App;
