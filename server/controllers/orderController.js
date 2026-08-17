import Order from "../models/Order.js";

export async function getOrders(req, res) {

    try {

        const orders = await Order.find({
            user: req.user.id
        }).populate("items.product");

        res.json(orders);

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch orders.",
            error: error.message
        });

    }

}

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

        res.status(500).json({
            message: "Failed to fetch order.",
            error: error.message
        });

    }

}

export async function createOrder(req, res) {

    try {

        const {
            items,
            total
        } = req.body;

        if (!items || items.length === 0) {

            return res.status(400).json({
                message: "Order must contain items."
            });

        }

        const order = await Order.create({
            user: req.user.id,
            items,
            total
        });

        const populatedOrder = await order.populate(
            "items.product"
        );

        res.status(201).json(populatedOrder);

    } catch (error) {

        res.status(400).json({
            message: "Failed to create order.",
            error: error.message
        });

    }

}

export async function updateOrder(req, res) {

    try {

        const order = await Order.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.id
            },
            req.body,
            {
                new: true,
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

        res.status(400).json({
            message: "Failed to update order.",
            error: error.message
        });

    }

}

export async function deleteOrder(req, res) {

    try {

        const order = await Order.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!order) {

            return res.status(404).json({
                message: "Order not found."
            });

        }

        res.json({
            message: "Order deleted successfully."
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to delete order.",
            error: error.message
        });

    }

}