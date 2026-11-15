const tbody = document.getElementById("productsTableBody");

async function loadProducts() {
  try {
    const responseProducts = await fetch("http://localhost:3000/api/productos");

    if (!responseProducts.ok) {
      throw new Error(
        "No se pudo obtener la lista de productos " + responseProducts.status,
      );
    }
    const products = await responseProducts.json();

    tbody.innerHTML = "";

    products.forEach((product) => {
      const row = document.createElement("tr");

      const nameCell = document.createElement("td");
      nameCell.textContent = product.name;

      const priceCell = document.createElement("td");
      priceCell.textContent = product.price.toLocaleString("es-CO");

      const actionsCell = document.createElement("td");
      const deactivateButton = document.createElement("button");

      deactivateButton.textContent = "Desactivar";
      deactivateButton.dataset.id = product.id;
      deactivateButton.dataset.action = "deactivate";

      actionsCell.appendChild(deactivateButton);
      row.appendChild(nameCell);
      row.appendChild(priceCell);
      row.appendChild(actionsCell);
      tbody.appendChild(row);

    });
  } catch (error) {
    window.alert("Error al cargar los productos " + error);
    console.error(error);
  }
}

tbody.addEventListener("click", async (event) => {
  const button = event.target;
  if (button.dataset.action !== "deactivate") return;

  const id = button.dataset.id;

  if (!window.confirm("¿Desactivar este producto?")) return;

  try {
    const response = await fetch(`http://localhost:3000/api/productos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: false }),
    });

    if (!response.ok) {
      throw new Error(
        "No se pudo desactivar el producto " + response.status,
      );
    }
    loadProducts();
  } catch (error) {
    console.error(error);
    window.alert("Error al desactivar el producto: " + error);
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
  try {
    const response = await fetch("http://localhost:3000/api/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price }),
    });

    if (!response.ok) {
      throw new Error("No se pudo crear el producto " + response.status);
    }
    loadProducts();
    event.target.reset();
  } catch (error) {
    console.error(error);
    window.alert("Error al crear el producto: " + error);
  }
}

document
  .getElementById("formProduct")
  .addEventListener("submit", createProduct);

loadProducts();
