
import { useState } from "react";
import { API_BASE } from "../config/api";

function Contact() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSuccess("");
        setError("");

        if (
            !form.name.trim() ||
            !form.email.trim() ||
            !form.subject.trim() ||
            !form.message.trim()
        ) {
            setError(
                "Please complete all fields before submitting."
            );

            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `${API_BASE}/api/contact`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: form.name,
                        email: form.email,
                        subject: form.subject,
                        message: form.message
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to submit your message."
                );
            }

            setSuccess(
                "Thank you for contacting us. We'll get back to you shortly."
            );

            setForm({
                name: "",
                email: "",
                subject: "",
                message: ""
            });

            setTimeout(() => {
                setSuccess("");
            }, 4000);

        } catch (error) {
            console.error(
                "CONTACT FORM ERROR:",
                error
            );

            setError(
                error.message ||
                "Something went wrong. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="contact-page">

            <div className="contact-header">

                <h1>
                    Get In Touch
                </h1>

                <p>
                    We'd love to hear from you. Whether you have questions
                    about our collections, custom jewellery, or an existing
                    order, our team is always here to help.
                </p>

            </div>

            <div className="contact-container">

                <form
                    className="contact-form"
                    onSubmit={handleSubmit}
                >

                    <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="subject"
                        placeholder="Subject"
                        value={form.subject}
                        onChange={handleChange}
                        required
                    />

                    <textarea
                        rows="6"
                        name="message"
                        placeholder="Your Message"
                        value={form.message}
                        onChange={handleChange}
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Sending..."
                            : "Send Message"}
                    </button>

                    {error && (
                        <p className="contact-error">
                            {error}
                        </p>
                    )}

                    {success && (
                        <p className="contact-success">
                            {success}
                        </p>
                    )}

                </form>

                <div className="contact-info">

                    <h3>
                        Contact Information
                    </h3>

                    <p>
                        hello@kismetjewellery.com
                    </p>

                    <p>
                        +44 1234 567890
                    </p>

                    <p>
                        Monday – Friday
                        <br />
                        9:00 AM – 6:00 PM
                    </p>

                </div>

            </div>

        </section>
    );
}

export default Contact;
