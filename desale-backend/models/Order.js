const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        qty: {
            type: Number,
            required: true,
            default: 1
        }
    },
    {
        _id: false
    }
);

const orderSchema = new mongoose.Schema(
    {
        userEmail: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        totalAmount: {
            type: Number,
            required: true
        },
        paymentMethod: {
            type: String,
            required: true
        },
        customerName: {
            type: String,
            trim: true
        },
        phone: {
            type: String,
            trim: true
        },
        shippingAddress: {
            type: String,
            trim: true
        },
        paymentDetails: {
            type: Object,
            default: {}
        },
        status: {
            type: String,
            enum: ["Placed", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered", "Cancelled"],
            default: "Placed"
        },
        estimatedDelivery: {
            type: Date,
            default: () => {
                const date = new Date();
                date.setDate(date.getDate() + 5);
                return date;
            }
        },
        items: {
            type: [orderItemSchema],
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Order", orderSchema);
