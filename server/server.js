import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "./db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();
const app = express();

// ---------- CONFIG ----------
const JWT_SECRET = process.env.JWT_SECRET || "toy_store_secret";
const JWT_EXPIRES = "7d";
const USER_ID_DEFAULT = 1; // fallback ถ้าไม่ได้ login

app.use(
  cors({
    origin: true, // หรือ fix เป็น "http://localhost:5173"
    credentials: true,
  })
);
app.use(express.json());

// ----- เสิร์ฟไฟล์ static -----
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/images", express.static(path.resolve(__dirname, "..", "public", "images")));

// ---------- UTIL / MIDDLEWARE ----------
function getBearerToken(req) {
  const h = req.headers.authorization || "";
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m ? m[1] : null;
}

function authOptional(req, _res, next) {
  // อ่าน token ถ้ามี
  const token = getBearerToken(req);
  if (!token) {
    req.user_id = USER_ID_DEFAULT;
    return next();
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user_id = payload.user_id || USER_ID_DEFAULT;
  } catch {
    req.user_id = USER_ID_DEFAULT; // token ไม่ถูกต้อง ก็ยังให้ใช้ระบบได้แบบเดิม
  }
  next();
}

function authRequired(req, res, next) {
  const token = getBearerToken(req);
  if (!token) return res.status(401).json({ ok: false, error: "Missing token" });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user_id = payload.user_id;
    next();
  } catch {
    return res.status(401).json({ ok: false, error: "Invalid token" });
  }
}

// ---------- HEALTH ----------
app.get("/api/health", async (_req, res) => {
  try {
    const [r] = await pool.query("SELECT 1 AS ok");
    res.json({ ok: r[0].ok === 1 });
  } catch {
    res.status(500).json({ ok: false });
  }
});

// ---------- AUTH ----------
/**
 * POST /api/auth/register
 * body: { name, email, password }
 * res : { ok, user:{user_id,name,email}, token }
 */
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ ok: false, error: "name, email, password are required" });
    }

    // email duplicate?
    const [dup] = await pool.query(`SELECT user_id FROM users WHERE email = ?`, [email]);
    if (dup.length > 0) return res.status(409).json({ ok: false, error: "Email already exists" });

    const hash = await bcrypt.hash(password, 10);
    const [ins] = await pool.query(
      `INSERT INTO users (name, email, password, role) VALUES (?,?,?, 'customer')`,
      [name, email, hash]
    );
    const user_id = ins.insertId;

    const token = jwt.sign({ user_id, email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.json({ ok: true, user: { user_id, name, email }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Failed to register" });
  }
});

/**
 * POST /api/auth/login
 * body: { email, password }
 * res : { ok, user:{user_id,name,email}, token }
 */
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ ok: false, error: "email and password are required" });
    }

    const [rows] = await pool.query(
      `SELECT user_id, name, email, password FROM users WHERE email = ?`,
      [email]
    );
    if (rows.length === 0) return res.status(401).json({ ok: false, error: "Invalid credentials" });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ ok: false, error: "Invalid credentials" });

    const token = jwt.sign({ user_id: user.user_id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES,
    });
    res.json({
      ok: true,
      user: { user_id: user.user_id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Failed to login" });
  }
});

// ---------- PRODUCTS ----------
app.get("/api/products", async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT product_id, category_id, name, description, price, original_price, stock, image_url, on_sale
       FROM products ORDER BY product_id ASC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// ---------- CART (authOptional: ใช้ user จาก token ถ้ามี) ----------
app.get("/api/cart", authOptional, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.cart_id, c.product_id, c.quantity, p.name, p.price, p.original_price, p.image_url
       FROM cart c
       JOIN products p ON p.product_id = c.product_id
       WHERE c.user_id = ?`,
      [req.user_id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

app.post("/api/cart", authOptional, async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body || {};
    if (!product_id) return res.status(400).json({ error: "product_id required" });

    const [upd] = await pool.query(
      `UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?`,
      [quantity, req.user_id, product_id]
    );
    if (upd.affectedRows === 0) {
      await pool.query(
        `INSERT INTO cart (user_id, product_id, quantity) VALUES (?,?,?)`,
        [req.user_id, product_id, quantity]
      );
    }
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add to cart" });
  }
});

app.patch("/api/cart", authOptional, async (req, res) => {
  try {
    const { product_id, quantity } = req.body || {};
    if (!product_id || typeof quantity !== "number") {
      return res.status(400).json({ error: "product_id and quantity are required" });
    }

    if (quantity <= 0) {
      await pool.query(`DELETE FROM cart WHERE user_id = ? AND product_id = ?`, [
        req.user_id,
        product_id,
      ]);
      return res.json({ ok: true, removed: true });
    }

    const [upd] = await pool.query(
      `UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?`,
      [quantity, req.user_id, product_id]
    );
    if (upd.affectedRows === 0) {
      await pool.query(
        `INSERT INTO cart (user_id, product_id, quantity) VALUES (?,?,?)`,
        [req.user_id, product_id, quantity]
      );
    }
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update cart" });
  }
});

app.delete("/api/cart/:productId", authOptional, async (req, res) => {
  try {
    const productId = Number(req.params.productId);
    const [result] = await pool.query(
      `DELETE FROM cart WHERE user_id = ? AND product_id = ?`,
      [req.user_id, productId]
    );
    res.json({ ok: true, removed: result.affectedRows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove from cart" });
  }
});

app.delete("/api/cart", authOptional, async (req, res) => {
  try {
    const [result] = await pool.query(`DELETE FROM cart WHERE user_id = ?`, [req.user_id]);
    res.json({ ok: true, cleared: result.affectedRows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to clear cart" });
  }
});

// ---------- ORDERS (authOptional) ----------
app.post("/api/orders", authOptional, async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [items] = await conn.query(
      `SELECT c.product_id, c.quantity, p.price
       FROM cart c
       JOIN products p ON p.product_id = c.product_id
       WHERE c.user_id = ?`,
      [req.user_id]
    );
    if (items.length === 0) {
      await conn.rollback();
      return res.status(400).json({ error: "Cart is empty" });
    }

    const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const [orderRes] = await conn.query(
      `INSERT INTO orders (user_id, total_price, status) VALUES (?,?, 'pending')`,
      [req.user_id, total]
    );
    const orderId = orderRes.insertId;

    for (const it of items) {
      await conn.query(
        `INSERT INTO order_details (order_id, product_id, quantity, price)
         VALUES (?,?,?,?)`,
        [orderId, it.product_id, it.quantity, it.price]
      );
      await conn.query(
        `UPDATE products SET stock = stock - ? WHERE product_id = ? AND stock >= ?`,
        [it.quantity, it.product_id, it.quantity]
      );
    }

    await conn.query(`DELETE FROM cart WHERE user_id = ?`, [req.user_id]);

    await conn.commit();
    res.json({ ok: true, order_id: orderId, total });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: "Failed to create order" });
  } finally {
    conn.release();
  }
});

// ---------- START ----------
const PORT = Number(process.env.PORT) || 3006;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
