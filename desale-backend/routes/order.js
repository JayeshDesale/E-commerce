const express = require("express");
const db = require("../db");

const router = express.Router();
const sendOrderEmail = require("../utils/email");

router.post("/place-order", (req, res) => {
    const { userEmail, cartItems, totalAmount, paymentMethod } = req.body;

    if (!userEmail || !Array.isArray(cartItems) || cartItems.length === 0 || !totalAmount || !paymentMethod) {
        return res.status(400).send("Missing order details");
    }

    const orderSql =
        "INSERT INTO orders (user_email, total_amount, payment_method) VALUES (?, ?, ?)";

    db.query(orderSql, [userEmail, totalAmount, paymentMethod], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Order failed");
        }

        const orderId = result.insertId;
        const itemSql =
            "INSERT INTO order_items (order_id, product_name, price, quantity) VALUES ?";
        const values = cartItems.map(item => [
            orderId,
            item.name,
            item.price,
            item.qty || 1
        ]);

        db.query(itemSql, [values], itemErr => {
            if (itemErr) {
                console.error(itemErr);
                return res.status(500).send("Order items failed");
            }

            sendOrderEmail(userEmail, {
                orderId,
                paymentMethod,
                totalAmount,
                items: cartItems
            })
                .then(() => {
                    res.send({
                        message: "Order placed and email sent successfully",
                        orderId
                    });
                })
                .catch(emailErr => {
                    console.error(emailErr);
                    res.send({
                        message: "Order placed but email failed",
                        orderId
                    });
                });
        });
    });
});

module.exports = router;
