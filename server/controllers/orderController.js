import Order from "../models/Order.js";
import User from "../models/User.js";

/* =====================================================
   CUSTOMER — GET ALL ORDERS
===================================================== */

export async function getOrders(req, res) {
    try {
        const orders = await Order.find({
            user: req.user.id
        })
            .populate("items.product")
            .sort({ createdAt: -1 });

        res.json(orders);

    } catch (error) {
        console.error("GET ORDERS ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch orders.",
            error: error.message
        });
    }
}


/* =====================================================
   CUSTOMER — GET ONE ORDER
===================================================== */

export async function getOrder(req, res) {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user.id
        }).populate("items.product");

        if (!order) {
            return res.status(404).json({
                message: "Order not found."
            });
        }

        res.json(order);

    } catch (error) {
        console.error("GET ORDER ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch order.",
            error: error.message
        });
    }
}


/* =====================================================
   CUSTOMER — CREATE ORDER
===================================================== */

export async function createOrder(req, res) {
    try {
        const {
            items,
            total,
            customerDetails,
            paymentMethod
        } = req.body;


        /* -----------------------------------------
           VALIDATE ORDER ITEMS
        ----------------------------------------- */

        if (!items || items.length === 0) {
            return res.status(400).json({
                message: "Order must contain items."
            });
        }


        /* -----------------------------------------
           VALIDATE CUSTOMER DETAILS
        ----------------------------------------- */

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


        /* -----------------------------------------
           VALIDATE PAYMENT METHOD
        ----------------------------------------- */

        const allowedPaymentMethods = [
            "cod",
            "card"
        ];

        if (!allowedPaymentMethods.includes(paymentMethod)) {
            return res.status(400).json({
                message:
                    "Please select a valid payment method."
            });
        }


        /* -----------------------------------------
           SAVE LATEST CUSTOMER DETAILS
           TO USER PROFILE
        ----------------------------------------- */

        const updatedUser =
            await User.findByIdAndUpdate(
                req.user.id,
                {
                    $set: {
                        name:
                            customerDetails.fullName.trim(),

                        phone:
                            customerDetails.phone.trim(),

                        address:
                            customerDetails.address.trim(),

                        city:
                            customerDetails.city.trim()
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


        /* -----------------------------------------
           CREATE ORDER
        ----------------------------------------- */

        const order = await Order.create({

            user: req.user.id,

            customerDetails: {
                fullName:
                    customerDetails.fullName.trim(),

                phone:
                    customerDetails.phone.trim(),

                address:
                    customerDetails.address.trim(),

                city:
                    customerDetails.city.trim()
            },

            items,

            total,

            /* -------------------------------------
               PAYMENT INFORMATION
            ------------------------------------- */

            paymentMethod: paymentMethod,

            paymentStatus: "pending",

            stripeSessionId: null

        });


        /* -----------------------------------------
           POPULATE PRODUCT INFORMATION
        ----------------------------------------- */

        const populatedOrder =
            await order.populate("items.product");


        /* -----------------------------------------
           SEND RESPONSE
        ----------------------------------------- */

        res.status(201).json({

            message:
                "Order created successfully.",

            order: populatedOrder,

            user: updatedUser

        });

    } catch (error) {

        console.error(
            "CREATE ORDER ERROR:",
            error
        );

        res.status(400).json({

            message:
                "Failed to create order.",

            error:
                error.message

        });
    }
}


/* =====================================================
   CUSTOMER — UPDATE ORDER
===================================================== */

export async function updateOrder(req, res) {
    try {
        const order =
            await Order.findOneAndUpdate(
                {
                    _id: req.params.id,
                    user: req.user.id
                },
                req.body,
                {
                    returnDocument: "after",
                    runValidators: true
                }
            ).populate("items.product");

        if (!order) {
            return res.status(404).json({
                message: "Order not found."
            });
        }

        res.json(order);

    } catch (error) {

        console.error(
            "UPDATE ORDER ERROR:",
            error
        );

        res.status(400).json({
            message:
                "Failed to update order.",
            error:
                error.message
        });
    }
}


/* =====================================================
   CUSTOMER — DELETE ORDER
===================================================== */

export async function deleteOrder(req, res) {
    try {
        const order =
            await Order.findOneAndDelete({
                _id: req.params.id,
                user: req.user.id
            });

        if (!order) {
            return res.status(404).json({
                message: "Order not found."
            });
        }

        res.json({
            message:
                "Order deleted successfully."
        });

    } catch (error) {

        console.error(
            "DELETE ORDER ERROR:",
            error
        );

        res.status(500).json({
            message:
                "Failed to delete order."
        });
    }
}


/* =====================================================
   ADMIN — GET ALL ORDERS
===================================================== */

export async function getAllOrders(req, res) {
    try {
        const orders =
            await Order.find({})
                .populate(
                    "user",
                    "name email phone address city"
                )
                .populate("items.product")
                .sort({
                    createdAt: -1
                });

        res.json(orders);

    } catch (error) {

        console.error(
            "GET ALL ORDERS ERROR:",
            error
        );

        res.status(500).json({
            message:
                "Failed to fetch all orders.",
            error:
                error.message
        });
    }
}


/* =====================================================
   ADMIN — UPDATE ORDER STATUS
===================================================== */

export async function updateOrderStatus(
    req,
    res
) {
    try {

        const {
            status
        } = req.body;


        const allowedStatuses = [
            "pending",
            "processing",
            "shipped",
            "delivered",
            "cancelled"
        ];


        /* -----------------------------------------
           VALIDATE STATUS
        ----------------------------------------- */

        if (
            !allowedStatuses.includes(status)
        ) {
            return res.status(400).json({
                message:
                    "Invalid order status."
            });
        }


        /* -----------------------------------------
           UPDATE STATUS
        ----------------------------------------- */

        const order =
            await Order.findByIdAndUpdate(
                req.params.id,
                {
                    $set: {
                        status
                    }
                },
                {
                    returnDocument: "after",
                    runValidators: true
                }
            ).populate("items.product");


        if (!order) {
            return res.status(404).json({
                message:
                    "Order not found."
            });
        }


        console.log(
            `Order ${order._id} status changed to ${order.status}`
        );


        res.json(order);

    } catch (error) {

        console.error(
            "UPDATE ORDER STATUS ERROR:",
            error
        );

        res.status(500).json({
            message:
                "Failed to update order status.",
            error:
                error.message
        });
    }
}