// src/pages/CheckoutPage.jsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart: ctxCart, subtotal = 0, clear } = useCart();

  // ✅ กันพัง: ถ้า cart ไม่มี ให้เป็น []
  const cart = Array.isArray(ctxCart) ? ctxCart : [];

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    note: "",
    method: "cod", // cash on delivery
  });

  const shipping = useMemo(() => (cart.length > 0 ? 40 : 0), [cart.length]);
  const total = useMemo(() => subtotal + shipping, [subtotal, shipping]);

  const onChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const placeOrder = () => {
    if (cart.length === 0) {
      // ไม่มีของในตะกร้า
      navigate("/");
      return;
    }
    // สร้างเลขที่ใบเสร็จจำลอง
    const orderId = Date.now().toString(36);
    // เก็บข้อมูลใบเสร็จแบบง่าย (เผื่อหน้า Receipt ใช้)
    const receipt = {
      id: orderId,
      items: cart,
      subtotal,
      shipping,
      total,
      customer: form,
      created_at: new Date().toISOString(),
    };
    try {
      localStorage.setItem(`receipt_${orderId}`, JSON.stringify(receipt));
    } catch {}
    clear(); // ล้างตะกร้า
    navigate(`/orders/${orderId}`);
  };

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 24, maxWidth: 960 }}>
      <h2 className="mb-3">ชำระเงิน</h2>

      {cart.length === 0 ? (
        <div className="alert alert-warning">ตะกร้าคุณยังว่างอยู่ โปรดเลือกสินค้าเพิ่มก่อนนะ</div>
      ) : (
        <div className="row g-4">
          {/* ซ้าย: รายการสินค้า */}
          <div className="col-lg-7">
            <div className="card shadow-sm" style={{ borderRadius: 16 }}>
              <div className="card-body">
                <h5 className="card-title mb-3">รายการสินค้า</h5>
                <ul className="list-group">
                  {cart.map((item) => (
                    <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={item.image_url || "/placeholder.png"}
                          alt={item.name}
                          style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8 }}
                        />
                        <div>
                          <div className="fw-semibold">{item.name}</div>
                          <small className="text-muted">x{item.qty}</small>
                        </div>
                      </div>
                      <div className="fw-semibold">฿{(item.price * item.qty).toFixed(2)}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ขวา: ข้อมูลจัดส่ง + สรุปยอด */}
          <div className="col-lg-5">
            <div className="card shadow-sm mb-3" style={{ borderRadius: 16 }}>
              <div className="card-body">
                <h5 className="card-title mb-3">ข้อมูลจัดส่ง</h5>

                <div className="mb-3">
                  <label className="form-label">ชื่อ-นามสกุล</label>
                  <input className="form-control" name="name" value={form.name} onChange={onChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">ที่อยู่</label>
                  <textarea className="form-control" rows={3} name="address" value={form.address} onChange={onChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">เบอร์โทร</label>
                  <input className="form-control" name="phone" value={form.phone} onChange={onChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">หมายเหตุ</label>
                  <input className="form-control" name="note" value={form.note} onChange={onChange} />
                </div>
                <div className="mb-1">
                  <label className="form-label">วิธีชำระเงิน</label>
                  <select className="form-select" name="method" value={form.method} onChange={onChange}>
                    <option value="cod">ชำระปลายทาง (COD)</option>
                    <option value="bank">โอนผ่านธนาคาร</option>
                    <option value="card">บัตรเครดิต/เดบิต</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="card shadow-sm" style={{ borderRadius: 16 }}>
              <div className="card-body">
                <h5 className="card-title mb-3">สรุปยอด</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span>ยอดสินค้า</span>
                  <span>฿{subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>ค่าจัดส่ง</span>
                  <span>฿{shipping.toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fs-5 fw-bold mb-3">
                  <span>ยอดสุทธิ</span>
                  <span>฿{total.toFixed(2)}</span>
                </div>
                <button className="btn btn-dark w-100" onClick={placeOrder}>
                  ยืนยันสั่งซื้อ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
