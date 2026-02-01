// products.js
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();

  const form = document.getElementById("productForm");
  if (form) {
    form.addEventListener("submit", addProduct);
  }
});

async function loadProducts() {
  const products = await getProducts(); // ← ahora sí existe
  const list = document.getElementById("productList");

  if (!list) return;

  list.innerHTML = "";

  products.forEach(p => {
    list.innerHTML += `
      <li class="list-group-item d-flex justify-content-between">
        <span>${p.name} (${p.category})</span>
        <strong>$${p.price}</strong>
      </li>
    `;
  });
}

async function addProduct(e) {
  e.preventDefault();

  const product = {
    name: document.getElementById("name").value,
    category: document.getElementById("category").value,
    price: Number(document.getElementById("price").value),
    img: "",
    description: ""
  };

  await createProduct(product); // ← ahora sí existe
  e.target.reset();
  loadProducts();
}
