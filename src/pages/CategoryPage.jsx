import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";

export default function CategoryPage() {
  const { slug } = useParams();           // gundam | anime | superhero | game | new | hot
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        // พยายามขอจาก API ตามหมวดก่อน
        const res = await fetch(`/api/products?category=${encodeURIComponent(slug)}`);
        let data = [];
        if (res.ok) {
          data = await res.json();
        }

        // กันไว้กรณี backend ยังไม่รองรับ query ?category=
        if (!Array.isArray(data) || data.length === 0) {
          const all = await (await fetch("/api/products")).json();
          const list = Array.isArray(all) ? all : [];

          data =
            slug === "new"
              ? list
                  .slice() // clone
                  .sort((a, b) => new Date(b.created_at || b.id) - new Date(a.created_at || a.id))
                  .slice(0, 24)
              : slug === "hot"
              ? list.filter((p) => p.is_hot === 1)
              : list.filter(
                  (p) =>
                    (p.category?.toLowerCase?.() ?? "") === slug.toLowerCase() ||
                    (p.tags ?? "").toLowerCase().includes(slug.toLowerCase())
                );
        }

        if (alive) setItems(data);
      } catch (e) {
        console.error("Category load failed:", e);
        if (alive) {
          setItems([]);
          setErr("ไม่สามารถโหลดสินค้าตามหมวดได้");
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
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
