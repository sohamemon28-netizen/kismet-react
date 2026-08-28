import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

dotenv.config();

async function resetAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const hashedPassword = await bcrypt.hash(
            "password123",
            10
        );

        const user = await User.findOneAndUpdate(
            { email: "soha@test.com" },
            {
                password: hashedPassword,
                role: "admin"
            },
            {
                new: true
            }
        );

        if (!user) {
            console.log("User not found.");
            return;
        }

        console.log("Admin account updated successfully.");
        console.log("Email:", user.email);
        console.log("Role:", user.role);
        console.log("Password reset successfully.");

    } catch (error) {
        console.error(
            "Failed to reset admin:",
            error.message
        );
    } finally {
        await mongoose.disconnect();
    }
}

resetAdmin();