const CATALOG_PRODUCTS = [
  {
    name: "Gaming Laptop",
    price: 79999,
    image: "images/laptops.jpeg",
    category: "Laptops",
    badge: "Creator pick",
    tags: ["RGB", "144Hz", "Power"]
  },
  {
    name: "Performance Laptop",
    price: 49999,
    image: "images/laptops.jpeg",
    category: "Laptops",
    badge: "Hot deal",
    tags: ["Study", "Work", "Fast"]
  },
  {
    name: "Wireless Headphones",
    price: 2499,
    image: "images/headphones.jpeg",
    category: "Audio",
    badge: "Bass boost",
    tags: ["Travel", "ANC", "Chill"]
  },
  {
    name: "Wireless Earbuds",
    price: 1299,
    image: "images/earbuds.jpeg",
    category: "Audio",
    badge: "Pocket fit",
    tags: ["Calls", "Gym", "Compact"]
  },
  {
    name: "Bluetooth Speaker",
    price: 1499,
    image: "images/Speakers.jpeg",
    category: "Audio",
    badge: "Party mode",
    tags: ["Loud", "Portable", "Weekend"]
  },
  {
    name: "Smartwatch Pro",
    price: 3999,
    image: "images/smartwatches.jpeg",
    category: "Wearables",
    badge: "Fit check",
    tags: ["Health", "Calls", "AMOLED"]
  },
  {
    name: "Gaming Mouse",
    price: 799,
    image: "images/mouse.jpeg",
    category: "Accessories",
    badge: "Low latency",
    tags: ["Aim", "RGB", "Grip"]
  },
  {
    name: "Mechanical Keyboard",
    price: 1999,
    image: "images/keyboards.jpeg",
    category: "Accessories",
    badge: "Clicky",
    tags: ["Desk", "RGB", "Tactile"]
  },
  {
    name: "4K Monitor",
    price: 18999,
    image: "images/Monitors.jpeg",
    category: "Displays",
    badge: "Sharp view",
    tags: ["4K", "Work", "Gaming"]
  }
];

function formatPrice(price) {
  return `INR ${Number(price).toLocaleString("en-IN")}`;
}

function getWishlist() {
  return JSON.parse(localStorage.getItem("wishlist")) || [];
}

function saveWishlist(wishlist) {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

function isWishlisted(name) {
  return getWishlist().includes(name);
}

function toggleWishlist(name) {
  const wishlist = getWishlist();
  const index = wishlist.indexOf(name);

  if (index >= 0) {
    wishlist.splice(index, 1);
    showToast(`${name} removed from wishlist`);
  } else {
    wishlist.push(name);
    showToast(`${name} saved to wishlist`);
  }

  saveWishlist(wishlist);
  renderCatalog();
}

function addToCart(name, price, image, category = "") {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingProduct = cart.find(item => item.name === name);

  if (existingProduct) {
    existingProduct.qty = (existingProduct.qty || 1) + 1;
  } else {
    cart.push({ name, price, image, category, qty: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  showToast(`${name} added to cart`);
}

function showToast(message) {
  let toast = document.getElementById("app-toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "app-toast";
    toast.className = "app-toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => toast.classList.remove("show"), 1800);
}

function rate(el, value) {
  const stars = el.parentElement.querySelectorAll("span");
  const product = el.parentElement.dataset.product;

  stars.forEach((star, index) => {
    star.classList.toggle("active", index < value);
  });

  localStorage.setItem(`rating_${product}`, value);
}

function ratingHtml(name) {
  const saved = Number(localStorage.getItem(`rating_${name}`) || 0);
  return `
    <div class="rating" data-product="${name}">
      ${[1, 2, 3, 4, 5].map(value => `
        <span class="${value <= saved ? "active" : ""}" onclick="rate(this,${value})">★</span>
      `).join("")}
    </div>
  `;
}

function productCard(product) {
  const saved = isWishlisted(product.name);
  const tagHtml = product.tags.map(tag => `<span>${tag}</span>`).join("");

  return `
    <div class="product-card catalog-card" data-category="${product.category}">
      <button class="wishlist-btn ${saved ? "active" : ""}" onclick="toggleWishlist('${product.name}')">${saved ? "Saved" : "Save"}</button>
      <img src="${product.image}" alt="${product.name}">
      <div class="product-meta">
        <span>${product.category}</span>
        <strong>${product.badge}</strong>
      </div>
      <h3>${product.name}</h3>
      <p>${formatPrice(product.price)}</p>
      <div class="product-tags">${tagHtml}</div>
      ${ratingHtml(product.name)}
      <button onclick="addToCart('${product.name}',${product.price},'${product.image}','${product.category}')">Add to Cart</button>
    </div>
  `;
}

function renderFeaturedProducts() {
  const container = document.getElementById("featured-products");
  if (!container) return;

  container.innerHTML = CATALOG_PRODUCTS.slice(0, 4).map(productCard).join("");
}

function renderCategories() {
  const container = document.getElementById("category-tabs");
  if (!container) return;

  const categories = ["All", ...new Set(CATALOG_PRODUCTS.map(product => product.category))];
  container.innerHTML = categories.map(category => `
    <button class="category-tab ${category === "All" ? "active" : ""}" data-category="${category}" onclick="setCategory('${category}', this)">
      ${category}
    </button>
  `).join("");
}

function setCategory(category, button) {
  document.querySelectorAll(".category-tab").forEach(tab => tab.classList.remove("active"));
  button.classList.add("active");
  document.getElementById("product-category").value = category;
  renderCatalog();
}

function renderCatalog() {
  const container = document.getElementById("catalog-products");
  if (!container) return;

  const query = (document.getElementById("product-search")?.value || "").toLowerCase();
  const category = document.getElementById("product-category")?.value || "All";
  const sort = document.getElementById("product-sort")?.value || "featured";

  let products = CATALOG_PRODUCTS.filter(product => {
    const matchesCategory = category === "All" || product.category === category;
    const matchesQuery = [product.name, product.category, product.badge, ...product.tags]
      .join(" ")
      .toLowerCase()
      .includes(query);

    return matchesCategory && matchesQuery;
  });

  if (sort === "price-low") {
    products = products.sort((a, b) => a.price - b.price);
  }

  if (sort === "price-high") {
    products = products.sort((a, b) => b.price - a.price);
  }

  container.innerHTML = products.length
    ? products.map(productCard).join("")
    : `<p class="empty-state">No products found. Try another category or search.</p>`;
}

document.addEventListener("DOMContentLoaded", () => {
  renderFeaturedProducts();
  renderCategories();
  renderCatalog();

  document.getElementById("product-search")?.addEventListener("input", renderCatalog);
  document.getElementById("product-category")?.addEventListener("change", renderCatalog);
  document.getElementById("product-sort")?.addEventListener("change", renderCatalog);
});
