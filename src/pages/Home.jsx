import { useNavigate } from "react-router-dom";

import Hero from "../components/Hero";
import Featured from "../components/Featured";
import Newsletter from "../components/Newsletter";

function Home() {

    const navigate = useNavigate();

    return (

        <>

            <Hero />

            <Featured />


            {/* =====================================
                EDITORIAL BANNER
            ===================================== */}

            <section className="editorial-banner">

                <img
                    src="/images/banner.jpg"
                    alt="Kismet jewellery collection"
                />

                <div className="editorial-banner-overlay"></div>

                <div className="editorial-banner-content">

                    <p className="editorial-eyebrow">
                        THE KISMET EDIT
                    </p>

                    <h2>
                        Pieces with<br />
                        a story to tell.
                    </h2>

                    <button
                        onClick={() => navigate("/shop")}
                        className="editorial-button"
                    >
                        SHOP THE EDIT
                        <span>↗</span>
                    </button>

                </div>

            </section>


            {/* =====================================
                BRAND STORY
            ===================================== */}

            <section className="brand-story">

                <div className="brand-story-image">

                    <img
                        src="/images/about.jpg"
                        alt="Kismet jewellery"
                    />

                </div>


                <div className="brand-story-content">

                    <p className="section-eyebrow">
                        OUR STORY
                    </p>

                    <h2>
                        Jewellery for
                        every meaningful
                        moment.
                    </h2>

                    <p>
                        Kismet was created around the belief that
                        jewellery should feel personal. Every piece
                        is designed to become part of the moments
                        you remember long after they happen.
                    </p>

                    <button
                        className="story-link"
                        onClick={() => navigate("/about")}
                    >
                        DISCOVER KISMET
                        <span>↗</span>
                    </button>

                </div>

            </section>


            {/* =====================================
                PHILOSOPHY
            ===================================== */}

            <section className="philosophy">

                <p className="section-eyebrow">
                    KISMET
                </p>

                <h2>
                    "Some things are meant
                    to find you."
                </h2>

                <p>
                    Designed slowly. Worn endlessly.
                </p>

            </section>


            <Newsletter />

        </>

    );
}

export default Home;