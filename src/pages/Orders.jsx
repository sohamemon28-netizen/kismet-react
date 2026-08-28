import {
    useContext,
    useEffect,
    useState
} from "react";
import {
    Navigate,
    useLocation,
    useNavigate
} from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import { API_BASE } from "../config/api";
import "../styles/Orders.css";

function Orders() {
    const {
        isLoggedIn,
        token
    } = useContext(AuthContext);

    const navigate = useNavigate();
    const location = useLocation();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isLoggedIn) {
            loadOrders();
        }
    }, [isLoggedIn]);

    async function loadOrders() {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_BASE}/api/orders`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to load orders."
                );
            }

            setOrders(data);

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    if (!isLoggedIn) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return (
        <main className="orders-page">

            <div className="orders-container">

                <div className="orders-heading">

                    <p className="orders-eyebrow">
                        MY ORDERS
                    </p>

                    <h1>
                        Order History
                    </h1>

                    <p>
                        View all the orders you have
                        placed with Kismet.
                    </p>

                </div>

                {location.state?.message && (
                    <div className="orders-success">
                        {location.state.message}
                    </div>
                )}

                {error && (
                    <div className="orders-error">
                        {error}
                    </div>
                )}

                {loading ? (
                    <p className="orders-loading">
                        Loading your orders...
                    </p>
                ) : orders.length === 0 ? (

                    <div className="no-orders">

                        <h2>
                            No orders yet.
                        </h2>

                        <p>
                            Your order history will
                            appear here.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/shop")
                            }
                        >
                            Start Shopping
                        </button>

                    </div>

                ) : (

                    <div className="orders-list">

                        {orders.map((order) => (

                            <article
                                className="order-card"
                                key={order._id}
                            >

                                <div className="order-header">

                                    <div>

                                        <p>
                                            ORDER
                                        </p>

                                        <h2>
                                            #
                                            {order._id
                                                .slice(-8)
                                                .toUpperCase()}
                                        </h2>

                                    </div>

                                    <div className="order-date">

                                        {order.createdAt
                                            ? new Date(
                                                order.createdAt
                                            ).toLocaleDateString()
                                            : ""}
                                    </div>

                                </div>

                                <div className="order-items">

                                    {order.items.map(
                                        (item, index) => {

                                            const product =
                                                item.product;

                                            return (
                                                <div
                                                    className="order-item"
                                                    key={
                                                        item._id ||
                                                        index
                                                    }
                                                >

                                                    {product?.image && (
                                                        <img
                                                            src={
                                                                product.image
                                                            }
                                                            alt={
                                                                product.title ||
                                                                "Product"
                                                            }
                                                        />
                                                    )}

                                                    <div>

                                                        <h3>
                                                            {product?.title ||
                                                                "Product"}
                                                        </h3>

                                                        <p>
                                                            Quantity:{" "}
                                                            {
                                                                item.quantity
                                                            }
                                                        </p>

                                                    </div>

                                                    <strong>
                                                        Rs.{" "}
                                                        {Number(
                                                            item.price
                                                        ).toLocaleString()}
                                                    </strong>

                                                </div>
                                            );
                                        }
                                    )}

                                </div>

                                <div className="order-total">

                                    <span>
                                        Order Total
                                    </span>

                                    <strong>
                                        Rs.{" "}
                                        {Number(
                                            order.total
                                        ).toLocaleString()}
                                    </strong>

                                </div>

                            </article>

                        ))}

                    </div>

                )}

            </div>

        </main>
    );
}

export default Orders;