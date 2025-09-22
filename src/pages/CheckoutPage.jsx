import { useState } from "react";
import { useCart } from "../context/CartContext";
import "./CheckoutPage.css";

export default function CheckoutPage() {
  const { items, subtotal, checkout } = useCart();
  const [tab, setTab] = useState("card"); // card | bank | cod
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function placeOrder(e) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    payload.method = tab;

    const res = await checkout(payload);
    setBusy(false);

    if (res?.ok) {
      setMsg(`คำสั่งซื้อสำเร็จ (#${res.order_id})`);
      window.location.href = "/receipt";
    } else {
      setMsg(res?.message || "ไม่สามารถทำรายการได้");
    }
  }

  return (
    <div className="co-wrap">
      <h2>ชำระเงิน</h2>

      <div className="co-grid">
        <section className="co-left">
          <div className="tabs">
            <button className={tab==='card'?'active':''} onClick={() => setTab('card')}>Credit / Debit Card</button>
            <button className={tab==='bank'?'active':''} onClick={() => setTab('bank')}>Bank Transfer</button>
            <button className={tab==='cod'?'active':''} onClick={() => setTab('cod')}>เก็บเงินปลายทาง</button>
          </div>

          <form className="panel" onSubmit={placeOrder}>
            {tab === "card" && (
              <>
                <div className="row">
                  <label>Card Number</label>
                  <input name="card_number" placeholder="1234 5678 9012 3456"
                         required pattern="^[0-9 ]{12,19}$" />
                </div>
                <div className="row3">
                  <div>
                    <label>Name on Card</label>
                    <input name="card_name" placeholder="AKARAPON T." required />
                  </div>
                  <div>
                    <label>Expiry (MM/YY)</label>
                    <input name="card_exp" placeholder="12/27" required pattern="^(0[1-9]|1[0-2])\/\d{2}$" />
                  </div>
                  <div>
                    <label>CVC</label>
                    <input name="card_cvc" placeholder="123" required pattern="^\d{3,4}$" />
                  </div>
                </div>
                <div className="row">
                  <label>Billing Address</label>
                  <input name="billing" placeholder="บ้านเลขที่/ถนน/แขวง/เขต" />
                </div>
              </>
            )}

            {tab === "bank" && (
              <>
                <div className="row">
                  <label>ธนาคาร</label>
                  <select name="bank" required>
                    <option value="">-- เลือกธนาคาร --</option>
                    <option>กสิกรไทย</option>
                    <option>ไทยพาณิชย์</option>
                    <option>กรุงไทย</option>
                    <option>กรุงเทพ</option>
                  </select>
                </div>
                <div className="row2">
                  <div>
                    <label>ชื่อบัญชี</label>
                    <input name="acc_name" required />
                  </div>
                  <div>
                    <label>หมายเลขบัญชี</label>
                    <input name="acc_no" required pattern="^[0-9\-]{6,20}$" />
                  </div>
                </div>
                <p className="hint">โอนแล้วแนบหลักฐานในหน้าติดตามออเดอร์ได้ภายหลัง</p>
              </>
            )}

            {tab === "cod" && (
              <>
                <div className="row">
                  <label>ที่อยู่จัดส่ง</label>
                  <textarea name="shipping_addr" required placeholder="บ้านเลขที่ / ถนน / ตำบล / อำเภอ / จังหวัด / รหัสไปรษณีย์"></textarea>
                </div>
                <div className="row">
                  <label>เบอร์ติดต่อ</label>
                  <input name="phone" required pattern="^\d{9,10}$" />
                </div>
              </>
            )}

            <button className="co-pay" disabled={busy}>
              {busy ? "กำลังทำรายการ..." : "ยืนยันชำระเงิน"}
            </button>
            {msg && <div className="co-msg">{msg}</div>}
          </form>
        </section>

        <aside className="co-right">
          <h3>สรุปรายการ</h3>
          <ul className="co-list">
            {items.map(i => (
              <li key={i.product_id}>
                <span>{i.name} × {i.quantity}</span>
                <b>${(Number(i.price)*Number(i.quantity)).toFixed(2)}</b>
              </li>
            ))}
          </ul>
          <div className="co-total">
            <span>ยอดรวม</span>
            <b>${subtotal.toFixed(2)}</b>
          </div>
        </aside>
      </div>
    </div>
  );
}
