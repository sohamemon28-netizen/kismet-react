import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        customerDetails: {
            fullName: {
                type: String,
                required: true,
                trim: true
            },

            phone: {
                type: String,
                required: true,
                trim: true
            },

            address: {
                type: String,
                required: true,
                trim: true
            },

            city: {
                type: String,
                required: true,
                trim: true
            }
        },

        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },

                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                },

                price: {
                    type: Number,
                    required: true
                }
            }
        ],

        total: {
            type: Number,
            required: true,
            min: 0
        },

        /*
        =====================================================
        PAYMENT METHOD
        =====================================================
        */

        paymentMethod: {
            type: String,
            enum: ["cod", "card"],
            default: "cod",
            required: true
        },

        /*
        =====================================================
        PAYMENT STATUS
        =====================================================
        */

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
            required: true
        },

        /*
        =====================================================
        STRIPE CHECKOUT SESSION
        =====================================================
        */

        stripeSessionId: {
            type: String,
            default: null
        },

        /*
        =====================================================
        STRIPE PAYMENT INTENT

        Saved after successful Stripe payment.
        =====================================================
        */

        stripePaymentIntentId: {
            type: String,
            default: null
        },

        /*
        =====================================================
        PAYMENT COMPLETION TIME

        Saved when Stripe confirms the payment.
        =====================================================
        */

        paidAt: {
            type: Date,
            default: null
        },

        /*
        =====================================================
        ORDER STATUS
        =====================================================
        */

        status: {
            type: String,
            enum: [
                "pending",
                "processing",
                "shipped",
                "delivered",
                "cancelled"
            ],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;