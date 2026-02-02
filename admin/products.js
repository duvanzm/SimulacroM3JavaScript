// ============================
// products.js
// Este archivo maneja:
// 1. Mostrar la lista de productos
// 2. Agregar nuevos productos
// ============================


// ============================
// CUANDO CARGA LA PÁGINA
// ============================
document.addEventListener("DOMContentLoaded", () => {
  // Cargar y mostrar los productos existentes
  loadProducts();

  // Obtener el formulario de creación de productos
  const form = document.getElementById("productForm");

  // Si el formulario existe, escuchar el evento submit
  if (form) {
    form.addEventListener("submit", addProduct);
  }
});


// ============================
// CARGAR PRODUCTOS
// ============================
// Trae los productos desde la API
// y los muestra en la lista
async function loadProducts() {

  // Obtener productos desde el servidor
  const products = await getProducts();

  // Obtener el elemento HTML donde se mostrarán
  const list = document.getElementById("productList");

  // Si la lista no existe, salir de la función
  if (!list) return;

  // Limpiar la lista antes de renderizar
  list.innerHTML = "";

  // Recorrer cada producto y mostrarlo
  products.forEach(product => {
    list.innerHTML += `
      <li class="list-group-item d-flex justify-content-between">
        <span>
          ${product.name} (${product.category})
        </span>
        <strong>$${product.price}</strong>
      </li>
    `;
  });
}


// ============================
// AGREGAR PRODUCTO
// ============================
// Se ejecuta cuando el usuario
// envía el formulario
async function addProduct(e) {

  // Evita que la página se recargue
  e.preventDefault();

  // Crear el objeto producto con los datos del formulario
  const product = {
    name: document.getElementById("name").value,
    category: document.getElementById("category").value,
    price: Number(document.getElementById("price").value),
    img: "",          // Reservado para imagen
    description: ""   // Reservado para descripción
  };

  // Enviar el producto a la API
  await createProduct(product);

  // Limpiar el formulario
  e.target.reset();

  // Volver a cargar la lista de productos
  loadProducts();
}
