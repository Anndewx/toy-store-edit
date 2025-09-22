import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  fetchCart, addToCart, updateCartQty, removeFromCart, clearCart, createOrder,
} from "../lib/api";

const CartCtx = createContext(null);
export const useCart = () => useContext(CartCtx);

export default function CartProvider({ children }) {
  const [items, setItems] = useState([]);   // [{product_id, name, price, quantity, image_url}]
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

  async function add(product_id, qty = 1) {
    await addToCart(product_id, qty);
    await refresh();
  }

  async function updateQty(product_id, qty) {
    await updateCartQty(product_id, qty);
    await refresh();
  }

  async function remove(product_id) {
    await removeFromCart(product_id);
    await refresh();
  }

  async function clear() {
    await clearCart();
    await refresh();
  }

  async function checkout() {
    // เก็บ snapshot ไว้ทำใบเสร็จ
    const snapshot = {
      at: new Date().toISOString(),
      items: items.map(i => ({ ...i })), // clone
      subtotal: items.reduce((s, i) => s + Number(i.price) * Number(i.quantity), 0),
    };
    const res = await createOrder(); // { ok, order_id, total }
    if (res?.ok) {
      localStorage.setItem("lastOrder", JSON.stringify({ ...snapshot, order_id: res.order_id, total: res.total }));
      await refresh(); // backend ล้าง cart ให้แล้ว
    }
    return res;
  }

  useEffect(() => { refresh(); }, []);

  const subtotal = useMemo(
    () => items.reduce((s, i) => s + Number(i.price) * Number(i.quantity), 0),
    [items]
  );

  return (
    <CartCtx.Provider value={{ items, loading, subtotal, add, updateQty, remove, clear, checkout, refresh }}>
      {children}
    </CartCtx.Provider>
  );
}
