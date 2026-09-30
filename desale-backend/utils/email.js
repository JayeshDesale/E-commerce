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

async function sendOrderEmail(to, orderDetails) {
    const apiKey = process.env.BREVO_API_KEY;
    const fromEmail = process.env.EMAIL_FROM;
    const fromName = process.env.EMAIL_FROM_NAME || "DE-SALE";

    if (!apiKey) {
        throw new Error("BREVO_API_KEY is not configured.");
    }

    if (!fromEmail) {
        throw new Error("EMAIL_FROM is not configured.");
    }

    if (!to) {
        throw new Error("Customer email address is missing.");
    }

    const itemsHtml = orderDetails.items
        .map(item => `
            <li>
                ${escapeHtml(item.name)} -
                ${formatMoney(item.price)} x ${Number(item.qty || 1)}
            </li>
        `)
        .join("");

    const htmlContent = `
        <h2>Thank you for your order!</h2>

        <p>
            <strong>Order ID:</strong>
            ${escapeHtml(orderDetails.orderId)}
        </p>

        <p>
            <strong>Payment Method:</strong>
            ${escapeHtml(orderDetails.paymentMethod)}
        </p>

        ${
            orderDetails.customerName
                ? `<p><strong>Name:</strong> ${escapeHtml(orderDetails.customerName)}</p>`
                : ""
        }

        ${
            orderDetails.phone
                ? `<p><strong>Phone:</strong> ${escapeHtml(orderDetails.phone)}</p>`
                : ""
        }

        ${
            orderDetails.shippingAddress
                ? `<p><strong>Shipping Address:</strong> ${escapeHtml(orderDetails.shippingAddress)}</p>`
                : ""
        }

        <h3>Items:</h3>

        <ul>
            ${itemsHtml}
        </ul>

        <h3>
            Total Amount:
            ${formatMoney(orderDetails.totalAmount)}
        </h3>

        <p>We will deliver your order soon.</p>

        <br>

        <b>DE-SALE Team</b>
    `;

    const response = await fetch(
        "https://api.brevo.com/v3/smtp/email",
        {
            method: "POST",
            headers: {
                "accept": "application/json",
                "api-key": apiKey,
                "content-type": "application/json"
            },
            body: JSON.stringify({
                sender: {
                    name: fromName,
                    email: fromEmail
                },
                to: [
                    {
                        email: to
                    }
                ],
                subject: "Order Confirmation - DE-SALE",
                htmlContent: htmlContent
            })
        }
    );

    const responseText = await response.text();

    let responseData;

    try {
        responseData = JSON.parse(responseText);
    } catch {
        responseData = {
            raw: responseText
        };
    }

    if (!response.ok) {
        console.error("Brevo API error:", responseData);

        throw new Error(
            `Brevo email failed (${response.status}): ${
                responseData.message || responseText
            }`
        );
    }

    console.log("Brevo email accepted:", responseData);

    return responseData;
}

module.exports = sendOrderEmail;