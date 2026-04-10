const express = require("express");
const Order = require("../models/Order");
const sendOrderEmail = require("../utils/email");

const router = express.Router();

router.post("/place-order", async (req, res) => {
    try {
        const { userEmail, cartItems, totalAmount, paymentMethod } = req.body;

        if (!userEmail || !Array.isArray(cartItems) || cartItems.length === 0 || !totalAmount || !paymentMethod) {
            return res.status(400).send("Missing order details");
        }

        const items = cartItems.map(item => ({
            name: item.name,
            price: Number(item.price),
            qty: Number(item.qty || 1)
        }));

        const order = await Order.create({
            userEmail,
            totalAmount: Number(totalAmount),
            paymentMethod,
            items
        });

        try {
            await sendOrderEmail(userEmail, {
                orderId: order._id.toString(),
                paymentMethod,
                totalAmount,
                items
            });

            return res.send({
                message: "Order placed and email sent successfully",
                orderId: order._id
            });
        } catch (emailErr) {
            console.error(emailErr);
            return res.send({
                message: "Order placed but email failed",
                orderId: order._id
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Order failed");
    }
});

module.exports = router;
