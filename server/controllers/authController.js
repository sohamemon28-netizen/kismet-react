import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

function generateToken(user) {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );
}

export async function register(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required."
            });
        }

        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: "user"
        });

        const token = generateToken(user);

        res.status(201).json({
            message: "User registered successfully.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("REGISTER ERROR:", error);

        res.status(500).json({
            message: "Registration failed.",
            error: error.message
        });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        console.log("LOGIN REQUEST:", email);

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required."
            });
        }

       const user = await User.findOne({
         email: email.toLowerCase()
    });

console.log("USER FROM MONGOOSE:", user?.toObject());

if (!user) {
    return res.status(401).json({
        message: "Invalid email or password."
    });
}
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        console.log("PASSWORD MATCH:", passwordMatch);

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        console.log("========== LOGIN DEBUG ==========");
        console.log("USER:", user.toObject());
        console.log("USER ROLE:", user.role);
        console.log("ROLE TYPE:", typeof user.role);
        console.log("=================================");

        const token = generateToken(user);

        console.log(
            "LOGIN SUCCESS:",
            user.email,
            "| ROLE:",
            user.role
        );

        return res.json({
            message: "Login successful.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
        });

    } catch (error) {
        console.error("LOGIN ERROR:", error);

        return res.status(500).json({
            message: "Login failed.",
            error: error.message
        });
    }
}