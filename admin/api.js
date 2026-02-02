// ============================
// api.js
// Archivo encargado de comunicarse
// con la API (servidor)
// ============================

// URL base del servidor
// Todas las peticiones parten desde aquí
const API_URL = "http://localhost:3000";


// ============================
// ÓRDENES (ORDERS)
// Funciones relacionadas con pedidos
// ============================

// Obtiene TODAS las órdenes desde la API
// Se usa normalmente en el panel de admin
async function getOrders() {
  // Hacemos la petición GET
  const res = await fetch(`${API_URL}/orders`);

  // Convertimos la respuesta a JSON
  return res.json();
}

// Actualiza el estado de una orden específica
// id     → ID de la orden
// status → nuevo estado (pending, delivered, cancelled)
async function updateOrderStatus(id, status) {
  return fetch(`${API_URL}/orders/${id}`, {
    method: "PATCH", // PATCH actualiza solo una parte del objeto
    headers: {
      "Content-Type": "application/json"
    },
    // Enviamos únicamente el nuevo estado
    body: JSON.stringify({ status })
  });
}


// ============================
// PRODUCTOS (MENU)
// Funciones relacionadas con el menú
// ============================

// Obtiene todos los productos del menú
async function getProducts() {
  // Petición GET al endpoint /menu
  const res = await fetch(`${API_URL}/menu`);

  // Convertimos la respuesta a JSON
  return res.json();
}

// Crea un nuevo producto en el menú
// product → objeto con la información del producto
async function createProduct(product) {
  return fetch(`${API_URL}/menu`, {
    method: "POST", // POST crea un nuevo registro
    headers: {
      "Content-Type": "application/json"
    },
    // Enviamos el producto como JSON
    body: JSON.stringify(product)
  });
}

