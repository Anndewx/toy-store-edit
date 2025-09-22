import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { fetchProducts } from "../lib/api";

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setErr("");
        setLoading(true);
        const data = await fetchProducts();
        if (!Array.isArray(data)) {
          throw new Error("Invalid response");
        }
        if (alive) setItems(data);
      } catch (e) {
        console.error("fetchProducts failed:", e);
        if (alive) {
          setItems([]);
          setErr("โหลดสินค้าล้มเหลว (500) — กรุณาตรวจสอบเซิร์ฟเวอร์");
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const skeletons = Array.from({ length: 8 });

  return (
    <div className="container-narrow" style={{ paddingTop: 24 }}>
      <h2 className="mb-3 text-dark">สินค้าแนะนำ</h2>

      {err && (
        <div className="alert alert-warning mb-3">
          {err}
        </div>
      )}

      <div className="grid-products">
        {(loading ? skeletons : items).map((p, i) => (
          <ProductCard key={p?.product_id || i} p={p} loading={loading} />
        ))}
      </div>
    </div>
  );
}
