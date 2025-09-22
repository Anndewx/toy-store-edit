export default function Footer(){
  return (
    <footer className="pt-5 pb-4 mt-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-6 col-lg-4">
            <h4 className="fw-900">Cuddle<span style={{color:'var(--red)'}}>Toys</span></h4>
            <p className="text-muted">โลกของเล่นที่จะทำให้ทุกวันเป็นวันที่แสนพิเศษ</p>
            <div className="d-flex gap-3">
              <a className="text-dark" href="#"><i className="fa-brands fa-facebook fa-lg"></i></a>
              <a className="text-dark" href="#"><i className="fa-brands fa-instagram fa-lg"></i></a>
              <a className="text-dark" href="#"><i className="fa-brands fa-tiktok fa-lg"></i></a>
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <h6 className="fw-900 mb-3">บริการลูกค้า</h6>
            <ul className="list-unstyled text-muted">
              <li className="mb-1"><a className="text-decoration-none text-muted" href="#">วิธีชำระเงิน</a></li>
              <li className="mb-1"><a className="text-decoration-none text-muted" href="#">การจัดส่ง</a></li>
              <li className="mb-1"><a className="text-decoration-none text-muted" href="#">นโยบายคืนสินค้า</a></li>
            </ul>
          </div>
          <div className="col-md-6 col-lg-4">
            <h6 className="fw-900 mb-3">ติดต่อ</h6>
            <p className="text-muted mb-1"><i className="fa-solid fa-location-dot me-2"></i>กรุงเทพฯ ประเทศไทย</p>
            <p className="text-muted mb-1"><i className="fa-solid fa-phone me-2"></i>02-123-4567</p>
            <p className="text-muted mb-0"><i className="fa-regular fa-envelope me-2"></i>support@cuddletoys.example</p>
          </div>
        </div>
        <div className="text-center text-muted mt-4">© 2025 CuddleToys. All rights reserved.</div>
      </div>
    </footer>
  );
}
