import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

function generateToken(user) {

    return jwt.sign(
        {
            id: user._id,
            email: user.email
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
            email
        });

        if (existingUser) {

            return res.status(409).json({
                message: "User already exists."
            });

        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        const token = generateToken(user);

        res.status(201).json({
            message: "User registered successfully.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {

        res.status(500).json({
            message: "Registration failed.",
            error: error.message
        });

    }

}

export async function login(req, res) {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({
            email
        });

        if (!user) {

            return res.status(401).json({
                message: "Invalid email or password."
            });

        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {

            return res.status(401).json({
                message: "Invalid email or password."
            });

        }

        const token = generateToken(user);

        res.json({
            message: "Login successful.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {

        res.status(500).json({
            message: "Login failed.",
            error: error.message
        });

    }

}