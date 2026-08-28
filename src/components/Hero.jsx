import { useNavigate } from "react-router-dom";

function Hero() {
    const navigate = useNavigate();

    return (
        <section className="hero">

            <div className="hero-content">

                <p className="hero-eyebrow">
                    KISMET — FINE JEWELLERY
                </p>

                <h1>
                    Jewellery
                    <br />
                    with meaning.
                </h1>

                <p>
                    Thoughtfully crafted pieces designed to become
                    part of your story, your memories, and your
                    everyday rituals.
                </p>

                <button
                    className="hero-button"
                    onClick={() => navigate("/shop")}
                >
                    SHOP THE COLLECTION
                    <span>→</span>
                </button>

            </div>

            <div className="hero-scroll">
                <span>SCROLL TO EXPLORE</span>
                <span className="hero-scroll-line"></span>
            </div>

        </section>
    );
}

export default Hero;