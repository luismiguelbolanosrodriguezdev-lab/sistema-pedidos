const tbody = document.getElementById("productsTableBody");

let editingId = null;
let productsCache = [];


function resetForm() {
  document.getElementById("formProduct").reset()
  editingId = null
  document.getElementById("buttonCreateProduct").value = "Agregar Producto"
  document.getElementById("cancelEdit").hidden = true
}

async function loadProducts() {
  try {
    const responseProducts = await fetch("http://localhost:3000/api/productos?includeInactive=true");

    if (!responseProducts.ok) {
      throw new Error(
        "No se pudo obtener la lista de productos " + responseProducts.status,
      );
    }
    const products = await responseProducts.json();
    productsCache = products;

    tbody.innerHTML = "";

    products.forEach((product) => {
      const row = document.createElement("tr");

      const nameCell = document.createElement("td");
      nameCell.textContent = product.name;

      const priceCell = document.createElement("td");
      priceCell.textContent = product.price.toLocaleString("es-CO");

      const actionsCell = document.createElement("td");

      const statusCell = document.createElement("td");
      statusCell.textContent = product.is_active ? "Activo" : "Inactivo";

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
      row.appendChild(nameCell);
      row.appendChild(priceCell);
      row.appendChild(actionsCell);
      row.appendChild(statusCell);
      tbody.appendChild(row);
    });
  } catch (error) {
    window.alert("Error al cargar los productos " + error);
    console.error(error);
  }
}

async function setProductActive(id, isActive) {
  try {
    try {
        const response = await fetch(
          `http://localhost:3000/api/productos/${id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ is_active: isActive }),
          },
        );

        if (!response.ok) {
          throw new Error(
            "No se pudo actualizar el estado del producto " + response.status,
          );
        }
        if (editingId === id) resetForm();
        loadProducts();
      }catch (error) {
        console.error(error);
        window.alert("No se pudo actualizar el estado del producto: " + error);
      }
  } catch (error) {
    console.error(error);
    window.alert("Error al cambiar el estado del producto: " + error);
  }
}


tbody.addEventListener("click", async (event) => {
  const button = event.target;
  const action = button.dataset.action;
  if (!action) return;

  const id = Number(button.dataset.id);

   if (action === "edit") {
    if (!window.confirm("¿Desea editar este producto?")) return;
    const product = productsCache.find((p) => p.id === id);
    try {
      document.getElementById("cancelEdit").hidden = false;

      
      document.getElementById("nameProduct").value = product.name;
      document.getElementById("priceProduct").value = product.price;
      editingId = id;

      document.getElementById("buttonCreateProduct").value = "Guardar Cambios";
      
    }catch (error) {
      console.error(error);
      window.alert("Error al cargar el producto para editar: " + error);
    }
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

  const url =
    editingId === null
      ? "http://localhost:3000/api/productos"
      : `http://localhost:3000/api/productos/${editingId}`;
  const method = editingId === null ? "POST" : "PUT";

  if (editingId !== null) {
  const original = productsCache.find((p) => p.id === editingId);
  if (original.name === name && original.price === price){
    window.alert("No hiciste cambios en el producto");
    resetForm();
    return;
  }

} 


  try {
    const response = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
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

document
  .getElementById("formProduct")
  .addEventListener("submit", createProduct);

loadProducts();
document.getElementById("cancelEdit").addEventListener("click", resetForm);