import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";

function ProductModal({ product, close }) {

    const { addToCart } = useContext(CartContext);

    const [message, setMessage] = useState("");

    return (

        <div className="modal" onClick={close}>

            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
            >

                <button
                    className="close"
                    onClick={close}
                >
                    ✕
                </button>

                <img
                    src={product.image}
                    alt={product.title}
                />

                <h2>{product.title}</h2>

                <p>{product.description}</p>

                <h3>£{product.price}</h3>

                <button
                    className="buy"
                    onClick={() => {

                        addToCart(product);

                        setMessage("Added to cart");

                        setTimeout(() => {
                            setMessage("");
                        }, 2500);

                    }}
                >
                    Add To Cart
                </button>

                {message && (
                    <p className="success">
                        {message}
                    </p>
                )}

            </div>

        </div>

    );

}

export default ProductModal;