import Product from "../models/Product.js";

export async function getProducts(req, res) {

    try {

        const products = await Product.find();

        res.json(products);

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch products.",
            error: error.message
        });

    }

}

export async function getProduct(req, res) {

    try {

        const product = await Product.findById(
            req.params.id
        );

        if (!product) {

            return res.status(404).json({
                message: "Product not found."
            });

        }

        res.json(product);

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch product.",
            error: error.message
        });

    }

}

export async function createProduct(req, res) {

    try {

        const {
            title,
            description,
            price,
            image,
            category
        } = req.body;

        const product = await Product.create({
            title,
            description,
            price,
            image,
            category
        });

        res.status(201).json(product);

    } catch (error) {

        res.status(400).json({
            message: "Failed to create product.",
            error: error.message
        });

    }

}

export async function updateProduct(req, res) {

    try {

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {

            return res.status(404).json({
                message: "Product not found."
            });

        }

        res.json(product);

    } catch (error) {

        res.status(400).json({
            message: "Failed to update product.",
            error: error.message
        });

    }

}

export async function deleteProduct(req, res) {

    try {

        const product = await Product.findByIdAndDelete(
            req.params.id
        );

        if (!product) {

            return res.status(404).json({
                message: "Product not found."
            });

        }

        res.json({
            message: "Product deleted successfully."
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to delete product.",
            error: error.message
        });

    }

}