import express from "express";

import {
    getOrders,
    getOrder,
    createOrder,
    updateOrder,
    deleteOrder,
    getAllOrders,
    updateOrderStatus
} from "../controllers/orderController.js";

import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

/* =========================================
   AUTHENTICATION
========================================= */

router.use(protect);


/* =========================================
   ADMIN — GET ALL ORDERS
========================================= */

router.get(
    "/admin/all",
    adminOnly,
    getAllOrders
);


/* =========================================
   ADMIN — UPDATE ORDER STATUS
========================================= */

router.put(
    "/admin/:id/status",
    adminOnly,
    updateOrderStatus
);


/* =========================================
   CUSTOMER — GET ALL THEIR ORDERS
========================================= */

router.get(
    "/",
    getOrders
);


/* =========================================
   CUSTOMER — GET ONE ORDER
========================================= */

router.get(
    "/:id",
    getOrder
);


/* =========================================
   CUSTOMER — CREATE ORDER
========================================= */

router.post(
    "/",
    createOrder
);


/* =========================================
   CUSTOMER — UPDATE ORDER
========================================= */

router.put(
    "/:id",
    updateOrder
);


/* =========================================
   CUSTOMER — DELETE ORDER
========================================= */

router.delete(
    "/:id",
    deleteOrder
);


export default router;