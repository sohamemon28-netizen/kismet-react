import express from "express";
import User from "../models/User.js";

import {
    getProfile,
    updateProfile
} from "../controllers/userController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();


/* =========================================
   GET CURRENT LOGGED-IN USER PROFILE
========================================= */

router.get(
    "/profile",
    protect,
    getProfile
);


/* =========================================
   UPDATE CURRENT LOGGED-IN USER PROFILE
========================================= */

router.put(
    "/profile",
    protect,
    updateProfile
);


/* =========================================
   GET ALL USERS
========================================= */

router.get("/", async (req, res) => {

    try {

        const users = await User.find();

        res.json(users);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });
    }
});


/* =========================================
   GET ONE USER
========================================= */

router.get("/:id", async (req, res) => {

    try {

        const user =
            await User.findById(req.params.id);

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(user);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });
    }
});


/* =========================================
   CREATE USER
========================================= */

router.post("/", async (req, res) => {

    try {

        const user =
            await User.create(req.body);

        res.status(201).json(user);

    } catch (err) {

        res.status(400).json({
            message: err.message
        });
    }
});


/* =========================================
   UPDATE USER BY ID
========================================= */

router.put("/:id", async (req, res) => {

    try {

        const user =
            await User.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(user);

    } catch (err) {

        res.status(400).json({
            message: err.message
        });
    }
});


/* =========================================
   DELETE USER
========================================= */

router.delete("/:id", async (req, res) => {

    try {

        const user =
            await User.findByIdAndDelete(
                req.params.id
            );

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "User deleted"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });
    }
});


export default router;