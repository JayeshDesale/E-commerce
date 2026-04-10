document.addEventListener("DOMContentLoaded", () => {
  console.log("Website loaded!");

  // Future: Load featured products dynamically
});
// Sample cart data (replace with actual logic later from Products page)



// Add to Cart
function addToCart(name, price, image) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push({ name, price, image });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${name} added to cart!`);
}

// Display Cart
function displayCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.querySelector(".cart-container");
  const checkoutBtn = document.querySelector(".checkout-btn");

  let html = `<h2>Your Cart</h2>`;
  let subtotal = 0;

  cart.forEach((item, index) => {
    html += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-details">
          <h4>${item.name}</h4>
          <p>₹${item.price}</p>
        </div>
        <div class="cart-actions">
          <button onclick="removeFromCart(${index})">Remove</button>
        </div>
      </div>
    `;
    subtotal += item.price;
  });

  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  html += `
  <div style="margin-top: 30px; text-align: right; font-size: 1.1rem;">
    <p><strong>Subtotal:</strong> ₹${subtotal}</p>
    <p><strong>GST (18%):</strong> ₹${tax}</p>
    <p><strong>Total:</strong> ₹${total}</p>
    <a href="checkout.html" class="checkout-btn" style="display:inline-block; margin-top:15px; padding:10px 20px;  background-color: #218838; color:#fff; text-decoration:none; border-radius:5px;">Proceed to Checkout</a>
  </div>
`;


  container.innerHTML = html;
  
}

// Remove from Cart
function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

// Load cart on page load
if (window.location.pathname.includes("cart.html")) {
  window.addEventListener("DOMContentLoaded", displayCart);
}


