import "./ReceiptPage.css";

function mask(s = "", left = 4, right = 2) {
  const str = String(s).replace(/\s/g, "");
  if (str.length <= left + right) return "****";
  return str.slice(0, left) + "****".repeat(3) + str.slice(-right);
}

export default function ReceiptPage() {
  const raw = (typeof window !== "undefined" && localStorage.getItem("lastOrder")) || "{}";
  const order = JSON.parse(raw || "{}");

  if (!order?.order_id) {
    return (
      <div className="rcp">
        <h2>ไม่พบใบเสร็จ</h2>
        <p>กรุณาทำรายการสั่งซื้อใหม่อีกครั้ง</p>
      </div>
    );
  }

  const method = (order.method || "unknown").toUpperCase();
  const pay = order.payload || {};
  const cardMasked = pay.card_number ? mask(pay.card_number) : null;

  return (
    <div className="rcp">
      <div className="rcp__box">
        <h2>ใบเสร็จรับเงิน</h2>
        {order.demo && <div className="rcp__tag">DEMO</div>}
        <div className="rcp__row"><span>หมายเลขใบเสร็จ</span><b>#{order.order_id}</b></div>
        <div className="rcp__row"><span>วันที่</span><b>{new Date(order.at).toLocaleString()}</b></div>
        <div className="rcp__row"><span>วิธีชำระเงิน</span><b>{method}</b></div>
        {cardMasked && <div className="rcp__row"><span>หมายเลขบัตร</span><b>{cardMasked}</b></div>}

        <div className="rcp__table">
          <div className="rcp__thead"><span>รายการ</span><span>จำนวน</span><span>ราคา</span></div>
          {order.items?.map((i) => (
            <div className="rcp__tr" key={i.product_id}>
              <span>{i.name}</span>
              <span>{i.quantity}</span>
              <span>${(Number(i.price)*Number(i.quantity)).toFixed(2)}</span>
            </div>
          ))}
          <div className="rcp__tfoot">
            <span>ยอดรวม</span>
            <span />
            <b>${Number(order.total || order.subtotal || 0).toFixed(2)}</b>
          </div>
        </div>

        <div className="rcp__actions">
          <a href="/" className="rcp__btn">กลับหน้าแรก</a>
          <button className="rcp__btn ghost" onClick={() => window.print()}>พิมพ์</button>
        </div>
      </div>
    </div>
  );
}
