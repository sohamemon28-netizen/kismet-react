
import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer-main">

                <div className="footer-brand">
                    <h2>KISMET</h2>

                    <p>
                        Jewellery designed around
                        the moments that become memories.
                    </p>
                </div>

                <div className="footer-column">
                    <h4>Explore</h4>

                    <Link to="/shop">
                        Shop
                    </Link>

                    <Link to="/about">
                        About
                    </Link>

                    <Link to="/contact">
                        Contact
                    </Link>
                </div>

                <div className="footer-column">
                    <h4>Client Care</h4>

                    <Link to="/contact">
                        Contact Us
                    </Link>

                    <Link to="/cart">
                        Shopping Bag
                    </Link>

                    <Link to="/shop">
                        Collections
                    </Link>
                </div>

                <div className="footer-column">
                    <h4>Follow</h4>

                    <a
                        href="https://www.instagram.com/kismetisyours/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Instagram
                    </a>
                </div>

            </div>

            <div className="footer-bottom">
                <span>
                    © 2026 Kismet Jewellery
                </span>

                <span>
                    Made with intention.
                </span>
            </div>
        </footer>
    );
}

export default Footer;