import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

function Featured() {

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {

        async function loadProducts() {

            const response = await fetch("/products.json");

            const data = await response.json();

            setProducts(data);

        }

        loadProducts();

    }, []);

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(search.toLowerCase())
    );

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

                {filteredProducts.map(product => (

                    <ProductCard
                        key={product.id}
                        product={product}
                    />

                ))}

            </div>

        </section>

    );

}

export default Featured;