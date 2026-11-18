const API_URL = "http://localhost:3000";

const form = document.getElementById("formRegister");
const message = document.getElementById("registerMessage");
const button = document.getElementById("registerButton");

async function registerUser(event) {
  event.preventDefault();
  message.textContent = "";

  const businessName = document.getElementById("businessName").value.trim();
  const ownerName = document.getElementById("ownerName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    message.textContent = "Las contraseñas no coinciden";
    return;
  }
  button.disabled = true;
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessName, ownerName, email, password }),
    });
    const data = await response.json();

    if (!response.ok){
        message.textContent = data.error || "Error al registrar el usuario";
        return;
    }
    message.textContent = "Cuenta creada exitosamente, ya puedes iniciar sesión.";
    form.reset();
  } catch (error) {
    console.error(error);
    message.textContent = "No se pudo conectar con el servidor. Inténtalo de nuevo.";
  } finally {
    button.disabled = false;
  }
}

form.addEventListener("submit", registerUser);