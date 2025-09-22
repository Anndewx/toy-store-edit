import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ReceiptPage() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("lastOrder");
    if (raw) setOrder(JSON.parse(raw));
  }, []);

  if (!order) {
    return (
      <div className="container py-4">
        <h3 className="mb-3">ไม่พบใบเสร็จล่าสุด</h3>
        <Link to="/" className="btn btn-dark">กลับหน้าหลัก</Link>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: 820 }}>
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="mb-2">ใบเสร็จรับเงิน</h3>
          <div className="text-muted mb-3">คำสั่งซื้อเลขที่ #{order.order_id} • {new Date(order.at).toLocaleString()}</div>

          <ul className="list-group mb-3">
            {order.items.map((it) => (
              <li key={it.product_id} className="list-group-item d-flex justify-content-between">
                <div>{it.name} × {it.quantity}</div>
                <div>${(it.price * it.quantity).toFixed(2)}</div>
              </li>
            ))}
          </ul>

          <div className="d-flex justify-content-between fw-bold">
            <span>รวมทั้งสิ้น</span>
            <span>${Number(order.total ?? order.subtotal).toFixed(2)}</span>
          </div>

          <div className="mt-3 d-flex gap-2">
            <button className="btn btn-outline-secondary" onClick={() => window.print()}>พิมพ์/บันทึก PDF</button>
            <Link to="/" className="btn btn-dark">กลับไปช้อปต่อ</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
