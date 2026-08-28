import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../App.css";

const API_URL = "http://localhost:5000/api/products";

function Shop() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const searchTerm = searchParams.get("search") || "";

    const [category, setCategory] = useState("All");
    const [sort, setSort] = useState("featured");

    useEffect(() => {
        async function fetchProducts() {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(API_URL);

                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }

                const data = await response.json();

                /*
                 * Your API may return either:
                 * [products]
                 * or { products: [...] }
                 */

                const fetchedProducts =
                    Array.isArray(data)
                        ? data
                        : data.products || [];

                setProducts(fetchedProducts);

            } catch (err) {

                console.error(err);

                setError(
                    "Unable to load the jewellery collection."
                );

            } finally {

                setLoading(false);

            }
        }

        fetchProducts();

    }, []);

    const categories = useMemo(() => {

        const uniqueCategories = [
            ...new Set(
                products
                    .map((product) => product.category)
                    .filter(Boolean)
            )
        ];

        return ["All", ...uniqueCategories];

    }, [products]);

    const filteredProducts = useMemo(() => {

        let result = [...products];

        /*
         * Search
         */

        if (searchTerm.trim()) {

            const search = searchTerm
                .toLowerCase()
                .trim();

            result = result.filter((product) => {

                const title =
                    product.title?.toLowerCase() || "";

                const description =
                    product.description?.toLowerCase() || "";

                const productCategory =
                    product.category?.toLowerCase() || "";

                return (
                    title.includes(search) ||
                    description.includes(search) ||
                    productCategory.includes(search)
                );

            });

        }

        /*
         * Category filter
         */

        if (category !== "All") {

            result = result.filter(
                (product) =>
                    product.category === category
            );

        }

        /*
         * Sorting
         */

        if (sort === "price-low") {

            result.sort(
                (a, b) => a.price - b.price
            );

        }

        if (sort === "price-high") {

            result.sort(
                (a, b) => b.price - a.price
            );

        }

        if (sort === "name") {

            result.sort(
                (a, b) =>
                    a.title.localeCompare(b.title)
            );

        }

        return result;

    }, [
        products,
        searchTerm,
        category,
        sort
    ]);

    if (loading) {

        return (

            <section className="shop-page">

                <div className="shop-heading">

                    <p className="section-eyebrow">
                        THE COLLECTION
                    </p>

                    <h1>Loading pieces...</h1>

                </div>

                <div className="loading-grid">

                    {Array.from({ length: 8 }).map(
                        (_, index) => (

                            <div
                                className="product-skeleton"
                                key={index}
                            />

                        )
                    )}

                </div>

            </section>

        );

    }

    if (error) {

        return (

            <section className="shop-page">

                <div className="shop-error">

                    <p>{error}</p>

                    <button
                        onClick={() =>
                            window.location.reload()
                        }
                    >
                        TRY AGAIN
                    </button>

                </div>

            </section>

        );

    }

    return (

        <section className="shop-page">

            <div className="shop-heading">

                <div>

                    <p className="section-eyebrow">
                        KISMET JEWELLERY
                    </p>

                    <h1>
                        {searchTerm
                            ? `Results for "${searchTerm}"`
                            : "The Collection"}
                    </h1>

                    <p className="shop-count">
                        {filteredProducts.length} pieces
                    </p>

                </div>

            </div>

            <div className="shop-controls">

                <div className="category-filters">

                    {categories.map(
                        (item) => (

                            <button
                                key={item}
                                className={
                                    category === item
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    setCategory(item)
                                }
                            >
                                {item}
                            </button>

                        )
                    )}

                </div>

                <select
                    value={sort}
                    onChange={(e) =>
                        setSort(e.target.value)
                    }
                >

                    <option value="featured">
                        Featured
                    </option>

                    <option value="price-low">
                        Price: Low to High
                    </option>

                    <option value="price-high">
                        Price: High to Low
                    </option>

                    <option value="name">
                        Name
                    </option>

                </select>

            </div>

            {filteredProducts.length === 0 ? (

                <div className="no-products">

                    <h2>
                        Nothing found.
                    </h2>

                    <p>
                        Try another search or category.
                    </p>

                </div>

            ) : (

                <div className="shop-product-grid">

                    {filteredProducts.map(
                        (product) => (

                            <article
                                className="shop-product"
                                key={product._id}
                                onClick={() =>
                                    navigate(
                                        `/product/${product._id}`
                                    )
                                }
                            >

                                <div className="shop-product-image">

                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        loading="lazy"
                                    />

                                    <div className="shop-product-overlay">

                                        <span>
                                            VIEW PIECE
                                        </span>

                                    </div>

                                </div>

                                <div className="shop-product-info">

                                    <div>

                                        <h2>
                                            {product.title}
                                        </h2>

                                        <p>
                                            {product.category}
                                        </p>

                                    </div>

                                    <span>
                                        Rs.{" "}
                                        {Number(
                                            product.price
                                        ).toLocaleString()}
                                    </span>

                                </div>

                            </article>

                        )
                    )}

                </div>

            )}

        </section>

    );

}

export default Shop;