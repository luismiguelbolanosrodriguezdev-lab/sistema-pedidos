async function cargarProductos() {
  try {
    const respuestaProductos = await fetch("http://localhost:3000/api/productos");
    
    if (!respuestaProductos.ok) {
      throw new Error(
        "No se pudo obtener la lista de productos" + productos.status,
      );
    }
    const productos = await respuestaProductos.json();
    const listaProductos = document.getElementById("listaProductos");

    productos.forEach((producto) => {
       const li = document.createElement("li");
       li.textContent = `${producto.nombre} - $${producto.precio}`;
       listaProductos.appendChild(li);
    })
  } catch (error) {
    window.alert("Error al cargar los productos:" + error);
  }
}

cargarProductos();