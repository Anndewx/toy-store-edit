// server/routes/products.js
import express from "express";
import { pool } from "../db.js";

const router = express.Router();

/**
 * GET /api/products
 * ตัวเลือก:
 *   ?q=keyword         ค้นหาใน name/description
 *   ?category=1..N     กรองตามหมวด (ถ้าคุณมี category_id)
 *   ?page=1&limit=12   เพจจิเนชัน
 */
router.get("/", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    const category = req.query.category ? Number(req.query.category) : null;
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(50, Math.max(1, Number(req.query.limit || 12)));
    const offset = (page - 1) * limit;

    const where = [];
    const params = [];

    if (q) {
      where.push("(name LIKE ? OR description LIKE ?)");
      const like = `%${q}%`;
      params.push(like, like);
    }
    if (category) {
      where.push("category_id = ?");
      params.push(category);
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    // นับทั้งหมด (เพื่อทำเพจ)
    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM products ${whereSql}`,
      params
    );
    const total = countRows[0]?.total || 0;

    // ดึงรายการตามหน้า
    const [rows] = await pool.query(
      `SELECT * FROM products ${whereSql} ORDER BY id DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    res.json({
      items: rows,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (e) {
    console.error("GET /products error:", e);
    res.status(500).json({ message: "internal error" });
  }
});

/**
 * GET /api/products/:id
 * ดึงสินค้าตาม id
 */
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "invalid id" });
    }

    const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [id]);
    if (!rows.length) return res.status(404).json({ message: "Not found" });

    res.json(rows[0]);
  } catch (e) {
    console.error("GET /products/:id error:", e);
    res.status(500).json({ message: "internal error" });
  }
});

export default router;
