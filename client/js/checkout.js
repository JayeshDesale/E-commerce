document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const summary = document.getElementById("order-summary");
  const form = document.getElementById("checkout-form");
  

  if (cart.length === 0) {
    summary.innerHTML = "<p>Your cart is empty.</p>";
    form.querySelector("button").disabled = true;
    return;
  }

  // Display order summary
  let subtotal = 0;
  let itemsHTML = "<h3>Order Summary:</h3><ul>";

  cart.forEach(item => {
    subtotal += item.price;
    itemsHTML += `<li>${item.name} - ₹${item.price}</li>`;
  });

  itemsHTML += "</ul>";

  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  summary.innerHTML = `
    ${itemsHTML}
    <p><strong>Subtotal:</strong> ₹${subtotal}</p>
    <p><strong>GST (18%):</strong> ₹${tax}</p>
    <p><strong>Total:</strong> ₹${total}</p>
  `;

  // On form submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();

    if (!name || !phone || !address) {
      alert("Please fill all the details.");
      return;
    }

    // Clear cart
    if (e.submitter.classList.contains("place-order")) {
      localStorage.removeItem("cart");
    

    alert(`Thank you, ${name}! Your order has been placed.`);
    window.location.href = "index.html";
    }
    // Optional: Redirect to home
    
  });
});

