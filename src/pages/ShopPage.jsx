import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

export default function ShopPage() {
  const { category } = useParams();
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/products?category=${category}`);
      const data = await res.json();
      setItems(data);
    })();
  }, [category]);

  return (
    <div className="container-narrow">
      <h2>หมวดหมู่: {category}</h2>
      <div className="grid-products">
        {items.map((p) => (
          <ProductCard key={p.product_id} product={p} />
        ))}
      </div>
    </div>
  );
}
