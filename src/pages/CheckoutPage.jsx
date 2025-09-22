import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CheckoutPage() {
  const { items, subtotal, checkout } = useCart();
  const [form, setForm] = useState({ name: "", address: "", phone: "", method: "cod" });
  const nav = useNavigate();

  const shipping = useMemo(() => (items.length > 0 ? 40 : 0), [items.length]);
  const total = useMemo(() => subtotal + shipping, [subtotal, shipping]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function placeOrder() {
    if (items.length === 0) return nav("/");
    const res = await checkout(); // สร้าง order จริง + เก็บ lastOrder ใน localStorage
    if (res?.ok) nav("/receipt");
  }

  return (
    <div className="container py-4" style={{ maxWidth: 960 }}>
      <h2 className="mb-4">ชำระเงิน</h2>
      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5>รายการสินค้า</h5>
              <ul className="list-group">
                {items.map((it) => (
                  <li key={it.product_id} className="list-group-item d-flex justify-content-between">
                    <div>{it.name} × {it.quantity}</div>
                    <div>${(it.price * it.quantity).toFixed(2)}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <h5>ข้อมูลลูกค้า</h5>
              <input className="form-control mb-2" placeholder="ชื่อ" name="name" value={form.name} onChange={onChange}/>
              <input className="form-control mb-2" placeholder="ที่อยู่" name="address" value={form.address} onChange={onChange}/>
              <input className="form-control mb-2" placeholder="โทรศัพท์" name="phone" value={form.phone} onChange={onChange}/>
              <select className="form-select" name="method" value={form.method} onChange={onChange}>
                <option value="cod">ชำระปลายทาง</option>
                <option value="bank">โอนเงิน</option>
                <option value="card">บัตรเครดิต</option>
              </select>
            </div>
          </div>
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between"><span>ยอดสินค้า</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="d-flex justify-content-between"><span>ค่าจัดส่ง</span><span>${shipping.toFixed(2)}</span></div>
              <hr />
              <div className="d-flex justify-content-between fw-bold"><span>รวม</span><span>${total.toFixed(2)}</span></div>
              <button className="btn btn-warning text-dark w-100 mt-3" onClick={placeOrder}>ยืนยันสั่งซื้อ</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
