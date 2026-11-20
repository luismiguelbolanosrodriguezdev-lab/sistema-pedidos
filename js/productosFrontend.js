const tbody = document.getElementById("productsTableBody");
const form = document.getElementById("formProduct");
const userName = document.getElementById("userName");
const userRole = document.getElementById("userRole");
const logoutButton = document.getElementById("logoutButton");


let editingId = null;
let productsCache = [];
let canManage = false;


function resetForm() {
  form.reset()
  document.getElementById("formProduct").reset()
  editingId = null
  document.getElementById("buttonCreateProduct").value = "Agregar Producto"
  document.getElementById("cancelEdit").hidden = true
}

async function loadProducts() {
  try {
    const path = canManage
      ? "/api/productos?includeInactive=true"
      : "/api/productos";
    const response = await apiFetch(path);

    if (!response.ok) {
      throw new Error(
        "No se pudo obtener la lista de productos " + response.status,
      );
    }
    const products = await response.json();
    productsCache = products;

    tbody.innerHTML = "";

    products.forEach((product) => {
      const row = document.createElement("tr");

      const nameCell = document.createElement("td");
      nameCell.textContent = product.name;

      const priceCell = document.createElement("td");
      priceCell.textContent = product.price.toLocaleString("es-CO");

      const actionsCell = document.createElement("td");

      if (canManage){
      const toggleButton = document.createElement("input");
      toggleButton.type = "button";
      toggleButton.value = product.is_active ? "Desactivar" : "Activar";
      toggleButton.dataset.id = product.id;
      toggleButton.dataset.action = product.is_active ? "deactivate" : "activate";

      const editButton = document.createElement("input");
      editButton.type = "button";
      editButton.value = "Editar";
      editButton.dataset.id = product.id;
      editButton.dataset.action = "edit";

      actionsCell.appendChild(toggleButton);
      actionsCell.appendChild(editButton);
      }

      const statusCell = document.createElement("td");
      statusCell.textContent = product.is_active ? "Activo" : "Inactivo";

      
      row.appendChild(nameCell);
      row.appendChild(priceCell);
      row.appendChild(actionsCell);
      row.appendChild(statusCell);
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error(error);
    window.alert("Error al cargar los productos " + error);
  }
}

async function setProductActive(id, isActive) {
  try {
    const response = await apiFetch(`/api/productos/${id}`, {
            method: "PATCH",
            body: JSON.stringify({ is_active: isActive }),
          });

    if (!response.ok) {
          throw new Error(
            "No se pudo actualizar el estado del producto " + response.status);
        }
        if (editingId === id) resetForm();
        loadProducts();
      } catch (error) {
    console.error(error);
    window.alert("Error al cambiar el estado del producto: " + error);
  }
}

tbody.addEventListener("click", (event) => {
  const button = event.target;
  const action = button.dataset.action;
  if (!action) return;

  const id = Number(button.dataset.id);

   if (action === "edit") {
    if (!window.confirm("¿Desea editar este producto?")) return;
    const product = productsCache.find((p) => p.id === id);
    if (!product) return;

      
      document.getElementById("nameProduct").value = product.name;
      document.getElementById("priceProduct").value = product.price;
      document.getElementById("buttonCreateProduct").value = "Guardar Cambios";
      document.getElementById("cancelEdit").hidden = false;
      editingId = id;
}

  if (action === "deactivate") {
      if (!window.confirm("¿Desactivar este producto?")) return;
      setProductActive(id, false);
   }

    if (action === "activate") {
      setProductActive(id, true);
    }
  });

async function createProduct(event) {
  event.preventDefault();

  const name = document.getElementById("nameProduct").value.trim();
  const price = Number(document.getElementById("priceProduct").value);

  if (!name || !price) {
    window.alert("Rellena los campos correctamente");
    return;
  }

  if (editingId !== null) {
  const original = productsCache.find((p) => p.id === editingId);
  if (original && original.name === name && original.price === price){
    window.alert("No hiciste cambios en el producto");
    resetForm();
    return;
  }
}

  const path =
    editingId === null ? "/api/productos" : `/api/productos/${editingId}`;
  const method = editingId === null ? "POST" : "PUT";

  try {
    const response = await apiFetch(path, {
      method: method,
      body: JSON.stringify({ name, price }),
});

    if (!response.ok) {
      throw new Error("No se pudo guardar el producto " + response.status);
    }
    loadProducts();
    resetForm();
  } catch (error) {
    console.error(error);
    window.alert("Error al guardar el producto: " + error);
  }
}

form.addEventListener("submit", createProduct);
document.getElementById("cancelEdit").addEventListener("click", resetForm);
logoutButton.addEventListener("click", logout);

async function init() {
  const user = await requireLogin();
  if (!user) return;

  canManage = ["owner", "admin"].includes(user.role);
  userName.textContent = `Hola, ${user.name}`;
  userRole.textContent = `Rol: ${user.role}`
  form.hidden = !canManage;

  loadProducts();
}

init();