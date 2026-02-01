// api.js
const API_URL = "http://localhost:3000";

// ORDERS
async function getOrders() {
  const res = await fetch(`${API_URL}/orders`);
  return res.json();
}

async function updateOrderStatus(id, status) {
  return fetch(`${API_URL}/orders/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });
}

// PRODUCTS
async function getProducts() {
  const res = await fetch(`${API_URL}/menu`);
  return res.json();
}

async function createProduct(product) {
  return fetch(`${API_URL}/menu`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product)
  });
}
