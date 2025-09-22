// src/context/CartContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  fetchCart, addToCart, updateCartQty, removeFromCart, clearCart, createOrder,
} from "../lib/api";

const CartCtx = createContext(null);
export const useCart = () => useContext(CartCtx);

export default function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const data = await fetchCart();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("fetch cart failed:", e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  async function add(product_id, qty = 1) { await addToCart(product_id, qty); await refresh(); }
  async function updateQty(product_id, qty) { await updateCartQty(product_id, qty); await refresh(); }
  async function remove(product_id) { await removeFromCart(product_id); await refresh(); }
  async function clear() { await clearCart(); await refresh(); }

  // 🔧 UPDATED: รับ payload การชำระเงิน และส่งให้ backend
  async function checkout(payload = {}) {
    const snapshot = {
      at: new Date().toISOString(),
      items: items.map(i => ({ ...i })),
      subtotal: items.reduce((s, i) => s + Number(i.price) * Number(i.quantity), 0),
    };

    // ส่ง payload ไปกับคำสั่งซื้อ (เช่น method, ข้อมูลบัตร/โอน/COD เป็นต้น)
    const res = await createOrder(payload);

    if (res?.ok) {
      localStorage.setItem(
        "lastOrder",
        JSON.stringify({
          ...snapshot,
          order_id: res.order_id,
          total: res.total,
          method: payload.method || "unknown",
        })
      );
      await refresh();
    }
    return res;
  }

  useEffect(() => { refresh(); }, []);

  const subtotal = useMemo(
    () => items.reduce((s, i) => s + Number(i.price) * Number(i.quantity), 0),
    [items]
  );

  const count = useMemo(
    () => items.reduce((s, i) => s + Number(i.quantity), 0),
    [items]
  );

  return (
    <CartCtx.Provider
      value={{ items, loading, subtotal, count, add, updateQty, remove, clear, checkout, refresh }}
    >
      {children}
    </CartCtx.Provider>
  );
}
