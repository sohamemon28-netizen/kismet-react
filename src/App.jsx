import { Routes, Route } from "react-router-dom";

import Cart from "./pages/Cart";
import Header from "./components/header.jsx";
import Footer from "./components/Footer";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProductDetail from "./pages/ProductDetail";
import Admin from "./pages/Admin.jsx";
import AdminProducts from "./pages/AdminProducts.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import Register from "./pages/Register.jsx";
import Account from "./pages/Account.jsx";
import Checkout from "./pages/Checkout.jsx";
import Orders from "./pages/Orders.jsx";
import AdminOrders from "./pages/AdminOrders.jsx";
import PaymentTest from "./pages/PaymentTest.jsx";

import "./App.css";

function App() {
    return (
        <>
            <Header />

            <main>
                <Routes>

                    <Route
                        path="/cart"
                        element={<Cart />}
                    />

                    <Route
                        path="/"
                        element={<Home />}
                    />

                    <Route
                        path="/shop"
                        element={<Shop />}
                    />

                    <Route
                        path="/about"
                        element={<About />}
                    />

                    <Route
                        path="/contact"
                        element={<Contact />}
                    />

                    <Route
                        path="/product/:id"
                        element={<ProductDetail />}
                    />

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    <Route
                        path="/account"
                        element={<Account />}
                    />

                    <Route
                        path="/checkout"
                        element={<Checkout />}
                    />

                    {/* LOCAL TEST CARD PAYMENT */}
                    <Route
                        path="/payment-test"
                        element={<PaymentTest />}
                    />

                    <Route
                        path="/orders"
                        element={<Orders />}
                    />

                    <Route
                        path="/admin"
                        element={
                            <AdminRoute>
                                <Admin />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/orders"
                        element={
                            <AdminRoute>
                                <AdminOrders />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/products"
                        element={
                            <AdminRoute>
                                <AdminProducts />
                            </AdminRoute>
                        }
                    />

                </Routes>
            </main>

            <Footer />
        </>
    );
}

export default App;