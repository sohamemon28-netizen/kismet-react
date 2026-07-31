import { useNavigate } from "react-router-dom";

function Hero() {

    const navigate = useNavigate();

    return (

        <section className="hero">

            <div className="hero-content">

                <h2>Jewellery Made To Feel Like Fate.</h2>

                <p>Handcrafted jewellery designed to celebrate every meaningful moment.</p>

                <button onClick={() => navigate("/shop")}>
                    Explore Collection
                </button>

            </div>

        </section>

    );

}

export default Hero;