import {
    useContext,
    useEffect,
    useState
} from "react";

import {
    Navigate,
    useNavigate
} from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import { API_BASE } from "../config/api";

function AdminOrders() {
    const {
        isAdmin,
        token
    } = useContext(AuthContext);

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    const [selectedStatuses, setSelectedStatuses] =
        useState({});

    useEffect(() => {
        if (isAdmin) {
            loadOrders();
        }
    }, [isAdmin]);

    async function loadOrders() {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_BASE}/api/orders/admin/all`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
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

    function handleStatusChange(
        orderId,
        status
    ) {
        setSelectedStatuses((current) => ({
            ...current,
            [orderId]: status
        }));
    }

    async function updateStatus(
        orderId
    ) {
        const newStatus =
            selectedStatuses[orderId];

        if (!newStatus) {
            return;
        }

        try {
            setUpdatingId(orderId);
            setError("");

            const response = await fetch(
                `${API_BASE}/api/orders/admin/${orderId}/status`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization:
                            `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        status: newStatus
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to update order."
                );
            }

            setOrders((currentOrders) =>
                currentOrders.map((order) =>
                    order._id === orderId
                        ? data
                        : order
                )
            );

            setSelectedStatuses((current) => {
                const updated = {
                    ...current
                };

                delete updated[orderId];

                return updated;
            });

        } catch (error) {
            setError(error.message);
        } finally {
            setUpdatingId(null);
        }
    }

    if (!isAdmin) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return (
        <main className="admin-orders-page">

            <div className="admin-orders-container">

                <div className="admin-orders-heading">

                    <p className="admin-eyebrow">
                        ADMIN PANEL
                    </p>

                    <h1>
                        Manage Orders
                    </h1>

                    <p>
                        View and manage orders placed
                        by Kismet customers.
                    </p>

                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/admin")
                    }
                >
                    Back to Admin
                </button>

                {error && (
                    <div className="admin-orders-error">
                        {error}
                    </div>
                )}

                {loading ? (
                    <p>
                        Loading orders...
                    </p>
                ) : orders.length === 0 ? (

                    <div className="admin-orders-empty">

                        <h2>
                            No orders yet.
                        </h2>

                        <p>
                            Customer orders will
                            appear here.
                        </p>

                    </div>

                ) : (

                    <div className="admin-orders-list">

                        {orders.map((order) => {

                            const selectedStatus =
                                selectedStatuses[
                                    order._id
                                ] ??
                                order.status;

                            const hasChanged =
                                selectedStatus !==
                                order.status;

                            return (
                                <article
                                    className="admin-order-card"
                                    key={order._id}
                                >

                                    <div className="admin-order-header">

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

                                        <div>
                                            {order.createdAt
                                                ? new Date(
                                                    order.createdAt
                                                ).toLocaleDateString()
                                                : ""}
                                        </div>

                                    </div>

                                    <div className="admin-customer">

                                        <h3>
                                            Customer
                                        </h3>

                                        <p>
                                            <strong>
                                                Name:
                                            </strong>{" "}
                                            {order.user?.name ||
                                                "Unknown"}
                                        </p>

                                        <p>
                                            <strong>
                                                Email:
                                            </strong>{" "}
                                            {order.user?.email ||
                                                "Unknown"}
                                        </p>

                                    </div>

                                    <div className="admin-order-items">

                                        <h3>
                                            Items
                                        </h3>

                                        {order.items.map(
                                            (
                                                item,
                                                index
                                            ) => {

                                                const product =
                                                    item.product;

                                                return (
                                                    <div
                                                        className="admin-order-item"
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

                                                            <h4>
                                                                {product?.title ||
                                                                    "Product"}
                                                            </h4>

                                                            <p>
                                                                Quantity:{" "}
                                                                {
                                                                    item.quantity
                                                                }
                                                            </p>

                                                            <p>
                                                                Price: Rs.{" "}
                                                                {Number(
                                                                    item.price
                                                                ).toLocaleString()}
                                                            </p>

                                                        </div>

                                                    </div>
                                                );
                                            }
                                        )}

                                    </div>

                                    <div className="admin-order-footer">

                                        <div>

                                            <span>
                                                Total
                                            </span>

                                            <strong>
                                                Rs.{" "}
                                                {Number(
                                                    order.total
                                                ).toLocaleString()}
                                            </strong>

                                        </div>

                                        <div className="admin-status-controls">

                                            <label
                                                htmlFor={
                                                    `status-${order._id}`
                                                }
                                            >
                                                Status
                                            </label>

                                            <select
                                                id={
                                                    `status-${order._id}`
                                                }
                                                value={
                                                    selectedStatus
                                                }
                                                disabled={
                                                    updatingId ===
                                                    order._id
                                                }
                                                onChange={(event) =>
                                                    handleStatusChange(
                                                        order._id,
                                                        event.target.value
                                                    )
                                                }
                                            >

                                                <option value="pending">
                                                    Pending
                                                </option>

                                                <option value="processing">
                                                    Processing
                                                </option>

                                                <option value="shipped">
                                                    Shipped
                                                </option>

                                                <option value="delivered">
                                                    Delivered
                                                </option>

                                                <option value="cancelled">
                                                    Cancelled
                                                </option>

                                            </select>

                                            <button
                                                type="button"
                                                disabled={
                                                    updatingId ===
                                                        order._id ||
                                                    !hasChanged
                                                }
                                                onClick={() =>
                                                    updateStatus(
                                                        order._id
                                                    )
                                                }
                                            >
                                                {updatingId ===
                                                order._id
                                                    ? "Updating..."
                                                    : "Update Status"}
                                            </button>

                                        </div>

                                    </div>

                                </article>
                            );
                        })}

                    </div>

                )}

            </div>

        </main>
    );
}

export default AdminOrders;