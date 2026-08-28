import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { API_BASE } from "../config/api";

function SearchIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            width="17"
            height="17"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
        >
            <circle cx="11" cy="11" r="7" />
            <line
                x1="21"
                y1="21"
                x2="16.65"
                y2="16.65"
            />
        </svg>
    );
}

function BagIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
        >
            <path d="M6 8h12l-1 12H7L6 8z" />
            <path d="M9 8V6a3 3 0 0 1 6 0v2" />
        </svg>
    );
}

function Header() {
    const { cart } = useContext(CartContext);
    const { user, isAdmin, isLoggedIn, logout } =
        useContext(AuthContext);

    const navigate = useNavigate();

    const searchInputRef = useRef(null);
    const headerRef = useRef(null);
    const hoverTimer = useRef(null);

    const [searchOpen, setSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [shopOpen, setShopOpen] = useState(false);

    const [featuredProducts, setFeaturedProducts] =
        useState([]);

    useEffect(() => {
        async function loadDropdownProducts() {
            try {
                const response = await fetch(
                    `${API_BASE}/api/products`
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to load products"
                    );
                }

                const data = await response.json();

                const featured = data
                    .filter(
                        (product) =>
                            product.featured === true
                    )
                    .slice(0, 3);

                if (featured.length < 3) {
                    const remaining = data
                        .filter(
                            (product) =>
                                !featured.some(
                                    (featuredProduct) =>
                                        featuredProduct._id ===
                                        product._id
                                )
                        )
                        .slice(
                            0,
                            3 - featured.length
                        );

                    setFeaturedProducts([
                        ...featured,
                        ...remaining
                    ]);
                } else {
                    setFeaturedProducts(featured);
                }
            } catch (error) {
                console.error(
                    "Failed to load dropdown products:",
                    error
                );
            }
        }

        loadDropdownProducts();
    }, []);

    useEffect(() => {
        const headerEl = headerRef.current;

        if (!headerEl) return;

        function updateHeaderHeight() {
            document.documentElement.style.setProperty(
                "--header-height",
                `${headerEl.offsetHeight}px`
            );
        }

        updateHeaderHeight();

        const resizeObserver =
            new ResizeObserver(updateHeaderHeight);

        resizeObserver.observe(headerEl);

        window.addEventListener(
            "resize",
            updateHeaderHeight
        );

        return () => {
            resizeObserver.disconnect();

            window.removeEventListener(
                "resize",
                updateHeaderHeight
            );
        };
    }, []);

    function openShopMenu() {
        if (hoverTimer.current) {
            clearTimeout(hoverTimer.current);
        }

        setShopOpen(true);
    }

    function closeShopMenu() {
        hoverTimer.current = setTimeout(() => {
            setShopOpen(false);
        }, 250);
    }

    function handleSearchSubmit(e) {
        if (e) e.preventDefault();

        const trimmed = searchTerm.trim();

        if (trimmed) {
            navigate(
                `/shop?search=${encodeURIComponent(
                    trimmed
                )}`
            );
        } else {
            navigate("/shop");
        }

        setSearchOpen(false);
    }

    function toggleSearch() {
        if (!searchOpen) {
            setSearchOpen(true);

            requestAnimationFrame(() => {
                searchInputRef.current?.focus();
            });
        } else if (searchTerm.trim()) {
            handleSearchSubmit();
        } else {
            searchInputRef.current?.focus();
        }
    }

    function handleProductClick(productId) {
        setShopOpen(false);
        navigate(`/product/${productId}`);
    }

    function handleLogout() {
        logout();
        navigate("/");
    }

    return (
        <header
            ref={headerRef}
            className="site-header"
        >
            <div className="announcement-bar">
                <p>
                    Complimentary UK shipping on orders
                    over £150
                </p>
            </div>

            <div className="nav-row">

                <Link
                    to="/"
                    className="logo"
                >
                    Kismet
                </Link>

                <nav className="nav-links">

                    <div
                        className="shop-nav-item"
                        onMouseEnter={openShopMenu}
                        onMouseLeave={closeShopMenu}
                    >
                        <Link
                            to="/shop"
                            onClick={() =>
                                setShopOpen(false)
                            }
                        >
                            Shop
                        </Link>

                        {shopOpen && (
                            <div
                                className="shop-dropdown"
                                onMouseEnter={openShopMenu}
                                onMouseLeave={closeShopMenu}
                            >
                                <div className="shop-dropdown-top">

                                    <div>
                                        <p className="dropdown-eyebrow">
                                            FEATURED PIECES
                                        </p>

                                        <h3>
                                            Discover the
                                            collection.
                                        </h3>
                                    </div>

                                    <Link
                                        to="/shop"
                                        className="dropdown-view-all"
                                        onClick={() =>
                                            setShopOpen(false)
                                        }
                                    >
                                        VIEW ALL →
                                    </Link>

                                </div>

                                <div className="dropdown-products">

                                    {featuredProducts.map(
                                        (product) => (
                                            <button
                                                key={product._id}
                                                className="dropdown-product"
                                                onClick={() =>
                                                    handleProductClick(
                                                        product._id
                                                    )
                                                }
                                            >
                                                <div className="dropdown-image">
                                                    <img
                                                        src={
                                                            product.image
                                                        }
                                                        alt={
                                                            product.title
                                                        }
                                                    />
                                                </div>

                                                <div className="dropdown-product-info">

                                                    <div>
                                                        <p>
                                                            {
                                                                product.title
                                                            }
                                                        </p>

                                                        <span>
                                                            £
                                                            {Number(
                                                                product.price
                                                            ).toLocaleString()}
                                                        </span>
                                                    </div>

                                                    <small>
                                                        VIEW →
                                                    </small>

                                                </div>
                                            </button>
                                        )
                                    )}

                                </div>
                            </div>
                        )}
                    </div>

                    <Link to="/about">
                        About
                    </Link>

                    <Link to="/contact">
                        Contact
                    </Link>

                    {isAdmin && (
                        <Link
                            to="/admin"
                            className="admin-nav-link"
                        >
                            Admin
                        </Link>
                    )}

                 {isLoggedIn && (
    <>
        <Link
            to="/account"
            className="account-nav-link"
        >
            Account
        </Link>

        <button
            type="button"
            className="logout-nav-button"
            onClick={handleLogout}
        >
            Logout
        </button>
    </>
)}
                </nav>

                <div className="nav-icons">

                    <form
                        className={`nav-search ${
                            searchOpen ? "open" : ""
                        }`}
                        onSubmit={handleSearchSubmit}
                    >
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(
                                    e.target.value
                                )
                            }
                        />

                        <button
                            type="button"
                            className="search-toggle"
                            aria-label="Search"
                            onClick={toggleSearch}
                        >
                            <SearchIcon />
                        </button>
                    </form>

                    <Link
                        className="cart-link"
                        to="/cart"
                        aria-label="Cart"
                    >
                        <BagIcon />

                        <span className="cart-count">
                            {cart.length}
                        </span>
                    </Link>

                </div>

            </div>
        </header>
    );
}

export default Header;