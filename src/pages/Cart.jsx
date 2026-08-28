import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function Cart() {
    const { cart, removeFromCart } =
        useContext(CartContext);

    const navigate = useNavigate();

    const total = cart.reduce(
        (sum, item) =>
            sum +
            Number(item.price) * item.quantity,
        0
    );

    return (
        <section className="cart-page">

            <h1>Your Cart</h1>

            {cart.length === 0 ? (
                <div className="empty-cart">

                    <h3>Your cart is empty.</h3>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/shop")
                        }
                    >
                        Continue Shopping
                    </button>

                </div>
            ) : (
                <>

                    {cart.map((item) => (
                        <div
                            className="cart-item"
                            key={item._id}
                        >

                            <img
                                src={item.image}
                                alt={item.title}
                            />

                            <div className="cart-item-info">

                                <h3>
                                    {item.title}
                                </h3>

                                <p>
                                    Rs.{" "}
                                    {Number(
                                        item.price
                                    ).toLocaleString()}
                                </p>

                                <p>
                                    Quantity:{" "}
                                    {item.quantity}
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    removeFromCart(
                                        item._id
                                    )
                                }
                            >
                                Remove
                            </button>

                        </div>
                    ))}

                    <div className="cart-summary">

                        <h2>
                            Total: Rs.{" "}
                            {Number(
                                total
                            ).toLocaleString()}
                        </h2>

                        <button
                            type="button"
                            className="checkout-button"
                            onClick={() =>
                                navigate("/checkout")
                            }
                        >
                            Proceed to Checkout
                        </button>

                    </div>

                </>
            )}

        </section>
    );
}

export default Cart;