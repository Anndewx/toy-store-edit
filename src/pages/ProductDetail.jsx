import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProductById } from "../lib/api";

export default function ProductDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await fetchProductById(id);
      setItem(data);
    })();
  }, [id]);

  if (!item) return <p>กำลังโหลด...</p>;

  return (
    <div className="container-narrow">
      <h2>{item.name}</h2>
      <img src={item.image_url} alt={item.name} />
      <p>ราคา: ${item.price}</p>
      <p>คงเหลือ: {item.stock}</p>
    </div>
  );
}
