import "./ProductCard.css";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const { add } = useCart();
  if (!product) return null;

  const {
    product_id,
    name,
    price,
    original_price,
    image_url,
    stock,
    on_sale,
    is_hot,
  } = product;

  const isSale = on_sale === 1 || Number(original_price) > Number(price);
  const isHot = is_hot === 1;

  return (
    <div className="p-card">
      <Link to={`/product/${product_id}`} className="p-thumb" title={name}>
        <img src={image_url} alt={name} />
        <div className="p-badges">
          {isSale && <span className="badge badge-sale">SALE</span>}
          {isHot && <span className="badge badge-hot">HOT</span>}
        </div>
      </Link>

      <div className="p-body">
        <h4 className="p-title">
          <Link to={`/product/${product_id}`}>{name}</Link>
        </h4>

        <div className="p-stock">คงเหลือ: {stock}</div>

        <div className="p-price">
          <span className="price">${Number(price).toFixed(2)}</span>
          {Number(original_price) > Number(price) && (
            <span className="ori">${Number(original_price).toFixed(2)}</span>
          )}
        </div>

        <button className="btn-primary" onClick={() => add(product_id, 1)}>
          เพิ่มลงตะกร้า
        </button>
      </div>
    </div>
  );
}
