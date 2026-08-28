import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import swaggerSpec from "./swagger.js";

import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";


dotenv.config();

const app = express();

/* =====================================================
   REQUEST LOGGER
===================================================== */

app.use((req, res, next) => {
    console.log(
        "REQUEST RECEIVED:",
        req.method,
        req.originalUrl
    );

    next();
});

/* =====================================================
   CORS
===================================================== */

app.use(cors());

/* =====================================================
   JSON BODY PARSER

   Used by all normal API requests.
===================================================== */

app.use(express.json());

/* =====================================================
   ROOT ROUTE
===================================================== */

app.get("/", (req, res) => {
    res.json({
        message: "Kismet API is running"
    });
});

/* =====================================================
   SWAGGER
===================================================== */

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

/* =====================================================
   API ROUTES
===================================================== */

app.use(
    "/api/products",
    productRoutes
);

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/orders",
    orderRoutes
);

app.use(
    "/api/payments",
    paymentRoutes
);
app.use(
    "/api/contact",
    contactRoutes
);
app.use(
    "/api/users",
    userRoutes
);

/* =====================================================
   TEST ROUTE
===================================================== */

app.get("/test", (req, res) => {
    res.json({
        message: "Test route works"
    });
});

/* =====================================================
   404 HANDLER
===================================================== */

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

/* =====================================================
   SERVER
===================================================== */

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");

        app.listen(PORT, () => {
            console.log(
                `Server running on port ${PORT}`
            );

            console.log(
                `Swagger: http://localhost:${PORT}/api-docs`
            );
        });
    })
    .catch((error) => {
        console.error(
            "MongoDB connection failed:",
            error.message
        );
    });