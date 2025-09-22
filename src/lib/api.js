// Base URL ของ backend
export const API = import.meta.env.VITE_API_BASE || "http://localhost:3006/api";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function get(path) {
  const r = await fetch(`${API}${path}`, { headers: { ...authHeaders() } });
  if (!r.ok) throw new Error(`${path} failed: ${r.status}`);
  return r.json();
}

export async function post(path, body) {
  const r = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body ?? {}),
  });
  if (!r.ok) throw new Error(`${path} failed: ${r.status}`);
  return r.json();
}

export async function patch(path, body) {
  const r = await fetch(`${API}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body ?? {}),
  });
  if (!r.ok) throw new Error(`${path} failed: ${r.status}`);
  return r.json();
}

export async function del(path) {
  const r = await fetch(`${API}${path}`, { method: "DELETE", headers: { ...authHeaders() } });
  if (!r.ok) throw new Error(`${path} failed: ${r.status}`);
  return r.json();
}

// Endpoints เฉพาะ
export const fetchProducts = () => get("/products");
export const fetchCart = () => get("/cart");
export const addToCart = (product_id, quantity = 1) => post("/cart", { product_id, quantity });
export const updateCartQty = (product_id, quantity) => patch("/cart", { product_id, quantity });
export const removeFromCart = (product_id) => del(`/cart/${product_id}`);
export const clearCart = () => del("/cart");
export const createOrder = () => post("/orders");
export const listOrders = () => get("/orders");
export const getOrder = (id) => get(`/orders/${id}`);
export const loginApi = (payload) => post("/auth/login", payload);
export const registerApi = (payload) => post("/auth/register", payload);
