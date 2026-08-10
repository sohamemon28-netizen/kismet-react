import sequelize from "./sql-models/index.js";
import Product from "./sql-models/Product.js";

const products = [
    {
        title: "Celeste Ring",
        description: "A delicate gold necklace designed for timeless elegance.",
        price: 89,
        image: "/images/celestial-ring.jpg",
        category: "Rings"
    },
    {
        title: "Aurora Ring",
        description: "A handcrafted gold ring with a minimalist finish.",
        price: 65,
        image: "/images/ring.jpg",
        category: "Rings"
    },
    {
        title: "Luna Earrings",
        description: "Elegant pearl earrings inspired by modern luxury.",
        price: 72,
        image: "/images/earrings.jpg",
        category: "Earrings"
    },
    {
        title: "Serenity Bracelet",
        description: "A handcrafted bracelet for effortless sophistication.",
        price: 58,
        image: "/images/bracelet.jpg",
        category: "Bracelets"
    },
    {
        title: "Eternal Pendant",
        description: "A timeless pendant symbolizing grace and elegance.",
        price: 95,
        image: "/images/pendant.jpg",
        category: "Pendants"
    },
    {
        title: "Opal Bloom Ring",
        description: "A statement ring featuring a beautiful opal stone.",
        price: 78,
        image: "/images/opal-ring.jpg",
        category: "Rings"
    }
];

try {

    await sequelize.authenticate();

    await Product.bulkCreate(products);

    console.log("PostgreSQL products seeded successfully!");

} catch (error) {

    console.error("Seeding failed:", error);

} finally {

    await sequelize.close();

}