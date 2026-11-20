const form = document.getElementById("formLogin");
const message = document.getElementById("loginMessage");
const button = document.getElementById("loginButton");


async function loginUser(event) {
  event.preventDefault();
  message.textContent = "";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!password || !email) {
    message.textContent = "mano, escriba";
    return;
  }

  button.disabled = true;
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (!response.ok){
        message.textContent = data.error || "Error al iniciar sesion, rey";
        return;
    }
    
    setToken(data.token);
    window.location.href = "productos.html";
} catch (error) {
    console.error(error);
    message.textContent = "No se pudo conectar con el servidor. Inténtalo de nuevo.";
  } finally {
    button.disabled = false;
  }
}

form.addEventListener("submit", loginUser);