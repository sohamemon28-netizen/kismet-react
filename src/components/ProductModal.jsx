import { useContext } from "react";

import { CartContext } from "../context/CartContext";

function ProductModal({ product, close }) {

    const { addToCart } = useContext(CartContext);

    return (

        <div className="modal" onClick={close}>

            <div
                className="modal-content"
                onClick={(e)=>e.stopPropagation()}
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

                <h2>

                    {product.title}

                </h2>

                <p>

                    {product.description}

                </p>

                <h3>

                    £{product.price}

                </h3>

                <button

                    className="buy"

                    onClick={() => addToCart(product)}

                >

                    Add To Cart

                </button>

            </div>

        </div>

    );

}

export default ProductModal;