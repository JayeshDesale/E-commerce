const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "officialjd777@gmail.com",
        pass: "hjhy sopy vgad vbsn"
    }
});

function sendOrderEmail(to, orderDetails) {
    let itemsHtml = "";

    orderDetails.items.forEach(item => {
        itemsHtml += `
      <li>
        ${item.name} — ₹${item.price} × ${item.qty}
      </li>
    `;
    });

    const mailOptions = {
        from: "DE-SALE <yourgmail@gmail.com>",
        to: to,
        subject: "🛒 Order Confirmation - DE-SALE",
        html: `
      <h2>Thank you for your order!</h2>
      <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
      <p><strong>Payment Method:</strong> ${orderDetails.paymentMethod}</p>

      <h3>Items:</h3>
      <ul>${itemsHtml}</ul>

      <h3>Total Amount: ₹${orderDetails.totalAmount}</h3>

      <p>We’ll deliver your order soon 🚚</p>
      <br>
      <b>DE-SALE Team</b>
    `
    };

    return transporter.sendMail(mailOptions);
}

module.exports = sendOrderEmail;
