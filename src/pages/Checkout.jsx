import { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { API_BASE } from "../config/api";
import "../styles/Checkout.css";

function Checkout() {
    const { cart, setCart } = useContext(CartContext);

    const {
        isLoggedIn,
        token,
        user,
        setUser
    } = useContext(AuthContext);

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Payment method: COD or Card
    const [paymentMethod, setPaymentMethod] = useState("cod");

    const [customerDetails, setCustomerDetails] = useState({
        fullName: user?.name || "",
        phone: user?.phone || "",
        address: user?.address || "",
        city: user?.city || ""
    });

    const pakistanCities = [
        "Karachi",
        "Lahore",
        "Faisalabad",
        "Rawalpindi",
        "Gujranwala",
        "Multan",
        "Hyderabad",
        "Peshawar",
        "Quetta",
        "Islamabad",
        "Sargodha",
        "Sialkot",
        "Bahawalpur",
        "Jhang",
        "Sheikhupura",
        "Gujrat",
        "Sukkur",
        "Larkana",
        "Sahiwal",
        "Okara",
        "Abbottabad",
        "Mardan",
        "Mingora",
        "Rahim Yar Khan",
        "Dera Ghazi Khan",
        "Wah Cantt",
        "Kasur",
        "Nawabshah",
        "Chiniot",
        "Jhelum",
        "Mansehra",
        "Gwadar",
        "Murree",
        "Gilgit",
        "Muzaffarabad"
    ];

    const total = cart.reduce(
        (sum, item) =>
            sum + Number(item.price) * item.quantity,
        0
    );

    function handleChange(e) {
        const { name, value } = e.target;

        setCustomerDetails((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    if (cart.length === 0) {
        return (
            <main className="checkout-page">
                <div className="checkout-container">
                    <p className="checkout-eyebrow">
                        CHECKOUT
                    </p>

                    <h1>Your bag is empty.</h1>

                    <button
                        type="button"
                        onClick={() => navigate("/shop")}
                    >
                        Continue Shopping
                    </button>
                </div>
            </main>
        );
    }

    async function handlePlaceOrder() {
        try {
            setLoading(true);
            setError("");

            /*
            =====================================================
            VALIDATE DELIVERY DETAILS
            =====================================================
            */

            if (
                !customerDetails.fullName.trim() ||
                !customerDetails.phone.trim() ||
                !customerDetails.address.trim() ||
                !customerDetails.city
            ) {
                setError(
                    "Please complete all delivery details before placing your order."
                );

                return;
            }

            /*
            =====================================================
            PREPARE ORDER ITEMS
            =====================================================
            */

            const orderItems = cart.map((item) => ({
                product: item._id,
                quantity: item.quantity,
                price: Number(item.price),
                name: item.title
            }));

            const trimmedCustomerDetails = {
                fullName:
                    customerDetails.fullName.trim(),

                phone:
                    customerDetails.phone.trim(),

                address:
                    customerDetails.address.trim(),

                city:
                    customerDetails.city
            };

            /*
            =====================================================
            CARD PAYMENT — STRIPE
            =====================================================
            */

            if (paymentMethod === "card") {
                const response = await fetch(
                    `${API_BASE}/api/payments/create-checkout-session`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },

                        body: JSON.stringify({
                            items: orderItems,
                            total,
                            customerDetails:
                                trimmedCustomerDetails
                        })
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Unable to start card payment."
                    );
                }

                /*
                =====================================================
                STRIPE CHECKOUT URL
                =====================================================

                The backend should have created/saved a pending
                card order in MongoDB before returning this URL.

                Stripe/webhook logic can then update:

                paymentMethod → card
                paymentStatus → paid / failed
                stripeSessionId → Stripe session ID
                */

                if (!data.url) {
                    throw new Error(
                        "Stripe Checkout URL was not returned."
                    );
                }

                /*
                Redirect customer to Stripe Checkout.
                */

                window.location.href = data.url;

                return;
            }

            /*
            =====================================================
            CASH ON DELIVERY
            =====================================================
            */

            const response = await fetch(
                `${API_BASE}/api/orders`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        items: orderItems,
                        total,
                        customerDetails:
                            trimmedCustomerDetails,

                        paymentMethod: "cod"
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to place your order."
                );
            }

            /*
            =====================================================
            UPDATE USER DETAILS
            =====================================================
            */

            if (data.user) {
                setUser(data.user);
            }

            /*
            =====================================================
            CLEAR CART
            =====================================================
            */

            setCart([]);

            /*
            =====================================================
            GO TO ORDERS
            =====================================================
            */

            navigate("/orders", {
                state: {
                    message:
                        "Your order was placed successfully with Cash on Delivery."
                }
            });

        } catch (error) {
            setError(
                error.message ||
                "Something went wrong while placing your order."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="checkout-page">
            <div className="checkout-container">

                {/* HEADER */}

                <div className="checkout-heading">

                    <p className="checkout-eyebrow">
                        CHECKOUT
                    </p>

                    <h1>
                        Complete your order.
                    </h1>

                    <p>
                        Enter your delivery details and
                        review your order before placing it.
                    </p>

                </div>

                {/* ERROR */}

                {error && (
                    <p className="checkout-error">
                        {error}
                    </p>
                )}

                {/* CHECKOUT CONTENT */}

                <div className="checkout-layout">

                    {/* LEFT SIDE — DELIVERY DETAILS */}

                    <section className="customer-details">

                        <div className="section-heading">

                            <p className="checkout-eyebrow">
                                DELIVERY
                            </p>

                            <h2>
                                Where should we deliver?
                            </h2>

                            <p>
                                Your saved details are already
                                filled in. You can edit them
                                before placing your order.
                            </p>

                        </div>

                        <div className="checkout-form">

                            {/* FULL NAME */}

                            <div className="form-group">

                                <label htmlFor="fullName">
                                    FULL NAME
                                </label>

                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    placeholder="Your full name"
                                    value={
                                        customerDetails.fullName
                                    }
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            {/* PHONE */}

                            <div className="form-group">

                                <label htmlFor="phone">
                                    PHONE NUMBER
                                </label>

                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="03XX XXXXXXX"
                                    value={
                                        customerDetails.phone
                                    }
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            {/* CITY */}

                            <div className="form-group">

                                <label htmlFor="city">
                                    CITY
                                </label>

                                <select
                                    id="city"
                                    name="city"
                                    value={
                                        customerDetails.city
                                    }
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">
                                        Select your city
                                    </option>

                                    {pakistanCities.map(
                                        (city) => (
                                            <option
                                                key={city}
                                                value={city}
                                            >
                                                {city}
                                            </option>
                                        )
                                    )}

                                </select>

                            </div>

                            {/* ADDRESS */}

                            <div className="form-group">

                                <label htmlFor="address">
                                    DELIVERY ADDRESS
                                </label>

                                <textarea
                                    id="address"
                                    name="address"
                                    rows="4"
                                    placeholder="House / apartment, street, area..."
                                    value={
                                        customerDetails.address
                                    }
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                        </div>

                    </section>

                    {/* RIGHT SIDE — ORDER */}

                    <div className="checkout-order-column">

                        {/* ORDER ITEMS */}

                        <section className="checkout-items">

                            <div className="section-heading">

                                <p className="checkout-eyebrow">
                                    YOUR ORDER
                                </p>

                                <h2>
                                    Review your pieces.
                                </h2>

                            </div>

                            <div className="checkout-items-list">

                                {cart.map((item) => (
                                    <article
                                        className="checkout-item"
                                        key={item._id}
                                    >

                                        <img
                                            src={item.image}
                                            alt={item.title}
                                        />

                                        <div className="checkout-item-info">

                                            <p className="checkout-category">
                                                {item.category}
                                            </p>

                                            <h3>
                                                {item.title}
                                            </h3>

                                            <p>
                                                Quantity:{" "}
                                                {item.quantity}
                                            </p>

                                        </div>

                                        <strong>
                                            Rs.{" "}
                                            {(
                                                Number(item.price) *
                                                item.quantity
                                            ).toLocaleString()}
                                        </strong>

                                    </article>
                                ))}

                            </div>

                        </section>

                        {/* SUMMARY */}

                        <section className="checkout-summary">

                            {/* TOTAL */}

                            <div className="checkout-total">

                                <span>
                                    Total
                                </span>

                                <strong>
                                    Rs.{" "}
                                    {Number(
                                        total
                                    ).toLocaleString()}
                                </strong>

                            </div>

                            {/* PAYMENT METHODS */}

                            <div className="payment-methods">

                                <p className="payment-method-label">
                                    PAYMENT METHOD
                                </p>

                                {/* COD */}

                                <label
                                    className={`payment-option ${
                                        paymentMethod === "cod"
                                            ? "selected"
                                            : ""
                                    }`}
                                >

                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cod"
                                        checked={
                                            paymentMethod === "cod"
                                        }
                                        onChange={() =>
                                            setPaymentMethod("cod")
                                        }
                                    />

                                    <span className="payment-option-content">

                                        <strong>
                                            Cash on Delivery
                                        </strong>

                                        <small>
                                            Pay when your order arrives.
                                        </small>

                                    </span>

                                </label>

                                {/* CARD */}

                                <label
                                    className={`payment-option ${
                                        paymentMethod === "card"
                                            ? "selected"
                                            : ""
                                    }`}
                                >

                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="card"
                                        checked={
                                            paymentMethod === "card"
                                        }
                                        onChange={() =>
                                            setPaymentMethod("card")
                                        }
                                    />

                                    <span className="payment-option-content">

                                        <strong>
                                            Card
                                        </strong>

                                        <small>
                                            Secure payment through Stripe Checkout.
                                        </small>

                                    </span>

                                </label>

                            </div>

                            {/* PLACE ORDER / PAYMENT BUTTON */}

                            <button
                                type="button"
                                className="place-order-button"
                                onClick={handlePlaceOrder}
                                disabled={loading}
                            >

                                {loading
                                    ? paymentMethod === "card"
                                        ? "Opening Payment..."
                                        : "Placing Order..."
                                    : paymentMethod === "card"
                                        ? "Pay with Card"
                                        : "Place Order"}

                            </button>

                            {/* BACK TO CART */}

                            <button
                                type="button"
                                className="checkout-back-button"
                                onClick={() =>
                                    navigate("/cart")
                                }
                                disabled={loading}
                            >
                                Back to Cart
                            </button>

                        </section>

                    </div>

                </div>

            </div>
        </main>
    );
}

export default Checkout;