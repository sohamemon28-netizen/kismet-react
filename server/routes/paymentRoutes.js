import express from "express";

import {
    createCheckoutSession,
    completeTestPayment
} from "../controllers/paymentController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/*
=====================================================
CREATE LOCAL TEST PAYMENT
=====================================================
*/

router.post(
    "/create-checkout-session",
    protect,
    createCheckoutSession
);

/*
=====================================================
COMPLETE LOCAL TEST PAYMENT
=====================================================
*/

router.post(
    "/complete-test-payment",
    protect,
    completeTestPayment
);

export default router;