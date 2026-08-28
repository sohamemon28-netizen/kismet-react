import { useState } from "react";

function Newsletter() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    function handleSubmit(event) {
        event.preventDefault();

        if (!email.trim()) {
            return;
        }

        setSubmitted(true);
        setEmail("");
    }

    return (
        <section className="newsletter">

            <div className="newsletter-inner">

                <p className="newsletter-eyebrow">
                    KISMET JOURNAL
                </p>

                <h2>
                    A little something
                    <br />
                    worth knowing.
                </h2>

                <p className="newsletter-description">
                    Join our world of jewellery, stories and thoughtful
                    pieces made to become part of yours.
                </p>

                {!submitted ? (
                    <form
                        className="newsletter-form"
                        onSubmit={handleSubmit}
                    >

                        <input
                            type="email"
                            placeholder="YOUR EMAIL ADDRESS"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            required
                        />

                        <button type="submit">
                            JOIN
                            <span>→</span>
                        </button>

                    </form>
                ) : (
                    <div className="newsletter-success">
                        <span>THANK YOU</span>
                        <p>
                            You're now part of the Kismet journal.
                        </p>
                    </div>
                )}

            </div>

        </section>
    );
}

export default Newsletter;