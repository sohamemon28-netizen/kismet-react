import { useState } from "react";
import ProductModal from "./ProductModal";

function ProductCard({ product }) {

    const [open, setOpen] = useState(false);

    return (

        <>

            <article

                className="card"

                onClick={() => setOpen(true)}

            >
             <p className="rating">

    ⭐ {product.rating.rate} ({product.rating.count} reviews)

            </p>
                <img

                    src={product.image}

                    alt={product.title}

                />

                <h3>

                    {product.title}

                </h3>

                <p>

                    {product.description.substring(0,80)}...

                </p>

                <h4>

                    £{product.price}

                </h4>

            </article>

            {

                open &&

                <ProductModal

                    product={product}

                    close={() => setOpen(false)}

                />

            }

        </>

    );

}

export default ProductCard;