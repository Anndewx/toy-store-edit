import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const USD = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export default function ProductCard({ p, loading }) {
  const { add } = useCart();

  if (loading) return <div className="skeleton" />;

  return (
    <article className="product-card">
      <div className="thumb">
        <Link to={`/product/${p.product_id}`}>
          <img
            src={p.image_url || "/images/placeholder.png"}
            alt={p.name}
            className="card-img-top"
            style={{ width: "100%", aspectRatio: "4 / 3", objectFit: "cover", display: "block" }}
          />
        </Link>
        {Number(p.on_sale) ? (
          <span className="badge text-bg-danger badge-sale" style={{ position:"absolute", top:10, left:10 }}>
            Sale
          </span>
        ) : null}
      </div>

      <div className="body" style={{ padding: "12px 14px 14px", display:"flex", flexDirection:"column", gap:10 }}>
        <h6 className="title" style={{ fontWeight:600, lineHeight:1.3, margin:0 }}>
          <Link to={`/product/${p.product_id}`} className="text-decoration-none text-dark">
            {p.name}
          </Link>
        </h6>

        {p.description ? (
          <p className="desc" style={{ color:"#6b7280", fontSize:".9rem" }}>{p.description}</p>
        ) : (
          <div className="desc" style={{ minHeight:"0.5rem" }} />
        )}

        <div className="price-row" style={{ display:"flex", alignItems:"baseline", gap:8, marginTop:"auto" }}>
          <span className="price" style={{ fontWeight:700, fontSize:"1.05rem" }}>
            {USD.format(p.price)}
          </span>
          {p.original_price ? (
            <span className="price-old" style={{ color:"#9ca3af", textDecoration:"line-through" }}>
              {USD.format(p.original_price)}
            </span>
          ) : null}
        </div>

        <button className="btn btn-dark w-100" style={{ marginTop:8 }} onClick={() => add(p.product_id, 1)}>
          เพิ่มลงตะกร้า
        </button>
      </div>
    </article>
  );
}
