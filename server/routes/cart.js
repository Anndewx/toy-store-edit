import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/cart
router.get('/', requireAuth, async (req, res) => {
  const [rows] = await pool.query(
    `SELECT c.id, c.product_id, c.qty,
            p.name, p.price, p.image_url
     FROM carts c
     JOIN products p ON p.id = c.product_id
     WHERE c.user_id = ?
     ORDER BY c.id DESC`,
    [req.user.id]
  );
  res.json(rows);
});

// POST /api/cart { product_id, qty }
router.post('/', requireAuth, async (req, res) => {
  const { product_id, qty } = req.body || {};
  if (!product_id || !qty) return res.status(400).json({ message: 'Missing product_id/qty' });
  await pool.query(
    'INSERT INTO carts(user_id, product_id, qty) VALUES (?, ?, ?)',
    [req.user.id, product_id, qty]
  );
  res.status(201).json({ message: 'Added' });
});

// DELETE /api/cart/:id
router.delete('/:id', requireAuth, async (req, res) => {
  await pool.query('DELETE FROM carts WHERE id=? AND user_id=?', [req.params.id, req.user.id]);
  res.json({ message: 'Removed' });
});

export default router;
