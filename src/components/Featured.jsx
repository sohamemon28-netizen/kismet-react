import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

function Featured({ limit }) {

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {

        async function loadProducts() {

            try {

                const response = await fetch("http://localhost:5000/api/products");

                const data = await response.json();

                setProducts(data);

            } catch (error) {

                console.log(error);

            }

        }

        loadProducts();

    }, []);

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(search.toLowerCase())
    );

    const displayedProducts = limit
        ? filteredProducts.slice(0, limit)
        : filteredProducts;

    return (

        <section className="featured" id="featured">

            <h2>Featured Pieces</h2>

            <input
                type="text"
                placeholder="Search jewellery..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="cards">

                {displayedProducts.map(product => (

                    <ProductCard
                        key={product._id}
                        product={product}
                    />

                ))}

            </div>

        </section>

    );

}

export default Featured;