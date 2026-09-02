import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Featured() {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFeaturedProducts() {
            try {
                const response = await fetch(
                    "https://kismet-api-xetw.onrender.com/api/products"
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }

                const data = await response.json();

                const featured = data
                    .filter((product) => product.featured === true)
                    .slice(0, 4);

                setProducts(featured);

            } catch (error) {
                console.error("Featured products error:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchFeaturedProducts();
    }, []);

    function openProduct(product) {
        navigate(`/product/${product._id}`);
    }

    return (
        <section className="featured-section">

            <div className="featured-header">

                <div>
                    <p className="section-eyebrow">
                        THE COLLECTION
                    </p>

                    <h2>
                        Made to be kept.
                    </h2>
                </div>

                <button
                    className="text-link"
                    onClick={() => navigate("/shop")}
                >
                    VIEW ALL
                </button>

            </div>

            {loading ? (

                <div className="featured-loading">
                    Loading collection...
                </div>

            ) : products.length === 0 ? (

                <div className="featured-loading">
                    No featured products found.
                </div>

            ) : (

                <div className="product-grid">

                    {products.map((product) => (

                        <article
                            className="featured-product"
                            key={product._id}
                            onClick={() => openProduct(product)}
                        >

                            <div className="product-image-wrapper">
<img
    src={product.image}
    alt={product.title}
    className="product-image"
/>

                                <button
                                    className="quick-view"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        openProduct(product);
                                    }}
                                >
                                    VIEW PIECE
                                </button>

                            </div>

                            <div className="product-info">

                                <div>

                                    <h3>
                                        {product.title}
                                    </h3>

                                    <p>
                                        {product.category}
                                    </p>

                                </div>

                                <span>
                                    Rs.{" "}
                                    {Number(product.price).toLocaleString()}
                                </span>

                            </div>

                        </article>

                    ))}

                </div>

            )}

        </section>
    );
}

export default Featured;