import { BrowserRouter, Route, Routes } from "react-router-dom";
import Hero from "./components/home/Hero";
import "./index.css";



function App() {


  return (
    <>
      <BrowserRouter>
       
        <Routes>
          <Route
            path="/"
            element={ <Hero /> }
          />
         
        </Routes>
    
      </BrowserRouter>
    </>
  );
}

export default App;
