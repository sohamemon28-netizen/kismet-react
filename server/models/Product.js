import mongoose from "mongoose";

const productSchema = new mongoose.Schema({

    title: {

        type: String,
        required: true,
        trim: true

    },

    description: {

        type: String,
        required: true

    },

    price: {

        type: Number,
        required: true,
        min: 1

    },

    image: {

        type: String,
        required: true

    },

    category: {

        type: String,
        default: "Jewellery"

    }

}, { timestamps: true });

productSchema.index({ title: 1 });

export default mongoose.model("Product", productSchema);