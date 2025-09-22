// src/pages/ProductDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const toImg = (u) => (u ? u.replace(/^\.\//, "/") : ""); // ./images/x.jpg -> /images/x.jpg

export default function ProductDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { add } = useCart();

  const [p, setP] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/product.php?id=${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setP(data))
      .catch(() => setP(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container">กำลังโหลด...</div>;
  if (!p) return <div className="container">ไม่พบสินค้า</div>;

  return (
    <div className="container">
      <button className="btn-ghost" onClick={() => nav(-1)}>← กลับ</button>

      <div className="pd-grid">
        <div className="pd-img">
          <img src={toImg(p.image_url)} alt={p.name} />
        </div>

        <div className="pd-info">
          <h1>{p.name}</h1>
          <p className="muted">{p.description}</p>
          <div className="price">฿{Number(p.price).toFixed(2)}</div>

          <button className="btn-primary" onClick={() => add(p, 1)}>
            เพิ่มลงตะกร้า
          </button>
        </div>
      </div>

      <style>{`
        .container{max-width:1200px;margin:0 auto;padding:24px 16px;}
        .btn-ghost{border:1px solid #e5e7eb;background:#fff;border-radius:12px;padding:10px 14px;margin-bottom:16px}
        .pd-grid{display:grid;grid-template-columns:1fr 1fr;gap:32px;align-items:start}
        .pd-img img{width:100%;max-height:520px;object-fit:contain;border-radius:16px;background:#fafafa}
        .pd-info h1{font-size:2rem;margin:0 0 8px;font-weight:900}
        .muted{color:#6b7280}
        .price{font-size:1.5rem;font-weight:900;margin:12px 0}
        .btn-primary{background:#ff8a00;color:#fff;border:none;border-radius:14px;padding:12px 18px;font-weight:800}
        @media (max-width:900px){ .pd-grid{grid-template-columns:1fr} }
      `}</style>
    </div>
  );
}
