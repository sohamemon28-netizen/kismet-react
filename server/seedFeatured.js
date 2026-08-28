import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

const products = [
    {
        title: "Luna Charm Bracelet",
        description:
            "A delicate gold-tone bracelet designed with an elegant charm detail, made to add a subtle statement to everyday looks.",
        price: 7400,
        image: "/images/bracelet.jpg",
        category: "Bracelets",
        featured: true
    },

    {
        title: "Celestial Ring",
        description:
            "A refined gold-tone ring inspired by celestial forms, with a delicate design made to be worn effortlessly.",
        price: 5800,
        image: "/images/celestial-ring.jpg",
        category: "Rings",
        featured: true
    },

    {
        title: "Golden Hour Earrings",
        description:
            "Elegant gold-tone earrings with a polished finish, designed to bring a warm, effortless glow to any look.",
        price: 6200,
        image: "/images/earrings.jpg",
        category: "Earrings",
        featured: true
    },

    {
        title: "Solstice Pendant",
        description:
            "A refined pendant with a timeless gold-tone finish, inspired by celestial light and quiet elegance.",
        price: 5400,
        image: "/images/pendant.jpg",
        category: "Pendants",
        featured: true
    },

    {
        title: "Opal Bloom Ring",
        description:
            "A delicate ring featuring an opal-inspired centre, designed with a soft and timeless finish.",
        price: 6400,
        image: "/images/opal-ring.jpg",
        category: "Rings",
        featured: false
    },

    {
        title: "Eternal Gold Ring",
        description:
            "A classic gold-tone ring with a clean silhouette, designed as an effortless everyday piece.",
        price: 5200,
        image: "/images/ring.jpg",
        category: "Rings",
        featured: false
    }
];

async function seedFeaturedProducts() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected.");

        const titles = products.map(product => product.title);

        await Product.deleteMany({
            title: { $in: titles }
        });

        await Product.insertMany(products);

        console.log(`Seeded ${products.length} products.`);
        console.log("4 products marked as featured.");

    } catch (error) {
        console.error("Seeding failed:", error.message);
    } finally {
        await mongoose.disconnect();
    }
}

seedFeaturedProducts();