import React from "react";
// 1. Thêm Navigate vào đây
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Components
import Login from "./components/Auth/Login";

// 2. Sửa đường dẫn Layout theo đúng ảnh: src/components/Admin/layout/Layout.jsx
import Layout from "./components/Admin/layout/Layout";

// Pages & Admin Components
import Dashboard from "./pages/admin/Dashboard"; // Chỉ giữ 1 dòng này
import Products from "./components/Admin/Product/Products";
import Categories from "./components/Admin/Product/Categories";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Route Login - Không có Layout */}
          <Route path="/" element={<Login />} />

          {/* Route Admin - Dùng Layout chung */}
          <Route path="/admin" element={<Layout />}>
            {/* Vào /admin tự động chuyển sang dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />

            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="categories" element={<Categories />} />
          </Route>

          {/* Route 404 */}
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
