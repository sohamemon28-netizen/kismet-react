import { Routes, Route } from "react-router-dom";
import Cart from "./pages/Cart";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Contact from "./pages/Contact";

import "./App.css";

function App() {

    return (

        <>

            <Header />

            <Routes>
<Route path="/cart" element={<Cart />} />
                <Route path="/" element={<Home />} />

                <Route path="/shop" element={<Shop />} />

                <Route path="/about" element={<About />} />

                <Route path="/contact" element={<Contact />} />

            </Routes>

            <Footer />

        </>

    );

}

export default App;