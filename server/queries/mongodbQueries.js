import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";

dotenv.config();

async function runQueries() {


    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected\n");

        // QUERY 1
        // Find products with a price greater than £70

        const expensiveProducts = await Product.find({
            price: { $gt: 70 }
        });

        console.log("1. Products above £70:");
        console.log(expensiveProducts);


        // QUERY 2
        // Calculate the average product price

        const averagePrice = await Product.aggregate([
            {
                $group: {
                    _id: null,
                    averagePrice: { $avg: "$price" }
                }
            }
        ]);

        console.log("\n2. Average product price:");
        console.log(averagePrice);


        // QUERY 3
        // Group products by category

        const productsByCategory = await Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            }
        ]);

        console.log("\n3. Products grouped by category:");
        console.log(productsByCategory);

    } catch (error) {

        console.error(error);

    } finally {

        await mongoose.connection.close();

    }
}

runQueries();