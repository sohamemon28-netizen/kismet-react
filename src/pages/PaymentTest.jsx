import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { API_BASE } from "../config/api";
import "../styles/PaymentTest.css";

function PaymentTest() {
    const { token } = useContext(AuthContext);
    const { setCart } = useContext(CartContext);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const orderId = searchParams.get("orderId");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!orderId) {
            setError("No order was provided for payment.");
        }
    }, [orderId]);

    async function handleCompletePayment() {
        if (!orderId) {
            setError("Order ID is missing.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_BASE}/api/payments/complete-test-payment`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        orderId
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Unable to complete test payment."
                );
            }

            // Payment succeeded, so clear the cart.
            setCart([]);

            // Send the customer to the orders page.
            navigate("/orders", {
                state: {
                    message:
                        "Payment completed successfully. Your order has been placed."
                }
            });
        } catch (error) {
            setError(
                error.message ||
                "Something went wrong while completing payment."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="payment-test-page">
            <div className="payment-test-container">

                <p className="payment-test-eyebrow">
                    CARD PAYMENT
                </p>

                <h1>
                    Complete your payment.
                </h1>

                <p className="payment-test-description">
                    This is a local test payment page for the
                    Kismet checkout system.
                </p>

                {error && (
                    <div className="payment-test-error">
                        {error}
                    </div>
                )}

                {orderId && (
                    <div className="payment-test-order">

                        <span>
                            ORDER ID
                        </span>

                        <strong>
                            {orderId}
                        </strong>

                    </div>
                )}

                <div className="payment-test-card">

                    <div className="payment-test-icon">
                        ✓
                    </div>

                    <h2>
                        Test Card Payment
                    </h2>

                    <p>
                        No real payment will be processed.
                        Clicking the button below will mark
                        this pending card order as paid in
                        MongoDB.
                    </p>

                    <button
                        type="button"
                        onClick={handleCompletePayment}
                        disabled={loading || !orderId}
                        className="payment-test-button"
                    >
                        {loading
                            ? "Processing Payment..."
                            : "Complete Test Payment"}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/checkout")}
                        disabled={loading}
                        className="payment-test-back"
                    >
                        Back to Checkout
                    </button>

                </div>

            </div>
        </main>
    );
}

export default PaymentTest;