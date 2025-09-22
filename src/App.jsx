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
import DashboardPage from "./pages/DashboardPage";
import WalletPage from "./pages/WalletPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import CartDrawer from "./components/CartDrawer";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/receipt" element={<ReceiptPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
      <CartDrawer />
    </>
  );
}
