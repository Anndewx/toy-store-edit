import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CheckoutPage from "./pages/CheckoutPage";
import ReceiptPage from "./pages/ReceiptPage";
import SearchPage from "./pages/SearchPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AboutPage from "./pages/AboutPage";
import WalletPage from "./pages/WalletPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import CartDrawer from "./components/CartDrawer";
import Checkout from "./pages/Checkout";
import AnalyticsDashboard from "./pages/AnalyticsDashboard.jsx";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      {/* Navbar จะมีปุ่ม Profile + Cart */}
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        {/* ✅ ใช้ /category/:slug สำหรับ Shop */}
        <Route path="/category/:slug" element={<CategoryPage />} />
        {/* ✅ route รายละเอียดสินค้า */}
        <Route path="/product/:id" element={<ProductDetailPage />} />

        {/* Checkout */}
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/receipt" element={<ReceiptPage />} />
        <Route path="/checkout-test" element={<Checkout />} />

        {/* Wallet / Orders */}
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Misc */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/dashboard" element={<AnalyticsDashboard />} />
      </Routes>

      {/* Drawer สำหรับ Cart */}
      <CartDrawer />
    
{/* Footer */}
      <Footer />
    </>
  );
}

