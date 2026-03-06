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
import Dashboard from "./pages/admin/Dashboard";
import Products from "./components/Admin/Product/Products";
import Categories from "./components/Admin/Product/Categories";
import TablePage from "./pages/admin/TablePage";
import MenuPage from "./pages/client/MenuPage";
import CartPage from "./components/Client/CartPage";
import OrderPage from "./components/Admin/order/order";
import OrderManagement from "./components/Admin/order/OrderManagement";
import CalendarPage from "./pages/admin/CalendarPage";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/admin" element={<Layout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="categories" element={<Categories />} />
            <Route path="tables" element={<TablePage />} />
            <Route path="kitchens" element={<OrderPage />} />
            <Route path="calendars" element={<CalendarPage />} />
          </Route>

          {/* Route 404 */}
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
