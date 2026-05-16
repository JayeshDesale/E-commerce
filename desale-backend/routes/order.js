const express = require("express");
const Order = require("../models/Order");
const sendOrderEmail = require("../utils/email");

const router = express.Router();
const trackingSteps = ["Placed", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered"];
const orderStatuses = [...trackingSteps, "Cancelled"];
const orderEmailTimeoutMs = Number(process.env.ORDER_EMAIL_TIMEOUT_MS || 5000);

function requireAdmin(req, res, next) {
    const configuredKey = process.env.ADMIN_KEY;
    const providedKey = req.headers["x-admin-key"];

    if (!configuredKey) {
        return res.status(500).json({ message: "Admin key is not configured" });
    }

    if (providedKey !== configuredKey) {
        return res.status(401).json({ message: "Invalid admin key" });
    }

    return next();
}

function buildTracking(order) {
    const currentIndex = Math.max(0, trackingSteps.indexOf(order.status));

    return {
        orderId: order._id,
        status: order.status,
        estimatedDelivery: order.estimatedDelivery,
        placedAt: order.createdAt,
        customerName: order.customerName,
        userEmail: order.userEmail,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        items: order.items,
        steps: trackingSteps.map((step, index) => ({
            label: step,
            completed: index <= currentIndex,
            current: index === currentIndex
        }))
    };
}

function sendOrderEmailInBackground(to, orderDetails) {
    try {
        const emailPromise = sendOrderEmail(to, orderDetails);
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error("Order email timed out")), orderEmailTimeoutMs);
        });

        Promise.race([emailPromise, timeoutPromise])
            .then(() => {
                console.log(`Order email sent for ${orderDetails.orderId}`);
            })
            .catch(emailErr => {
                console.error("Order email failed:", emailErr.message);
            });
    } catch (emailErr) {
        console.error("Order email failed:", emailErr.message);
    }
}

router.post("/place-order", async (req, res) => {
    try {
        const {
            userEmail,
            cartItems,
            totalAmount,
            paymentMethod,
            customerName,
            phone,
            shippingAddress,
            paymentDetails
        } = req.body;
        const normalizedTotal = Number(totalAmount);

        if (!userEmail || !Array.isArray(cartItems) || cartItems.length === 0 || !Number.isFinite(normalizedTotal) || normalizedTotal <= 0 || !paymentMethod) {
            return res.status(400).json({ message: "Missing order details" });
        }

        const items = cartItems.map(item => ({
            name: item.name,
            price: Number(item.price),
            qty: Number(item.qty || 1)
        }));

        const order = await Order.create({
            userEmail,
            totalAmount: normalizedTotal,
            paymentMethod,
            customerName,
            phone,
            shippingAddress,
            paymentDetails,
            items
        });

        const emailDetails = {
            orderId: order._id.toString(),
            paymentMethod,
            customerName,
            phone,
            shippingAddress,
            totalAmount: normalizedTotal,
            items
        };

        res.json({
            message: "Order placed successfully. Confirmation email is being sent.",
            orderId: order._id,
            emailSent: "pending"
        });

        setImmediate(() => {
            sendOrderEmailInBackground(userEmail, emailDetails);
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Order failed" });
    }
});

router.get("/track/:orderId", async (req, res) => {
    try {
        const { orderId } = req.params;
        const email = String(req.query.email || "").trim().toLowerCase();

        if (!email) {
            return res.status(400).json({ message: "Email is required to track this order" });
        }

        const order = await Order.findOne({ _id: orderId, userEmail: email });

        if (!order) {
            return res.status(404).json({ message: "Order not found for this email" });
        }

        return res.json(buildTracking(order));
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: "Invalid order details" });
    }
});

router.get("/admin/orders", requireAdmin, async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(100)
            .lean();

        return res.json({
            statuses: orderStatuses,
            orders: orders.map(order => ({
                orderId: order._id,
                status: order.status,
                customerName: order.customerName,
                userEmail: order.userEmail,
                phone: order.phone,
                shippingAddress: order.shippingAddress,
                totalAmount: order.totalAmount,
                paymentMethod: order.paymentMethod,
                estimatedDelivery: order.estimatedDelivery,
                placedAt: order.createdAt,
                items: order.items
            }))
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Unable to load orders" });
    }
});

router.patch("/admin/orders/:orderId/status", requireAdmin, async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!orderStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid order status" });
        }

        const order = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        return res.json({
            message: "Order status updated",
            order: buildTracking(order)
        });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: "Unable to update order status" });
    }
});

module.exports = router;
