import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ p, loading }) {
  const { add } = useCart();

  if (loading || !p) {
    return <div className="card product-skeleton" />;
  }

  const out = Number(p.stock) <= 0;

  return (
    <div className="card shadow-sm product-card">
      <Link to={`/product/${p.product_id}`} className="text-decoration-none text-dark">
        <div className="ratio ratio-4x3">
          <img
            src={p.image_url}
            alt={p.name}
            className="card-img-top rounded-top"
            style={{ objectFit: "cover" }}
          />
        </div>
      </Link>

      <div className="card-body">
        <Link to={`/product/${p.product_id}`} className="text-decoration-none text-dark">
          <h6 className="card-title mb-1">{p.name}</h6>
        </Link>

        {/* ✅ แสดงจำนวนคงเหลือใต้รูป */}
        <div className="small text-muted mb-1">คงเหลือ: <strong>{p.stock}</strong></div>

        <div className="d-flex align-items-baseline gap-2 mb-2">
          <span className="fw-bold">${Number(p.price).toFixed(2)}</span>
          {p.original_price && (
            <span className="text-muted text-decoration-line-through">
              ${Number(p.original_price).toFixed(2)}
            </span>
          )}
        </div>

        <button
          className="btn btn-sm btn-warning text-dark w-100"
          disabled={out}
          onClick={() => add?.(p.product_id, 1)}
        >
          {out ? "สินค้าหมด" : "เพิ่มลงตะกร้า"}
        </button>
      </div>
    </div>
  );
}
