/* =======================
   1️⃣ CONFIGURACIÓN GENERAL
   Aquí definimos datos fijos
   que se usan en todo el dashboard
======================= */

// Estados posibles de una orden
// Cada estado tiene:
// - value → valor real guardado en la BD
// - label → texto que se muestra en pantalla
// - color → color del badge (Bootstrap)
const ORDER_STATUSES = [
  { value: "pending", label: "Pending", color: "warning" },
  { value: "preparing", label: "Preparing", color: "info" },
  { value: "delivered", label: "Delivered", color: "success" },
  { value: "cancelled", label: "Cancelled", color: "danger" }
];

// Arreglo donde se guardan las órdenes cargadas
// Se usa para consultar detalles sin volver a pedir a la API
let currentOrders = [];


/* =======================
   2️⃣ INIT
   Cuando la página termina de cargar,
   se inicializa el dashboard
======================= */

document.addEventListener("DOMContentLoaded", loadDashboard);


/* =======================
   3️⃣ SEGURIDAD – VALIDAR ADMIN
   Si el usuario no está logueado
   o no es admin, se redirige al login
======================= */

if (
  sessionStorage.getItem("login") !== "true" ||
  sessionStorage.getItem("rol") !== "admin"
) {
  window.location.href = "../index.html";
}


/* =======================
   4️⃣ DASHBOARD PRINCIPAL
   Esta función:
   - Obtiene las órdenes
   - Calcula estadísticas
   - Renderiza la tabla
======================= */

async function loadDashboard() {
  // Obtener todas las órdenes desde la API
  const orders = await getOrders();

  // Guardamos las órdenes en memoria
  currentOrders = orders;

  // Elementos del resumen superior
  const totalOrdersEl = document.getElementById("totalOrders");
  const pendingOrdersEl = document.getElementById("pendingOrders");
  const todayRevenueEl = document.getElementById("todayRevenue");

  // Si el dashboard no existe, salimos
  if (!totalOrdersEl) return;

  // Total de órdenes
  totalOrdersEl.textContent = orders.length;

  // Órdenes pendientes
  pendingOrdersEl.textContent =
    orders.filter(o => o.status === "pending").length;

  // Ingresos totales (suma de todas las órdenes)
  const total = orders.reduce((sum, o) => sum + o.total, 0);
  todayRevenueEl.textContent = total;

  // Mostrar la tabla de órdenes
  renderOrders(orders);
}


/* =======================
   5️⃣ TABLA DE ÓRDENES
   Muestra todas las órdenes
   en formato tabla
======================= */

function renderOrders(orders) {
  const table = document.getElementById("ordersTable");

  // Si no existe la tabla, salimos
  if (!table) return;

  // Limpiamos la tabla antes de renderizar
  table.innerHTML = "";

  orders.forEach(order => {
    // Buscamos la configuración del estado
    const status = ORDER_STATUSES.find(s => s.value === order.status);

    // Creamos una fila
    const tr = document.createElement("tr");
    tr.style.cursor = "pointer";

    // Al hacer clic se muestra el detalle
    tr.addEventListener("click", () => showOrderDetail(order.id));

    // Contenido de la fila
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
   6️⃣ DETALLE DE LA ORDEN
   Muestra información completa
   de una orden seleccionada
======================= */

function showOrderDetail(orderId) {
  // Buscamos la orden por ID
  const order = currentOrders.find(o => String(o.id) === String(orderId));
  const detail = document.getElementById("orderDetail");

  // Si no existe la orden o el contenedor, salimos
  if (!order || !detail) return;

  // Opciones del select de estado
  const options = ORDER_STATUSES.map(s => `
    <option value="${s.value}" ${s.value === order.status ? "selected" : ""}>
      ${s.label}
    </option>
  `).join("");

  // Lista de productos de la orden
  const productsHtml = order.products.map(p => `
    <li class="list-group-item d-flex justify-content-between">
      <span>${p.name} x${p.quantity}</span>
      <strong>$${p.price * p.quantity}</strong>
    </li>
  `).join("");

  // Render del detalle
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

  // Evento para guardar el nuevo estado
  document
    .getElementById("saveStatusBtn")
    .addEventListener("click", () => saveOrderStatus(order.id));
}


/* =======================
   7️⃣ ACTUALIZAR ESTADO
   Guarda el nuevo estado
   de la orden en la API
======================= */

async function saveOrderStatus(orderId) {
  const statusSelect = document.getElementById("orderStatus");
  const newStatus = statusSelect.value;

  // Actualizamos el estado en la API
  await updateOrderStatus(orderId, newStatus);

  // Recargamos el dashboard
  await loadDashboard();

  // Mensaje de éxito
  document.getElementById("orderDetail").innerHTML = `
    <p class="text-success text-center fw-semibold mb-0">
      Status updated successfully
    </p>
  `;
}


/* =======================
   8️⃣ LOGOUT
   Cierra sesión del admin
======================= */

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    // Limpiamos toda la sesión
    sessionStorage.clear();
    localStorage.clear();

    // Redirigimos al login
    window.location.href = "../index.html";
  });
}
