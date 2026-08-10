import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";

dotenv.config();

async function runQueries() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected\n");


        // ============================================================
        // QUERY 1
        // Products with price greater than 70
        // PostgreSQL equivalent:
        // SELECT * FROM "Products" WHERE price > 70;
        // ============================================================

        const expensiveProducts = await Product.find({
            price: { $gt: 70 }
        });

        console.log("QUERY 1 - Products above £70");
        console.log(expensiveProducts);


        // ============================================================
        // QUERY 2
        // Average product price
        // PostgreSQL equivalent:
        // SELECT AVG(price) FROM "Products";
        // ============================================================

        const averagePrice = await Product.aggregate([
            {
                $group: {
                    _id: null,
                    averagePrice: {
                        $avg: "$price"
                    }
                }
            }
        ]);

        console.log("\nQUERY 2 - Average product price");
        console.log(averagePrice);


        // ============================================================
        // QUERY 3
        // Count products by category
        // PostgreSQL equivalent:
        // SELECT category, COUNT(*)
        // FROM "Products"
        // GROUP BY category;
        // ============================================================

        const productsByCategory = await Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    productCount: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    productCount: -1
                }
            }
        ]);

        console.log("\nQUERY 3 - Products by category");
        console.log(productsByCategory);


    } catch (error) {
        console.error("Query error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

runQueries();