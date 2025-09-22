// src/lib/api.js  — วางทับทั้งไฟล์

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ขีดเส้นใต้: เรียกผ่าน /api/* เสมอ ไม่ใช้ BASE URL ใดๆ
async function http(method, path, body) {
  const res = await fetch(`/api${path}`, {
    method,
    headers: {
      ...(method !== "GET" ? { "Content-Type": "application/json" } : {}),
      ...authHeaders(),
    },
    ...(method !== "GET" ? { body: JSON.stringify(body ?? {}) } : {}),
  });
  if (!res.ok) throw new Error(`${path} failed: ${res.status}`);
  return res.json();
}

export const get  = (path)       => http("GET",    path);
export const post = (path, body) => http("POST",   path, body);
export const patch= (path, body) => http("PATCH",  path, body);
export const del  = (path)       => http("DELETE", path);

// Endpoints
export const fetchProducts   = () => get("/products");
export const fetchProduct    = (id) => get(`/products/${id}`);
export const fetchCart       = () => get("/cart");
export const addToCart       = (product_id, quantity = 1) => post("/cart", { product_id, quantity });
export const updateCartQty   = (product_id, quantity) => patch("/cart", { product_id, quantity });
export const removeFromCart  = (product_id) => del(`/cart/${product_id}`);
export const clearCart       = () => del("/cart");
export const createOrder     = () => post("/orders");
export const listOrders      = () => get("/orders");
export const getOrder        = (id) => get(`/orders/${id}`);
export const loginApi        = (payload) => post("/auth/login", payload);
export const registerApi     = (payload) => post("/auth/register", payload);
