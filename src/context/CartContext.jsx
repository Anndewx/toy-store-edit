import { createContext, useContext, useState, useEffect } from "react";

// สร้าง Context
const CartCtx = createContext();

// ✅ hook ใช้งาน context
export const useCart = () => useContext(CartCtx);

const API = "http://localhost:3006/api"; // แก้ถ้าพอร์ตไม่ตรงกับ server.js

// ✅ Provider ครอบแอป
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // โหลดตะกร้า
  async function refresh() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/cart`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  // เพิ่มสินค้า
  async function add(product_id, quantity = 1) {
    try {
      await fetch(`${API}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id, quantity }),
      });
      await refresh();
    } catch (err) {
      console.error("Add failed:", err);
    }
  }

  // ลบสินค้าออกจากตะกร้า
  async function remove(product_id) {
    try {
      await fetch(`${API}/cart/${product_id}`, { method: "DELETE" });
      await refresh();
    } catch (err) {
      console.error("Remove failed:", err);
    }
  }

  // ล้างตะกร้าทั้งหมด
  async function clear() {
    try {
      await fetch(`${API}/cart`, { method: "DELETE" });
      await refresh();
    } catch (err) {
      console.error("Clear failed:", err);
    }
  }

  // ชำระเงิน
  async function checkout() {
    try {
      const res = await fetch(`${API}/orders`, { method: "POST" });
      if (!res.ok) throw new Error("Checkout failed");
      const data = await res.json();
      await refresh();
      return data; // { ok, order_id, total }
    } catch (err) {
      console.error("Checkout failed:", err);
      return { ok: false };
    }
  }

  // โหลด cart ตอนเข้าแอป
  useEffect(() => {
    refresh();
  }, []);

  // รวมราคาสินค้า
  const total = items.reduce(
    (sum, it) => sum + Number(it.price) * Number(it.quantity),
    0
  );

  return (
    <CartCtx.Provider
      value={{ items, add, remove, clear, checkout, total, loading }}
    >
      {children}
    </CartCtx.Provider>
  );
}

// ✅ export default ให้ import ได้สองแบบ
export default CartProvider;
