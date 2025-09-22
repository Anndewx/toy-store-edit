import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProducts } from "../lib/api";
import ProductCard from "../components/ProductCard";

const CATEGORY_MAP = { gundam: 3, anime: 1, superhero: 4, game: 2 };

// กรณีไม่มี category_id ให้เดาจากชื่อสินค้า
function inferCategoryIdByName(name = "") {
  const n = name.toLowerCase();
  if (/(gundam|sazabi|astray|strike)/.test(n)) return 3;
  if (/(baby groot|batman|deadpool|stormtrooper|ironman|cap|shield)/.test(n)) return 4;
  if (/(rem|asuka|izuku|midoriya|yamato)/.test(n)) return 1;
  if (/(halo|mario|game)/.test(n)) return 2;
  return null;
}

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
        const withCat = all.map(p => ({
          ...p,
          _cat: p.category_id ?? inferCategoryIdByName(p.name),
        }));
        const filtered = catId ? withCat.filter(p => p._cat === catId) : all;
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
    <div className="container-narrow" style={{ paddingTop: 24 }}>
      <h2 className="mb-3 text-dark">{(slug ?? "All").toUpperCase()}</h2>
      <div className="grid-products">
        {(loading ? Array.from({ length: 8 }) : items).map((p, i) => (
          <ProductCard key={p?.product_id || i} p={p} loading={loading} />
        ))}
      </div>
    </div>
  );
}
