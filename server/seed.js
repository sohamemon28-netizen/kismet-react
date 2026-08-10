import mongoose from "mongoose";
import dotenv from "dotenv";

import Product from "./models/Product.js";
import User from "./models/User.js";
import Order from "./models/Order.js";

import products from "./data/products.js";
import users from "./data/users.js";
import orders from "./data/orders.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

async function seedDatabase() {

    try {

        await Product.deleteMany();
        await User.deleteMany();
        await Order.deleteMany();

        const createdUsers = await User.insertMany(users);

        const createdProducts = await Product.insertMany(products);

        const formattedOrders = orders.map(order => ({

            user: createdUsers[order.user]._id,

            products: order.products.map(item => ({

                product: createdProducts[item.product]._id,

                quantity: item.quantity

            })),

            totalPrice: order.products.reduce((sum, item) => {

                return sum + createdProducts[item.product].price * item.quantity;

            }, 0)

        }));

        await Order.insertMany(formattedOrders);

        console.log("Database Seeded Successfully");

        process.exit();

    } catch (error) {

        console.log(error);

        process.exit(1);

    }

}

seedDatabase();