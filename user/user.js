// ============================
// VERIFICAR LOGIN
// ============================
if (sessionStorage.getItem("login") !== "true") {
  window.location.href = "../index.html";
}

// ============================
// API
// ============================
const urlMenu = "http://localhost:3000/menu";
const urlOrders = "http://localhost:3000/orders";

// ============================
// ELEMENTOS
// ============================
const menuContainer = document.getElementById("menu-container");
const orderItemsContainer = document.getElementById("order-items");
const searchInput = document.getElementById("search-input");
const filterButtons = document.querySelectorAll(".filter-btn");
const orderCountBadge = document.getElementById("order-count");
const subtotalEl = document.getElementById("subtotal");
const taxEl = document.getElementById("tax");
const totalEl = document.getElementById("total");
const clearOrderBtn = document.getElementById("clear-order");
const confirmOrderBtn = document.getElementById("confirm-order");
const logOut = document.getElementById("logOut");

// ============================
// ESTADO
// ============================
let menuData = [];
let cart = [];
let currentCategory = "all";
const TAX_RATE = 0.08;
const USER_ID = sessionStorage.getItem("userId");


console.log(USER_ID)
// ============================
// SECCIONES
// ============================
const sections = {
  menu: document.getElementById("menu"),
  orders: document.getElementById("orders"),
  profile: document.getElementById("profile")
};

document.querySelectorAll(".section").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();

    const section = link.dataset.section;

    Object.values(sections).forEach(s => s.classList.add("d-none"));
    sections[section].classList.remove("d-none");

    if (section === "orders" && typeof initOrders === "function") {
      initOrders();
    }
  });
});


// ============================
// LOGOUT
// ============================
logOut.addEventListener("click", () => {
  sessionStorage.clear();
  location.reload();
});

// ============================
// MENÚ
// ============================
async function fetchMenu() {
  const res = await fetch(urlMenu);
  menuData = await res.json();
  renderMenu(menuData);
}

function renderMenu(items) {
  menuContainer.innerHTML = "";

  items.forEach(item => {
    const col = document.createElement("div");
    col.className = "col-12 col-md-4";

    col.innerHTML = `
      <div class="card h-100">
        <img src="${item.img}" class="card-img-top">
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between mb-2">
            <h6>${item.name}</h6>
            <span>$${(item.price / 100).toFixed(2)}</span>
          </div>
          <p class="flex-grow-1">${item.description}</p>
          <button class="btn btn-primary add-to-cart" data-id="${item.id}">
            Add to order
          </button>
        </div>
      </div>
    `;
    menuContainer.appendChild(col);
  });

  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", () => addToCart(btn.dataset.id));
  });
}

// ============================
// FILTRO
// ============================
filterButtons.forEach(btn => {
  btn.addEventListener("click", e => {
    e.preventDefault();
    currentCategory = btn.dataset.category;
    filterAndSearch();
  });
});

searchInput.addEventListener("input", filterAndSearch);

function filterAndSearch() {
  let filtered = menuData;
  const q = searchInput.value.toLowerCase();

  if (currentCategory !== "all")
    filtered = filtered.filter(i => i.category === currentCategory);

  if (q) filtered = filtered.filter(i => i.name.toLowerCase().includes(q));

  renderMenu(filtered);
}

// ============================
// CARRITO
// ============================
function addToCart(id) {
  const item = menuData.find(i => i.id == id);
  const existing = cart.find(i => i.id == id);

  existing ? existing.quantity++ : cart.push({ ...item, quantity: 1 });
  renderCart();
}

function renderCart() {
  orderItemsContainer.innerHTML = "";
  let subtotal = 0;

  cart.forEach(item => {
    subtotal += item.price * item.quantity;

    const div = document.createElement("div");
    div.className = "d-flex mb-3";

    div.innerHTML = `
      <img src="${item.img}" width="60">
      <div class="ms-3 flex-grow-1">
        <strong>${item.name}</strong>
        <div>$${(item.price * item.quantity / 100).toFixed(2)}</div>
      </div>
    `;
    orderItemsContainer.appendChild(div);
  });

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  subtotalEl.textContent = `$${(subtotal / 100).toFixed(2)}`;
  taxEl.textContent = `$${(tax / 100).toFixed(2)}`;
  totalEl.textContent = `$${(total / 100).toFixed(2)}`;
  orderCountBadge.textContent = cart.length;
}

// ============================
// CONFIRMAR PEDIDO
// ============================
confirmOrderBtn.addEventListener("click", async () => {
  if (!cart.length) return alert("Pedido vacío");

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = subtotal + subtotal * TAX_RATE;

  await fetch(urlOrders, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      idUser: USER_ID,   // 👈 STRING "9a40"
      products: cart,
      total,
      status: "pending"
    })
  });

  cart = [];
  renderCart();
  alert("Pedido confirmado");
});


// ============================
fetchMenu();
