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

        const exists = cart.find(item => item._id === product._id);

        if (exists) {

            setCart(
                cart.map(item =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            );

        } else {

            setCart([
                ...cart,
                {
                    ...product,
                    quantity: 1
                }
            ]);

        }

    }

    function removeFromCart(id) {

        setCart(
            cart.flatMap(item => {

                if (item._id !== id) return item;

                if (item.quantity > 1) {

                    return {
                        ...item,
                        quantity: item.quantity - 1
                    };

                }

                return [];

            })
        );

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