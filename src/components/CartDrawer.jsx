import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartDrawer() {
  const nav = useNavigate();
  const { items = [], subtotal = 0, updateQty, remove, clear } = useCart();

  const inc = (id, q) => updateQty?.(id, q + 1);
  const dec = (id, q) => updateQty?.(id, Math.max(1, q - 1));

  return (
    <div className="offcanvas offcanvas-end" tabIndex="-1" id="cartDrawer">
      <div className="offcanvas-header">
        <h5 className="offcanvas-title">ตะกร้าสินค้า</h5>
        <button className="btn-close" data-bs-dismiss="offcanvas"></button>
      </div>
      <div className="offcanvas-body d-flex flex-column">
        {items.length === 0 ? (
          <p className="text-muted">ตะกร้าว่าง</p>
        ) : (
          <ul className="list-group mb-3">
            {items.map((it) => (
              <li key={it.product_id} className="list-group-item d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                  <img src={it.image_url} alt="" style={{ width: 48, height: 48, objectFit: "cover" }} />
                  <div>
                    <div>{it.name}</div>
                    <div className="d-flex align-items-center gap-2">
                      <button className="btn btn-sm btn-outline-dark" onClick={() => dec(it.product_id, it.quantity)}>-</button>
                      <span>{it.quantity}</span>
                      <button className="btn btn-sm btn-outline-dark" onClick={() => inc(it.product_id, it.quantity)}>+</button>
                      <button className="btn btn-sm btn-link text-danger" onClick={() => remove?.(it.product_id)}>ลบ</button>
                    </div>
                  </div>
                </div>
                <div>${(it.price * it.quantity).toFixed(2)}</div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto">
          <div className="d-flex justify-content-between fw-bold mb-2">
            <span>รวม</span><span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary w-50" onClick={clear}>ล้างตะกร้า</button>
            <button className="btn btn-warning text-dark w-50" data-bs-dismiss="offcanvas" onClick={() => nav("/checkout")}>
              ไปชำระเงิน
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
