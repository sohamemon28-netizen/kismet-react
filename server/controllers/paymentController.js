import Order from "../models/Order.js";
import User from "../models/User.js";

/*
=====================================================
CREATE LOCAL TEST PAYMENT
=====================================================
*/

export async function createCheckoutSession(req, res) {
    try {
        const {
            items,
            total,
            customerDetails
        } = req.body;

        /*
        =========================================
        VALIDATE ORDER ITEMS
        =========================================
        */

        if (
            !items ||
            !Array.isArray(items) ||
            items.length === 0
        ) {
            return res.status(400).json({
                message: "Order must contain items."
            });
        }

        /*
        =========================================
        VALIDATE TOTAL
        =========================================
        */

        if (
            total === undefined ||
            total === null ||
            Number(total) <= 0
        ) {
            return res.status(400).json({
                message:
                    "A valid order total is required."
            });
        }

        /*
        =========================================
        VALIDATE CUSTOMER DETAILS
        =========================================
        */

        if (
            !customerDetails ||
            !customerDetails.fullName?.trim() ||
            !customerDetails.phone?.trim() ||
            !customerDetails.address?.trim() ||
            !customerDetails.city?.trim()
        ) {
            return res.status(400).json({
                message:
                    "Complete customer delivery details are required."
            });
        }

        /*
        =========================================
        CLEAN CUSTOMER DETAILS
        =========================================
        */

        const cleanedCustomerDetails = {
            fullName:
                customerDetails.fullName.trim(),

            phone:
                customerDetails.phone.trim(),

            address:
                customerDetails.address.trim(),

            city:
                customerDetails.city.trim()
        };

        /*
        =========================================
        UPDATE USER'S SAVED DETAILS
        =========================================
        */

        const updatedUser =
            await User.findByIdAndUpdate(
                req.user.id,
                {
                    $set: {
                        name:
                            cleanedCustomerDetails.fullName,

                        phone:
                            cleanedCustomerDetails.phone,

                        address:
                            cleanedCustomerDetails.address,

                        city:
                            cleanedCustomerDetails.city
                    }
                },
                {
                    returnDocument: "after",
                    runValidators: true
                }
            ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        /*
        =========================================
        CREATE CARD ORDER

        Payment starts as pending.

        It will become "paid" only when the
        customer completes the local test payment.
        =========================================
        */

        const order = await Order.create({
            user: req.user.id,

            customerDetails:
                cleanedCustomerDetails,

            items: items.map((item) => ({
                product: item.product,
                quantity: Number(item.quantity),
                price: Number(item.price)
            })),

            total: Number(total),

            status: "pending",

            paymentMethod: "card",

            paymentStatus: "pending"
        });

        /*
        =========================================
        RETURN LOCAL TEST PAYMENT URL
        =========================================
        */

        const paymentUrl =
            `${process.env.CLIENT_URL}/payment-test?orderId=${order._id}`;

        res.status(201).json({
            message:
                "Test payment session created.",

            orderId: order._id,

            paymentStatus:
                order.paymentStatus,

            paymentMethod:
                order.paymentMethod,

            url: paymentUrl,

            user: updatedUser
        });

    } catch (error) {
        console.error(
            "CREATE TEST PAYMENT ERROR:",
            error
        );

        res.status(500).json({
            message:
                "Failed to create test payment.",

            error:
                error.message
        });
    }
}


/*
=====================================================
COMPLETE LOCAL TEST PAYMENT
=====================================================
*/

export async function completeTestPayment(req, res) {
    try {
        const { orderId } = req.body;

        /*
        =========================================
        VALIDATE ORDER ID
        =========================================
        */

        if (!orderId) {
            return res.status(400).json({
                message: "Order ID is required."
            });
        }

        /*
        =========================================
        FIND ORDER

        Make sure the order belongs to the
        currently logged-in user.
        =========================================
        */

        const order =
            await Order.findOne({
                _id: orderId,
                user: req.user.id
            });

        if (!order) {
            return res.status(404).json({
                message: "Order not found."
            });
        }

        /*
        =========================================
        MAKE SURE THIS IS A CARD ORDER
        =========================================
        */

        if (
            order.paymentMethod !== "card"
        ) {
            return res.status(400).json({
                message:
                    "This order is not a card payment."
            });
        }

        /*
        =========================================
        PREVENT DOUBLE PAYMENT
        =========================================
        */

        if (
            order.paymentStatus === "paid"
        ) {
            return res.status(400).json({
                message:
                    "This order has already been paid."
            });
        }

        /*
        =========================================
        MARK PAYMENT AS PAID
        =========================================
        */

        order.paymentStatus = "paid";

        order.paidAt = new Date();

        await order.save();

        /*
        =========================================
        RESPONSE
        =========================================
        */

        res.json({
            message:
                "Test payment completed successfully.",

            order
        });

    } catch (error) {
        console.error(
            "COMPLETE TEST PAYMENT ERROR:",
            error
        );

        res.status(500).json({
            message:
                "Failed to complete test payment.",

            error:
                error.message
        });
    }
}