const API_USERS = "http://localhost:3000/usuarios";
const API_ORDERS = "http://localhost:3000/orders";

// ===== ELEMENTOS =====
const ordersSection = document.getElementById("orders");
const ordersContainer = document.querySelector("#orders .col-md-8");
const userContainer = document.querySelector("#orders .col-md-4");

// ===== USUARIO LOGUEADO =====
const loggedUserId = Number(sessionStorage.getItem("userId")) || 1;

// ===== OBTENER USUARIO =====
async function getUser() {
  const res = await fetch(API_USERS);
  const users = await res.json();
  return users.find(user => Number(user.id) === loggedUserId);
}

// ===== OBTENER ÓRDENES =====
async function getOrders() {
  const res = await fetch(API_ORDERS);
  const orders = await res.json();
  return orders.filter(order => order.idUser === loggedUserId);
}

// ===== BADGE DE ESTADO =====
function statusBadge(status) {
  switch (status) {
    case "pending":
      return `<span class="badge bg-warning text-dark">Pending</span>`;
    case "cancelled":
      return `<span class="badge bg-danger">Cancelled</span>`;
    case "delivered":
      return `<span class="badge bg-success">Delivered</span>`;
    default:
      return `<span class="badge bg-secondary">Unknown</span>`;
  }
}

// ===== RENDER HISTORIAL =====
function renderOrdersHistory(orders) {
  let html = `
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5 class="fw-bold">Recent Orders</h5>
    </div>
  `;

  if (orders.length === 0) {
    html += `<p class="text-muted">No orders found</p>`;
  }

  orders.forEach(order => {
    html += `
      <div class="card mb-3">
        <div class="card-body d-flex justify-content-between align-items-center">
          <div>
            <h6 class="mb-1">#ORD-${order.id}</h6>
            <small class="text-muted">
              ${order.products.length} item(s)
            </small>
          </div>

          <div class="text-end">
            <div class="fw-bold">$${(order.total / 100).toFixed(2)}</div>
            ${statusBadge(order.status)}
          </div>
        </div>
      </div>
    `;
  });

  ordersContainer.innerHTML = html;
}

// ===== RENDER USUARIO =====
function renderUserProfile(user, orders) {
  userContainer.innerHTML = `
    <div class="card text-center">
      <div class="card-body">
        <img src="${user.avatar}" class="rounded-circle mb-3" width="80">
        <h6 class="fw-bold mb-0">${user.name}</h6>
        <small class="text-muted">${user.email}</small>

        <span class="badge bg-success mt-2">Customer</span>

        <div class="row mt-4">
          <div class="col">
            <small class="text-muted">Total Orders</small>
            <h5 class="fw-bold">${orders.length}</h5>
          </div>
          <div class="col">
            <small class="text-muted">Loyalty Pts</small>
            <h5 class="fw-bold text-success">${orders.length * 50}</h5>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ===== INIT =====
async function initOrders() {
  if (!ordersSection) return;

  try {
    const user = await getUser();
    const orders = await getOrders();

    if (!user) return console.error("Usuario no encontrado");

    renderOrdersHistory(orders);
    renderUserProfile(user, orders);
  } catch (error) {
    console.error("Error cargando órdenes:", error);
  }
}
