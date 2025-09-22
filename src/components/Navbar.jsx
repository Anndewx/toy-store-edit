import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: "#000" }}>
      <div className="container">
        <Link className="navbar-brand fw-bold text-warning" to="/">🛒 ToyStore</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><NavLink className="nav-link" to="/">Home</NavLink></li>

            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown">Shop</a>
              <ul className="dropdown-menu">
                <li><NavLink className="dropdown-item" to="/category/gundam">Gundam</NavLink></li>
                <li><NavLink className="dropdown-item" to="/category/anime">Anime</NavLink></li>
                <li><NavLink className="dropdown-item" to="/category/superhero">Superhero</NavLink></li>
                <li><NavLink className="dropdown-item" to="/category/game">Game</NavLink></li>
              </ul>
            </li>

            <li className="nav-item"><NavLink className="nav-link" to="/about">About</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/dashboard">Dashboard</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/wallet">Wallet</NavLink></li>
          </ul>

          <ul className="navbar-nav ms-auto align-items-center">
            {!user ? (
              <>
                <li className="nav-item"><NavLink className="nav-link" to="/login">Login</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/register">Register</NavLink></li>
              </>
            ) : (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle d-flex align-items-center" role="button" data-bs-toggle="dropdown">
                  <span style={{ fontSize: 22, marginRight: 8 }}>😺</span>
                  <span>{user.name}</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li className="dropdown-item-text"><strong>{user.name}</strong></li>
                  <li className="dropdown-item-text text-muted">{user.email}</li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><Link className="dropdown-item" to="/wallet">Wallet</Link></li>
                  <li><button className="dropdown-item text-danger" onClick={logout}>Logout</button></li>
                </ul>
              </li>
            )}

            <li className="nav-item">
              <button className="btn btn-warning text-dark ms-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#cartDrawer">
                Cart
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
