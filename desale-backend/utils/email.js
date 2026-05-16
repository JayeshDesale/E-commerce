const nodemailer = require("nodemailer");

function createTransporter() {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass) {
        throw new Error("Email is not configured. Set EMAIL_USER and EMAIL_PASS.");
    }

    if (process.env.EMAIL_HOST) {
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT || 587),
            secure: process.env.EMAIL_SECURE === "true",
            auth: { user, pass },
            connectionTimeout: Number(process.env.EMAIL_TIMEOUT_MS || 5000),
            greetingTimeout: Number(process.env.EMAIL_TIMEOUT_MS || 5000),
            socketTimeout: Number(process.env.EMAIL_TIMEOUT_MS || 5000)
        });
    }

    return nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || "gmail",
        auth: { user, pass },
        connectionTimeout: Number(process.env.EMAIL_TIMEOUT_MS || 5000),
        greetingTimeout: Number(process.env.EMAIL_TIMEOUT_MS || 5000),
        socketTimeout: Number(process.env.EMAIL_TIMEOUT_MS || 5000)
    });
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatMoney(value) {
    return `INR ${Number(value || 0).toLocaleString("en-IN")}`;
}

function sendOrderEmail(to, orderDetails) {
    const transporter = createTransporter();
    const itemsHtml = orderDetails.items
        .map(item => `
            <li>
                ${escapeHtml(item.name)} - ${formatMoney(item.price)} x ${Number(item.qty || 1)}
            </li>
        `)
        .join("");

    return transporter.sendMail({
        from: process.env.EMAIL_FROM || `DE-SALE <${process.env.EMAIL_USER}>`,
        to,
        subject: "Order Confirmation - DE-SALE",
        html: `
            <h2>Thank you for your order!</h2>
            <p><strong>Order ID:</strong> ${escapeHtml(orderDetails.orderId)}</p>
            <p><strong>Payment Method:</strong> ${escapeHtml(orderDetails.paymentMethod)}</p>
            ${orderDetails.customerName ? `<p><strong>Name:</strong> ${escapeHtml(orderDetails.customerName)}</p>` : ""}
            ${orderDetails.phone ? `<p><strong>Phone:</strong> ${escapeHtml(orderDetails.phone)}</p>` : ""}
            ${orderDetails.shippingAddress ? `<p><strong>Shipping Address:</strong> ${escapeHtml(orderDetails.shippingAddress)}</p>` : ""}

            <h3>Items:</h3>
            <ul>${itemsHtml}</ul>

            <h3>Total Amount: ${formatMoney(orderDetails.totalAmount)}</h3>

            <p>We will deliver your order soon.</p>
            <br>
            <b>DE-SALE Team</b>
        `
    });
}

module.exports = sendOrderEmail;
