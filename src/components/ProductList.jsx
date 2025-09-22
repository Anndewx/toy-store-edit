// src/components/ProductList.jsx
import { useEffect, useState } from 'react';

export default function ProductList() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/products'); // ผ่าน proxy ไป 3001
        if (!res.ok) {
          setError(`โหลดสินค้าล้มเหลว (${res.status})`);
          return;
        }
        const data = await res.json();
        setItems(data);
      } catch {
        setError('มีปัญหาในการเชื่อมต่อเซิร์ฟเวอร์');
      }
    })();
  }, []);

  if (error) return <p style={{ color: 'crimson' }}>{error}</p>;
  if (!items.length) return <p>ไม่พบสินค้า</p>;

  return (
    <ul>
      {items.map(p => (
        <li key={p.product_id || p.id}>
          {p.name} — {p.price}
        </li>
      ))}
    </ul>
  );
}
