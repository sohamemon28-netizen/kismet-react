import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// GET all orders
router.get("/", async (req, res) => {

    try {

        const orders = await Order.find()
            .populate("user")
            .populate("products.product");

        res.json(orders);

    } catch (err) {

        res.status(500).json({ message: err.message });

    }

});

// CREATE order
router.post("/", async (req, res) => {

    try {

        const order = await Order.create(req.body);

        res.status(201).json(order);

    } catch (err) {

        res.status(400).json({ message: err.message });

    }

});

// DELETE order
router.delete("/:id", async (req, res) => {

    try {

        await Order.findByIdAndDelete(req.params.id);

        res.json({ message: "Order deleted" });

    } catch (err) {

        res.status(500).json({ message: err.message });

    }

});

export default router;