import { useEffect, useState } from "react";
import { fetchProducts } from "../lib/api";
import ProductCard from "../components/ProductCard";

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const skeletons = Array.from({ length: 8 });

  return (
    <div className="container-narrow">
      <h2 className="mb-3">สินค้าแนะนำ</h2>
      <div className="grid-products">
        {(loading ? skeletons : items).map((p, i) => (
          <ProductCard key={p?.product_id || i} p={p} loading={loading} />
        ))}
      </div>
    </div>
  );
}
