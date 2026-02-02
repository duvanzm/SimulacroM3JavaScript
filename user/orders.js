// ============================
// 1️⃣ CONFIGURACIÓN DE LA API
// Aquí se definen las direcciones (URLs)
// desde donde vamos a obtener los datos
// ============================

// Endpoint donde están los usuarios
const API_USERS = "http://localhost:3000/usuarios";

// Endpoint donde están las órdenes (pedidos)
const API_ORDERS = "http://localhost:3000/orders";


// ============================
// 2️⃣ ELEMENTOS DEL HTML
// Guardamos en variables los elementos
// que vamos a modificar desde JavaScript
// ============================

// Sección principal donde se muestran las órdenes
const ordersSection = document.getElementById("orders");

// Contenedor donde se renderiza el historial de órdenes
const ordersContainer = document.querySelector("#orders .col-md-8");

// Contenedor donde se muestra el perfil del usuario
const userContainer = document.querySelector("#orders .col-md-4");


// ============================
// 3️⃣ USUARIO LOGUEADO
// Obtenemos el ID del usuario guardado
// previamente en sessionStorage
// ============================

// El ID se guarda como STRING
const loggedUserId = sessionStorage.getItem("userId");


// ============================
// 4️⃣ VALIDACIÓN DE LOGIN
// Si no hay usuario logueado,
// mostramos un error en consola
// ============================

if (!loggedUserId) {
  console.error("No hay usuario logueado");
}


// ============================
// 5️⃣ OBTENER DATOS DEL USUARIO
// Esta función:
// 1. Pide todos los usuarios a la API
// 2. Busca el usuario que coincida
//    con el ID guardado en sesión
// ============================

async function getUser() {
  // Petición al servidor
  const res = await fetch(API_USERS);

  // Convertimos la respuesta a JSON
  const users = await res.json();

  // Buscamos el usuario logueado
  return users.find(user => user.id === loggedUserId);
}


// ============================
// 6️⃣ OBTENER ÓRDENES DEL USUARIO
// Esta función:
// 1. Pide todas las órdenes
// 2. Filtra solo las órdenes
//    del usuario logueado
// ============================

async function getOrders() {
  // Petición al servidor
  const res = await fetch(API_ORDERS);

  // Convertimos la respuesta a JSON
  const orders = await res.json();

  // Retornamos solo las órdenes del usuario
  return orders.filter(order => order.idUser === loggedUserId);
}


// ============================
// 7️⃣ BADGE DE ESTADO
// Devuelve una etiqueta visual
// según el estado de la orden
// ============================

function statusBadge(status) {
  switch (status) {
    case "pending":
      // Orden pendiente
      return `<span class="badge bg-warning text-dark">Pending</span>`;

    case "cancelled":
      // Orden cancelada
      return `<span class="badge bg-danger">Cancelled</span>`;

    case "delivered":
      // Orden entregada
      return `<span class="badge bg-success">Delivered</span>`;
      
    case "preparing":
      // Orden entregada
      return `<span class="badge bg-info">Preparing</span>`;

    default:
      // Estado desconocido
      return `<span class="badge bg-secondary">Unknown</span>`;
  }
}


// ============================
// 8️⃣ RENDER HISTORIAL DE ÓRDENES
// Esta función:
// 1. Recibe un arreglo de órdenes
// 2. Construye el HTML dinámicamente
// 3. Lo muestra en pantalla
// ============================

function renderOrdersHistory(orders) {
  // Estructura base del historial
  let html = `
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5 class="fw-bold">Recent Orders</h5>
    </div>
  `;

  // Si el usuario no tiene órdenes
  if (!orders.length) {
    html += `<p class="text-muted">No orders found</p>`;
  }

  // Recorremos cada orden
  orders.forEach(order => {
    html += `
      <div class="card mb-3">
        <div class="card-body d-flex justify-content-between align-items-center">

          <!-- Información de la orden -->
          <div>
            <h6 class="mb-1">#ORD-${order.id}</h6>
            <small class="text-muted">
              ${order.products.length} item(s)
            </small>
          </div>

          <!-- Total y estado -->
          <div class="text-end">
            <div class="fw-bold">$${(order.total / 100).toFixed(2)}</div>
            ${statusBadge(order.status)}
          </div>

        </div>
      </div>
    `;
  });

  // Insertamos el HTML en el contenedor
  ordersContainer.innerHTML = html;
}


// ============================
// 9️⃣ RENDER PERFIL DEL USUARIO
// Muestra la información básica
// del usuario y estadísticas
// ============================

function renderUserProfile(user, orders) {
  userContainer.innerHTML = `
    <div class="card text-center">
      <div class="card-body">

        <!-- Avatar del usuario -->
        <img src="${user.avatar}" class="rounded-circle mb-3" width="80">

        <!-- Nombre y correo -->
        <h6 class="fw-bold mb-0">${user.name}</h6>
        <small class="text-muted">${user.email}</small>

        <!-- Rol -->
        <span class="badge bg-success mt-2">Customer</span>

        <!-- Estadísticas -->
        <div class="row mt-4">
          <div class="col">
            <small class="text-muted">Total Orders</small>
            <h5 class="fw-bold">${orders.length}</h5>
          </div>

          <div class="col">
            <small class="text-muted">Loyalty Pts</small>
            <h5 class="fw-bold text-success">
              ${orders.length * 50}
            </h5>
          </div>
        </div>

      </div>
    </div>
  `;
}


// ============================
// 🔟 INIT (INICIO DE LA PÁGINA)
// Función principal que:
// 1. Valida que haya usuario
// 2. Obtiene datos
// 3. Renderiza todo
// ============================

async function initOrders() {
  // Si no existe la sección o no hay usuario, no hacemos nada
  if (!ordersSection || !loggedUserId) return;

  try {
    // Obtenemos el usuario logueado
    const user = await getUser();

    // Si no existe el usuario en la API
    if (!user) {
      console.error("Usuario no encontrado en la API");
      return;
    }

    // Obtenemos las órdenes del usuario
    const orders = await getOrders();

    // Renderizamos historial y perfil
    renderOrdersHistory(orders);
    renderUserProfile(user, orders);

  } catch (error) {
    // Capturamos cualquier error
    console.error("Error cargando órdenes:", error);
  }
}
