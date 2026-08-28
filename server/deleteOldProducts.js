import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

const oldProducts = [
    "Celestial Pearl Necklace",
    "Golden Hour Earrings",
    "Luna Charm Bracelet",
    "Eternal Bloom Ring"
];

async function deleteOldProducts() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected.");

        const result = await Product.deleteMany({
            title: { $in: oldProducts }
        });

        console.log(`Deleted ${result.deletedCount} old Kismet products.`);

    } catch (error) {
        console.error("Delete failed:", error.message);
    } finally {
        await mongoose.disconnect();
    }
}

deleteOldProducts();