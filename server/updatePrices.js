import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

async function updatePrices() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected.");

        const products = await Product.find();

        for (const product of products) {
            // Generate a price between Rs. 500 and Rs. 2,000
            // rounded to the nearest Rs. 50.
            const price =
                Math.floor(Math.random() * 31) * 50 + 500;

            product.price = price;

            await product.save();
        }

        console.log(
            `Updated prices for ${products.length} products.`
        );

    } catch (error) {
        console.error(
            "Price update failed:",
            error.message
        );
    } finally {
        await mongoose.disconnect();
    }
}

updatePrices();