// src/components/Navbar.jsx
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { count } = useCart();

  return (
    <nav className="navbar navbar-expand-lg navbar-light app-navbar">
      <div className="container">
        <Link className="navbar-brand" to="/">CuddleToys</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Home</NavLink>
            </li>

            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Shop
              </a>
              <ul className="dropdown-menu">
                <li><NavLink className="dropdown-item" to="/category/gundam">🤖 Gundam</NavLink></li>
                <li><NavLink className="dropdown-item" to="/category/anime">👩‍🎤 Anime</NavLink></li>
                <li><NavLink className="dropdown-item" to="/category/superhero">🦸 Superhero</NavLink></li>
                <li><NavLink className="dropdown-item" to="/category/game">🎮 Game</NavLink></li>
              </ul>
            </li>

            <li className="nav-item"><NavLink className="nav-link" to="/about">About</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/dashboard">Dashboard</NavLink></li>
          </ul>

          <form className="d-flex gap-2 search-wrap" role="search">
            <input className="form-control" placeholder="🔎 ค้นหาของเล่น..." />
            <button className="btn btn-outline-secondary" type="button">ค้นหา</button>
          </form>

          <div className="d-flex align-items-center gap-3 ms-3">
            <NavLink className="nav-link" to="/login">🔐 เข้าสู่ระบบ</NavLink>
            <NavLink className="nav-link" to="/register">✨ สมัครสมาชิก</NavLink>

            {/* ปุ่มเปิดตะกร้า */}
            <button className="btn btn-outline-dark position-relative" type="button" data-bs-toggle="offcanvas" data-bs-target="#cartDrawer">
              🛒 ตะกร้า
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {count}
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
