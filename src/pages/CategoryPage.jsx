import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProducts } from "../lib/api";
import ProductCard from "../components/ProductCard";

const CATEGORY_MAP = { gundam: 3, anime: 1, superhero: 4, game: 2 };

export default function CategoryPage() {
  const { slug } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const all = await fetchProducts();
        const catId = CATEGORY_MAP[slug] ?? null;
        const filtered = catId ? all.filter(p => Number(p.category_id) === Number(catId)) : all;
        if (alive) setItems(filtered);
      } catch (e) {
        console.error(e);
        if (alive) setItems([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => (alive = false);
  }, [slug]);

  return (
    <div className="container-narrow">
      <h2 className="mb-3">{(slug ?? "All").toUpperCase()}</h2>
      <div className="grid-products">
        {(loading ? Array.from({ length: 8 }) : items).map((p, i) => (
          <ProductCard key={p?.product_id || i} p={p} loading={loading} />
        ))}
      </div>
    </div>
  );
}
