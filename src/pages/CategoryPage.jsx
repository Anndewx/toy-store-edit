import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";

export default function CategoryPage() {
  const { slug } = useParams(); // gundam | superhero | anime | game | new | hot
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        // ถ้า backend รองรับ /api/products?category= ชื่อหมวด ใช้เลย
        const res = await fetch(`/api/products?category=${encodeURIComponent(slug)}`);
        let data = res.ok ? await res.json() : [];

        // Fallback: ดึงทั้งหมดแล้วกรองฝั่ง FE
        if (!Array.isArray(data) || data.length === 0) {
          const all = await (await fetch("/api/products")).json();
          const list = Array.isArray(all) ? all : [];

          const s = slug.toLowerCase();
          if (s === "new") {
            data = list
              .slice()
              .sort((a, b) => new Date(b.created_at || b.product_id) - new Date(a.created_at || a.product_id))
              .slice(0, 24);
          } else if (s === "hot") {
            data = list.filter((p) => Number(p.is_hot) === 1);
          } else {
            data = list.filter((p) => {
              const cat = (p.category || "").toLowerCase();
              const tags = (p.tags || "").toLowerCase();
              return cat === s || tags.split(",").map(t => t.trim()).includes(s);
            });
          }
        }

        if (alive) setItems(data);
      } catch (e) {
        console.error(e);
        if (alive) {
          setErr("ไม่สามารถโหลดสินค้าตามหมวดได้");
          setItems([]);
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, [slug]);

  return (
    <div className="container-narrow" style={{ paddingTop: 24 }}>
      <h2 style={{ marginBottom: 12 }}>{slug.toUpperCase()}</h2>
      {err && <div className="alert alert-warning">{err}</div>}
      <div className="grid-products">
        {(loading ? Array.from({ length: 8 }) : items).map((p, i) => (
          <ProductCard key={p?.product_id || i} product={p} />
        ))}
      </div>
    </div>
  );
}
