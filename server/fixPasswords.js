import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

dotenv.config();

async function fixPasswords() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected.");

        const users = await User.find();

        let fixed = 0;

        for (const user of users) {
            const password = user.password;

            // Already hashed passwords start with $2a$, $2b$, or $2y$
            const isAlreadyHashed =
                password.startsWith("$2a$") ||
                password.startsWith("$2b$") ||
                password.startsWith("$2y$");

            if (isAlreadyHashed) {
                console.log(
                    `${user.email} already has a hashed password.`
                );

                continue;
            }

            const hashedPassword = await bcrypt.hash(
                password,
                10
            );

            user.password = hashedPassword;

            await user.save();

            console.log(
                `Password fixed for ${user.email}`
            );

            fixed++;
        }

        console.log("");
        console.log(`Finished. Fixed ${fixed} password(s).`);

        await mongoose.disconnect();

        process.exit(0);

    } catch (error) {
        console.error(
            "Failed to fix passwords:",
            error.message
        );

        await mongoose.disconnect();

        process.exit(1);
    }
}

fixPasswords();