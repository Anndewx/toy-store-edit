// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./styles/app.css";

import ErrorBoundary from "./components/ErrorBoundary.jsx";

// 👉 ถ้ามี CartContext อยู่แล้ว ให้ใช้แบบนี้
let CartProvider;
try {
  // พยายาม import ถ้ามีไฟล์อยู่จะใช้จริง ถ้าไม่มีจะตกไป catch
  CartProvider = require("./context/CartContext.jsx").CartProvider;
} catch {
  // ถ้ายังไม่มีไฟล์ CartContext ให้ทำ Provider เปล่า ๆ เพื่อไม่ให้แอปพัง
  CartProvider = ({ children }) => children;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <CartProvider>
          <App />
        </CartProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);
