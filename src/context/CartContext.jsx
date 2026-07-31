import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

function CartProvider({ children }) {

    const [cart, setCart] = useState(() => {

        const saved = localStorage.getItem("cart");

        return saved ? JSON.parse(saved) : [];

    });

    useEffect(() => {

        localStorage.setItem("cart", JSON.stringify(cart));

    }, [cart]);

    function addToCart(product) {

        setCart([...cart, product]);

    }

    function removeFromCart(id) {

        setCart(cart.filter(item => item.id !== id));

    }

    return (

        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart
            }}
        >

            {children}

        </CartContext.Provider>

    );

}

export default CartProvider;