import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";

function Header() {

    const { cart } = useContext(CartContext);

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {

        function handleScroll() {

            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }

        }

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);

    }, []);

    return (

        <header className={`header ${scrolled ? "scrolled" : ""}`}>

            <h1>
                <Link to="/">KISMET</Link>
            </h1>

            <nav>

                <Link to="/">Home</Link>

                <Link to="/shop">Shop</Link>

                <Link to="/about">About</Link>

                <Link to="/contact">Contact</Link>

            </nav>

            <Link className="cart" to="/cart">

                🛒 {cart.length}

            </Link>

        </header>

    );

}

export default Header;