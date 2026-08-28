import Stripe from "stripe";
import Order from "../models/Order.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/* =====================================================
   STRIPE WEBHOOK
===================================================== */

export async function stripeWebhook(req, res) {
    const signature = req.headers["stripe-signature"];

    let event;

    try {
        /* -----------------------------------------
           VERIFY STRIPE WEBHOOK
        ----------------------------------------- */

        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );

    } catch (error) {
        console.error(
            "STRIPE WEBHOOK SIGNATURE ERROR:",
            error.message
        );

        return res.status(400).send(
            `Webhook Error: ${error.message}`
        );
    }

    try {
        /* -----------------------------------------
           PAYMENT COMPLETED
        ----------------------------------------- */

        if (
            event.type ===
            "checkout.session.completed"
        ) {
            const session = event.data.object;

            const orderId =
                session.metadata?.orderId;

            if (!orderId) {
                console.error(
                    "Stripe session does not contain an orderId."
                );

                return res.status(400).json({
                    message:
                        "Order ID missing from Stripe session."
                });
            }

            /* -----------------------------------------
               FIND ORDER
            ----------------------------------------- */

            const order =
                await Order.findById(orderId);

            if (!order) {
                console.error(
                    "Order not found:",
                    orderId
                );

                return res.status(404).json({
                    message: "Order not found."
                });
            }

            /* -----------------------------------------
               UPDATE PAYMENT INFORMATION
            ----------------------------------------- */

            order.paymentStatus = "paid";

            order.paymentMethod = "card";

            order.stripePaymentIntentId =
                session.payment_intent || null;

            order.paidAt = new Date();

            await order.save();

            console.log(
                `Payment successful for order ${order._id}`
            );
        }

        /* -----------------------------------------
           PAYMENT FAILED / EXPIRED
        ----------------------------------------- */

        if (
            event.type ===
            "checkout.session.expired"
        ) {
            const session = event.data.object;

            const orderId =
                session.metadata?.orderId;

            if (orderId) {
                const order =
                    await Order.findById(orderId);

                if (order) {
                    order.paymentStatus =
                        "failed";

                    await order.save();

                    console.log(
                        `Payment expired for order ${order._id}`
                    );
                }
            }
        }

        /* -----------------------------------------
           TELL STRIPE WEBHOOK WAS RECEIVED
        ----------------------------------------- */

        res.json({
            received: true
        });

    } catch (error) {
        console.error(
            "STRIPE WEBHOOK ERROR:",
            error
        );

        res.status(500).json({
            message:
                "Webhook processing failed."
        });
    }
}