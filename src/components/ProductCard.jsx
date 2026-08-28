import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "./ProductCard.css";

function ProductCard({ product }) {

    const { addToCart } = useContext(CartContext);

    const productId = product._id || product.id;

    const cartProduct = {
        ...product,
        id: productId
    };

    return (

        <article className="product-card">

            <Link
                to={`/product/${productId}`}
                className="product-image-link"
            >

                <div className="product-image-wrapper">

                    <img
                        src={product.image}
                        alt={product.title}
                        className="product-image"
                    />

                    <span className="product-badge">
                        NEW
                    </span>

                </div>

            </Link>

            <div className="product-card-info">

                <div className="product-details">

                    <Link
                        to={`/product/${productId}`}
                        className="product-title"
                    >

                        {product.title}

                    </Link>

                    <p className="product-description">

                        {product.description}

                    </p>

                </div>

                <div className="product-bottom">

                    <span className="product-price">

                        £{Number(product.price).toFixed(2)}

                    </span>

                    <button
                        className="quick-add-button"
                        onClick={() =>
                            addToCart(cartProduct)
                        }
                    >

                        ADD +

                    </button>

                </div>

            </div>

        </article>

    );
}

export default ProductCard;