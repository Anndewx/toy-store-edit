// src/lib/api.js
// ปรับตรงนี้ให้ตรงกับ server.js ของคุณ
export const API = import.meta.env.VITE_API_BASE || "http://localhost:3006/api";

export async function fetchProducts() {
  const res = await fetch(`${API}/products`);
  if (!res.ok) throw new Error(`Fetch products failed: ${res.status}`);
  return res.json();
}

// helper ทั่วไป (ถ้าจะใช้ที่อื่น)
export async function get(path) {
  const r = await fetch(`${API}${path}`);
  if (!r.ok) throw new Error(`${path} failed: ${r.status}`);
  return r.json();
}
export async function post(path, body) {
  const r = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
  if (!r.ok) throw new Error(`${path} failed: ${r.status}`);
  return r.json();
}
export async function del(path) {
  const r = await fetch(`${API}${path}`, { method: "DELETE" });
  if (!r.ok) throw new Error(`${path} failed: ${r.status}`);
  return r.json();
}
export async function patch(path, body) {
  const r = await fetch(`${API}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
  if (!r.ok) throw new Error(`${path} failed: ${r.status}`);
  return r.json();
}
