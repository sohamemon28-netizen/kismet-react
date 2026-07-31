import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function Cart() {

    const { cart, removeFromCart } = useContext(CartContext);

    const total = cart.reduce(
        (sum, item) => sum + item.price,
        0
    );

    return (

        <section className="cart-page">

            <h1>Your Cart</h1>

            {

                cart.length === 0 ?

                <h3>Your cart is empty.</h3>

                :

                <>

                    {

                        cart.map(item => (

                            <div className="cart-item" key={item.id}>

                                <img
                                    src={item.image}
                                    alt={item.title}
                                />

                                <div>

                                    <h3>{item.title}</h3>

                                    <p>£{item.price}</p>

                                </div>

                                <button
                                    onClick={() =>
                                        removeFromCart(item.id)
                                    }
                                >

                                    Remove

                                </button>

                            </div>

                        ))

                    }

                    <h2>

                        Total: £{total.toFixed(2)}

                    </h2>

                </>

            }

        </section>

    );

}

export default Cart;