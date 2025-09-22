import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProduct } from "../lib/api";
import { useCart } from "../context/CartContext";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { add } = useCart();
  const [p, setP] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchProduct(id);
        if (alive) setP(data);
      } catch {
        setErr("ไม่พบสินค้า");
        setP(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => (alive = false);
  }, [id]);

  if (loading) return <div className="container py-4">กำลังโหลด…</div>;
  if (!p) return <div className="container py-4">{err || "ไม่พบสินค้า"}</div>;

  const out = Number(p.stock) <= 0;

  return (
    <div className="container py-4" style={{ maxWidth: 980 }}>
      <div className="row g-4">
        <div className="col-md-6">
          <img
            src={p.image_url}
            alt={p.name}
            className="img-fluid rounded"
            style={{ width: "100%", objectFit: "cover" }}
          />
          <div className="mt-2 text-muted">คงเหลือในสต็อก: <strong>{p.stock}</strong></div>
        </div>
        <div className="col-md-6">
          <h2 className="mb-2">{p.name}</h2>

          <div className="d-flex align-items-baseline gap-3 mb-3">
            <span className="h4 text-dark">${Number(p.price).toFixed(2)}</span>
            {p.original_price && (
              <span className="text-muted text-decoration-line-through">
                ${Number(p.original_price).toFixed(2)}
              </span>
            )}
          </div>

          {p.description && <p className="mb-3">{p.description}</p>}

          <div className="d-flex align-items-center gap-2 mb-3">
            <button
              className="btn btn-outline-dark"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={qty <= 1}
            >-</button>
            <input
              type="number"
              className="form-control"
              style={{ width: 90 }}
              min={1}
              max={p.stock || 1}
              value={qty}
              onChange={(e) =>
                setQty(
                  Math.min(Math.max(1, Number(e.target.value) || 1), Number(p.stock) || 1)
                )
              }
            />
            <button
              className="btn btn-outline-dark"
              onClick={() => setQty((q) => Math.min((p.stock || 1), q + 1))}
              disabled={qty >= (p.stock || 1)}
            >+</button>
          </div>

          <button
            className="btn btn-warning text-dark fw-bold"
            disabled={out}
            onClick={() => add(p.product_id, qty)}
          >
            {out ? "สินค้าหมด" : "เพิ่มลงตะกร้า"}
          </button>
        </div>
      </div>
    </div>
  );
}
