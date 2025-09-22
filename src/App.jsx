// src/App.jsx
import { Routes, Route } from "react-router-dom";
import CartProvider from "./context/CartContext";
import AuthProvider from "./context/AuthContext";
import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import ReceiptPage from "./pages/ReceiptPage";
import SearchPage from "./pages/SearchPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AboutPage from "./pages/AboutPage";
import DashboardPage from "./pages/DashboardPage";
import CartDrawer from "./components/CartDrawer";   // ✅

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<ReceiptPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>

        {/* ✅ วางไว้ตรงนี้ ให้ปุ่มตะกร้าใน Navbar เรียกใช้งานได้ทุกหน้า */}
        <CartDrawer />
      </CartProvider>
    </AuthProvider>
  );
}
