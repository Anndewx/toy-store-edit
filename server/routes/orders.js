import express from "express";
import { pool } from "../db.js";
// import { authRequired } from "../middleware/auth.js"; // ถ้าจะล็อกอินก่อนสั่งซื้อค่อยเปิด

const router = express.Router();

// POST /api/orders
router.post("/", /*authRequired,*/ async (req, res) => {
  try {
    const { name, email, phone, address, items } = req.body || {};
    if (!name || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "invalid payload" });
    }
    const total = items.reduce((s, it) => s + Number(it.price) * Number(it.qty), 0);

    const [r] = await pool.query(
      "INSERT INTO orders (user_id, name, email, phone, address, total) VALUES (?,?,?,?,?,?)",
      [ null /* req.user?.id */, name, email || null, phone || "", address || "", total ]
    );
    const orderId = r.insertId;

    const vals = items.map(it => [orderId, it.id, it.name, it.price, it.qty, (Number(it.price)*Number(it.qty))]);
    await pool.query(
      "INSERT INTO order_items (order_id, product_id, name, price, qty, subtotal) VALUES ?",
      [vals]
    );

    res.json({ ok: true, id: orderId });
  } catch (e) {
    console.error("CREATE ORDER ERR:", e);
    res.status(500).json({ message: "create order failed" });
  }
});

// GET /api/orders/:id
router.get("/:id", async (req, res) => {
  const [[ord]] = await pool.query("SELECT * FROM orders WHERE id=?", [req.params.id]);
  if (!ord) return res.status(404).json({ message: "not found" });
  const [items] = await pool.query("SELECT * FROM order_items WHERE order_id=?", [req.params.id]);
  res.json({ ...ord, items });
});

export default router;
