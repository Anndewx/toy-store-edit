// src/components/CartDrawer.jsx
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartDrawer() {
  const nav = useNavigate();
  // ดึงทุกอย่างที่ context อาจให้มา (เผื่อหลายเวอร์ชัน)
  const ctx = useCart?.() ?? {};
  const {
    cart,             // เวอร์ชันเดิม: array
    items,            // เวอร์ชันใหม่: array
    remove,           // ฟังก์ชันลบรายการ (อาจไม่มี)
    clear,            // ฟังก์ชันล้างตะกร้า (อาจไม่มี)
    subtotal,         // เวอร์ชันเดิม: number
    total,            // เวอร์ชันใหม่: number
    checkout,         // เวอร์ชันใหม่: async function (อาจไม่มี)
    loading,
  } = ctx;

  // ทำให้แน่ใจว่าเป็นอาเรย์
  const list = Array.isArray(items) ? items : (Array.isArray(cart) ? cart : []);

  // ทำให้ชื่อฟิลด์เข้ากันได้หลายแบบ
  const getQty = (it) => (it?.quantity ?? it?.qty ?? 1);
  const getId  = (it) => (it?.cart_id ?? it?.id ?? it?.product_id);
  const getImg = (it) => (it?.image_url ?? it?.image ?? "/placeholder.png");

  // รวมยอดเมื่อไม่มี subtotal/total จาก context
  const computedSum = list.reduce((s, it) => s + Number(it.price || 0) * Number(getQty(it)), 0);
  const grandTotal = typeof total === "number" ? total :
                     typeof subtotal === "number" ? subtotal : computedSum;

  async function handleCheckout() {
    try {
      if (typeof checkout === "function") {
        const result = await checkout(); // ควรคืน { ok, order_id, total } จากแบ็กเอนด์
        if (result?.ok) {
          alert(`สั่งซื้อสำเร็จ เลขที่คำสั่งซื้อ #${result.order_id}\nรวม: ฿${Number(result.total).toFixed(2)}`);
        } else {
          alert("ชำระเงินไม่สำเร็จ");
        }
      } else {
        // ถ้าไม่มี checkout ใน context ให้ไปหน้า /checkout ตามโค้ดเดิม
        nav("/checkout");
      }
    } catch (e) {
      console.error(e);
      alert("ชำระเงินไม่สำเร็จ");
    }
  }

  return (
    <div
      className="offcanvas offcanvas-end"
      tabIndex="-1"
      id="cartDrawer"
      aria-labelledby="cartDrawerLabel"
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="cartDrawerLabel">ตะกร้าสินค้า</h5>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>

      <div className="offcanvas-body d-flex flex-column">
        {list.length === 0 ? (
          <p className="text-muted">ตะกร้าว่างเปล่า</p>
        ) : (
          <ul className="list-group mb-3">
            {list.map((item) => (
              <li
                className="list-group-item d-flex align-items-center justify-content-between"
                key={getId(item)}
              >
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={getImg(item)}
                    alt={item?.name || "product"}
                    style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8 }}
                  />
                  <div>
                    <div className="fw-semibold">{item?.name || "สินค้า"}</div>
                    <small className="text-muted">x{getQty(item)}</small>
                  </div>
                </div>

                <div className="text-end">
                  <div>฿{(Number(item?.price || 0) * Number(getQty(item))).toFixed(2)}</div>

                  {typeof remove === "function" && (
                    <button
                      className="btn btn-sm btn-link text-danger p-0"
                      onClick={() => remove(getId(item))}
                    >
                      ลบ
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto">
          <div className="d-flex justify-content-between mb-2">
            <span className="fw-bold">รวม</span>
            <span className="fw-bold">฿{Number(grandTotal).toFixed(2)}</span>
          </div>

          <div className="d-flex gap-2">
            {typeof clear === "function" ? (
              <button className="btn btn-outline-secondary w-50" onClick={clear} disabled={loading}>
                ล้างตะกร้า
              </button>
            ) : (
              <button className="btn btn-outline-secondary w-50" disabled>
                ล้างตะกร้า
              </button>
            )}

            <button
              className="btn btn-dark w-50"
              data-bs-dismiss="offcanvas"
              onClick={handleCheckout}
              disabled={loading}
            >
              ไปชำระเงิน
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
