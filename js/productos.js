async function loadProducts() {
  try {
    const responseProducts = await fetch("http://localhost:3000/api/productos");

    if (!responseProducts.ok) {
      throw new Error(
        "No se pudo obtener la lista de productos " + responseProducts.status,
      );
    }
    const products = await responseProducts.json();
    const listProducts = document.getElementById("listProducts");

    listProducts.innerHTML = "";

    products.forEach((product) => {
      const li = document.createElement("li");
      li.textContent = `${product.name} - $${product.price}`;
      listProducts.appendChild(li);
    });
  } catch (error) {
    window.alert("Error al cargar los productos " + error);
  }
}

async function createProduct(event) {
  event.preventDefault();

  const name = document.getElementById("nameProduct").value.trim();
  const price = Number(document.getElementById("priceProduct").value);

  if (!name || !price) {
    window.alert("Rellena los campos correctamenre");
    return;
  }
  try {
    const response = await fetch("http://localhost:3000/api/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price }),
    });

    if (!response.ok) {
      throw new Error("No se puedo crear el producto" + response.status);
    }
    loadProducts();
    event.target.reset();
  } catch (error) {
    console.error(error);
    window.alert("Error creating product: " + error);
  }
}

document.getElementById("formProduct").addEventListener("submit", createProduct);

loadProducts();
