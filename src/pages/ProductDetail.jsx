import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { API_BASE } from "../config/api";

function ProductDetail() {

    const { id } = useParams();
    const { addToCart } = useContext(CartContext);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {

        async function loadProduct() {

            try {

                setLoading(true);
                setError(null);

                const response = await fetch(`${API_BASE}/api/products/${id}`);

                if (response.status === 404) {
                    throw new Error("Product not found.");
                }

                if (!response.ok) {
                    throw new Error(`Server responded with ${response.status}`);
                }

                const data = await response.json();

                setProduct(data);

            } catch (err) {

                console.log(err);
                setError(err.message || "Couldn't load this product.");

            } finally {

                setLoading(false);

            }

        }

        loadProduct();

    }, [id]);

    if (loading) {
        return <p className="status-message">Loading...</p>;
    }

    if (error) {
        return <p className="status-message error-message">{error}</p>;
    }

    if (!product) {
        return null;
    }

    return (

        <section className="product-detail">

            <Link to="/shop">&larr; Back to Shop</Link>

            <div className="product-detail-content">

                <img
                    src={product.image}
                    alt={product.title}
                />

                <div>

                    <h1>{product.title}</h1>

                    <p>{product.description}</p>

                   <h3>Rs. {Number(product.price).toLocaleString()}</h3>

                    <button
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

        </section>

    );

}

export default ProductDetail;