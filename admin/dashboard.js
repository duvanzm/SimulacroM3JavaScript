/* =======================
   CONFIGURACIÓN
======================= */
const ORDER_STATUSES = [
  { value: "pending", label: "Pending", color: "warning" },
  { value: "preparing", label: "Preparing", color: "info" },
  { value: "delivered", label: "Delivered", color: "success" },
  { value: "cancelled", label: "Cancelled", color: "danger" }
];

let currentOrders = [];

/* =======================
   INIT
======================= */
document.addEventListener("DOMContentLoaded", loadDashboard);

/* =======================
   DASHBOARD
======================= */

  if (
    sessionStorage.getItem("login") !== "true" ||
    sessionStorage.getItem("rol") !== "admin"
  ) {
    window.location.href = "../index.html";
  }
async function loadDashboard() {
  const orders = await getOrders();
  currentOrders = orders;

  const totalOrdersEl = document.getElementById("totalOrders");
  const pendingOrdersEl = document.getElementById("pendingOrders");
  const todayRevenueEl = document.getElementById("todayRevenue");

  if (!totalOrdersEl) return;

  totalOrdersEl.textContent = orders.length;
  pendingOrdersEl.textContent =
    orders.filter(o => o.status === "pending").length;

  const total = orders.reduce((sum, o) => sum + o.total, 0);
  todayRevenueEl.textContent = total;

  renderOrders(orders);
}

/* =======================
   TABLA DE ÓRDENES
======================= */
function renderOrders(orders) {
  const table = document.getElementById("ordersTable");
  if (!table) return;

  table.innerHTML = "";

  orders.forEach(order => {
    const status = ORDER_STATUSES.find(s => s.value === order.status);

    const tr = document.createElement("tr");
    tr.style.cursor = "pointer";

    tr.addEventListener("click", () => showOrderDetail(order.id));

    tr.innerHTML = `
      <td>#${order.id}</td>
      <td>${order.idUser ?? "N/A"}</td>
      <td>-</td>
      <td>
        <span class="badge bg-${status?.color || "secondary"}">
          ${status?.label || order.status}
        </span>
      </td>
      <td>$${order.total}</td>
    `;

    table.appendChild(tr);
  });
}

/* =======================
   DETALLE DE ORDEN
======================= */
function showOrderDetail(orderId) {
  const order = currentOrders.find(o => String(o.id) === String(orderId));
  const detail = document.getElementById("orderDetail");

  if (!order || !detail) return;

  const options = ORDER_STATUSES.map(s => `
    <option value="${s.value}" ${s.value === order.status ? "selected" : ""}>
      ${s.label}
    </option>
  `).join("");

  const productsHtml = order.products.map(p => `
    <li class="list-group-item d-flex justify-content-between">
      <span>${p.name} x${p.quantity}</span>
      <strong>$${p.price * p.quantity}</strong>
    </li>
  `).join("");

  detail.innerHTML = `
    <h6 class="fw-bold mb-3">Order #${order.id}</h6>

    <p><strong>User ID:</strong> ${order.idUser ?? "N/A"}</p>

    <ul class="list-group mb-3">
      ${productsHtml}
    </ul>

    <p class="fw-semibold">Total: $${order.total}</p>

    <div class="mb-3">
      <label class="form-label fw-semibold">Status</label>
      <select class="form-select" id="orderStatus">
        ${options}
      </select>
    </div>

    <button class="btn btn-success w-100" id="saveStatusBtn">
      Save changes
    </button>
  `;

  document
    .getElementById("saveStatusBtn")
    .addEventListener("click", () => saveOrderStatus(order.id));
}

/* =======================
   ACTUALIZAR ESTADO
======================= */
async function saveOrderStatus(orderId) {
  const statusSelect = document.getElementById("orderStatus");
  const newStatus = statusSelect.value;

  await updateOrderStatus(orderId, newStatus);
  await loadDashboard();

  document.getElementById("orderDetail").innerHTML = `
    <p class="text-success text-center fw-semibold mb-0">
      Status updated successfully
    </p>
  `;
}

/* =======================
   LOGOUT
======================= */
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    // Eliminar sesión
    sessionStorage.clear();
    localStorage.clear();

    // Redirigir al login
    window.location.href = "../index.html";
  });
}
