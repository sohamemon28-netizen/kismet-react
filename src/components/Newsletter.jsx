import { useState } from "react";

function Newsletter() {

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    function handleSubmit(e) {

        e.preventDefault();

        if (email.trim() === "") {

            setMessage("Please enter your email.");
            return;

        }

        setMessage(" Thank you for subscribing to Kismet!");

        setEmail("");

    }

    return (

        <section className="newsletter">

            <h2>Join The Kismet Family</h2>

            <p>
                Be the first to know about new collections,
                exclusive launches, and special offers.
            </p>

            <form onSubmit={handleSubmit}>

                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <button type="submit">

                    Subscribe

                </button>

            </form>

            {message && (

                <p className="newsletter-message">

                    {message}

                </p>

            )}

        </section>

    );

}

export default Newsletter;