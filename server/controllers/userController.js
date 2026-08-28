import User from "../models/User.js";


/* =========================================
   GET MY PROFILE
========================================= */

export async function getProfile(req, res) {
    try {
        const user = await User.findById(
            req.user._id
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        return res.status(200).json({
            user
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to get profile."
        });
    }
}


/* =========================================
   UPDATE MY PROFILE / CUSTOMER DETAILS
========================================= */

export async function updateProfile(req, res) {
    try {
        const {
            name,
            phone,
            city,
            address
        } = req.body;

        const user = await User.findById(
            req.user._id
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        if (name !== undefined) {
            user.name = name.trim();
        }

        if (phone !== undefined) {
            user.phone = phone.trim();
        }

        if (city !== undefined) {
            user.city = city.trim();
        }

        if (address !== undefined) {
            user.address = address.trim();
        }

        await user.save();

        return res.status(200).json({
            message: "Details updated successfully.",

            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                city: user.city,
                address: user.address,
                role: user.role
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to update details."
        });
    }
}