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
                  <input name="card_number" placeholder="ใส่อะไรก็ได้ในโหมดเดโม" />
                </div>
                <div className="row3">
                  <div>
                    <label>Name on Card</label>
                    <input name="card_name" placeholder="ใส่อะไรก็ได้" />
                  </div>
                  <div>
                    <label>Expiry (MM/YY)</label>
                    <input name="card_exp" placeholder="12/27" />
                  </div>
                  <div>
                    <label>CVC</label>
                    <input name="card_cvc" placeholder="123" />
                  </div>
                </div>
                <div className="row">
                  <label>Billing Address</label>
                  <input name="billing" placeholder="ที่อยู่เรียกเก็บเงิน (ไม่บังคับ)" />
                </div>
              </>
            )}

            {tab === "bank" && (
              <>
                <div className="row">
                  <label>ธนาคาร</label>
                  <select name="bank" defaultValue="">
                    <option value="">(เดโม) เลือกธนาคารอะไรก็ได้</option>
                    <option>กสิกรไทย</option>
                    <option>ไทยพาณิชย์</option>
                    <option>กรุงไทย</option>
                    <option>กรุงเทพ</option>
                  </select>
                </div>
                <div className="row2">
                  <div>
                    <label>ชื่อบัญชี</label>
                    <input name="acc_name" placeholder="ใส่อะไรก็ได้" />
                  </div>
                  <div>
                    <label>หมายเลขบัญชี</label>
                    <input name="acc_no" placeholder="123-456-7890" />
                  </div>
                </div>
                <p className="hint">โหมดเดโม: ไม่ต้องแนบสลิปจริง กดยืนยันเพื่อรับใบเสร็จได้</p>
              </>
            )}

            {tab === "cod" && (
              <>
                <div className="row">
                  <label>ที่อยู่จัดส่ง</label>
                  <textarea name="shipping_addr" placeholder="ที่อยู่ปลายทาง (ใส่อะไรก็ได้ในเดโม)"></textarea>
                </div>
                <div className="row">
                  <label>เบอร์ติดต่อ</label>
                  <input name="phone" placeholder="เบอร์สำหรับติดต่อ (ไม่ตรวจเข้มในเดโม)" />
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
