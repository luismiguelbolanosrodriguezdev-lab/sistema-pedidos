const API_URL = "http://localhost:3000";
const TOKEN_KEY = "token";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function logout() {
  clearToken();
  window.location.href = "index.html";
}

async function apiFetch(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...options.headers };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (response.status === 401){
    logout();
    throw new Error("Sesión vencida");
  }
  return response;
}

async function requireLogin() {
  if(!getToken()){
    logout();
    return null;
  }
  try{
    const response = await apiFetch("/api/auth/me");
    if (!response.ok) return null;
    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error(error);
    return null;
  }
}