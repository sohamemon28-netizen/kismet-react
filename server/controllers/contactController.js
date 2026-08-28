import Contact from "../models/Contact.js";

export async function submitContactForm(req, res) {
    try {
        const {
            name,
            email,
            subject,
            message
        } = req.body;

        // Validate fields
        if (
            !name?.trim() ||
            !email?.trim() ||
            !subject?.trim() ||
            !message?.trim()
        ) {
            return res.status(400).json({
                message: "All contact form fields are required."
            });
        }

        // Create contact submission
        const contact = await Contact.create({
            name: name.trim(),
            email: email.trim(),
            subject: subject.trim(),
            message: message.trim()
        });

        res.status(201).json({
            message:
                "Thank you for contacting us. We'll get back to you shortly.",
            contactId: contact._id
        });

    } catch (error) {
        console.error(
            "CONTACT FORM ERROR:",
            error
        );

        res.status(500).json({
            message:
                "Failed to submit contact form.",
            error: error.message
        });
    }
}