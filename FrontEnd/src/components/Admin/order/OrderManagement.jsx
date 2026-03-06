import React, { useEffect, useState } from "react";
import {
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaShoppingBag,
  FaCalendarAlt,
} from "react-icons/fa";
import {
  getOrders,
  getDashboardSummary,
} from "../../../services/order/orderService";
import "../../../styles/order-management.css";
import Pagination from "../../Pagination";

const OrderManagement = () => {
  // State dữ liệu
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState({
    cancelled: 0,
    completed: 0,
    onProcess: 0,
    totalOrders: 0,
  });
  const [timeFilter, setTimeFilter] = useState("ALL_TIME");

  const TIME_FILTERS = [
    { value: "ALL_TIME", label: "Tất cả thời gian" },
    { value: "TODAY", label: "Hôm nay" },
    { value: "THIS_WEEK", label: "Tuần này" },
    { value: "THIS_MONTH", label: "Tháng này" },
    { value: "THIS_YEAR", label: "Năm nay" },
  ];
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const fetchSummary = async () => {
    try {
      const response = await getDashboardSummary();
      console.log("Summary Response:", response);

      if (response && response.data) {
        setSummary(response.data);
      }
    } catch (error) {
      console.error("Lỗi tải thống kê:", error);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {
        page: page,
        size: 10,
        sortBy: "createdAt",
        direction: "desc",
        timeFilter: timeFilter,
      };

      if (selectedStatus !== "ALL") {
        params.status = selectedStatus;
      }

      const response = await getOrders(params);

      if (response && response.data) {
        setOrders(response.data.data || []);
        setTotalPages(response.data.totalPages || 0);
      }
    } catch (error) {
      console.error("Lỗi fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeFilterChange = (e) => {
    setTimeFilter(e.target.value);
    setPage(0);
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [page, selectedStatus, timeFilter]);

  const handleTabChange = (status) => {
    setSelectedStatus(status);
    setPage(0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const config = {
      PENDING: { label: "Chờ xác nhận", className: "status-pending" },
      ORDERED: { label: "Đang phục vụ", className: "status-ordered" },
      COMPLETED: { label: "Hoàn thành", className: "status-completed" },
      CANCELLED: { label: "Đã hủy", className: "status-cancelled" },
    };

    const { label, className } = config[status] || {
      label: status,
      className: "status-default",
    };

    return <span className={`status-badge ${className}`}>{label}</span>;
  };
  return (
    <div className="admin-content">
      {/*  Header Tiêu đề */}
      <div className="page-header-title">
        <h2>Quản lý đơn hàng</h2>
        <span className="current-date">
          {new Date().toLocaleDateString("vi-VN")}
        </span>
      </div>

      <div className="summary-cards">
        <div className="card summary-item">
          <div className="icon-box bg-blue">
            <FaShoppingBag />
          </div>
          <div className="card-info">
            <h3>{summary.totalOrders || 0}</h3>
            <p>Tổng đơn</p>
          </div>
        </div>
        <div className="card summary-item">
          <div className="icon-box bg-orange">
            <FaClock />
          </div>
          <div className="card-info">
            <h3>{summary.onProcess || 0}</h3>
            <p>Đang xử lý</p>
          </div>
        </div>
        <div className="card summary-item">
          <div className="icon-box bg-green">
            <FaCheckCircle />
          </div>
          <div className="card-info">
            <h3>{summary.completed || 0}</h3>
            <p>Hoàn thành</p>
          </div>
        </div>
        <div className="card summary-item">
          <div className="icon-box bg-red">
            <FaTimesCircle />
          </div>
          <div className="card-info">
            <h3>{summary.cancelled || 0}</h3>
            <p>Đã hủy</p>
          </div>
        </div>
      </div>

      <div className="white-container">
        {/* Tabs Status */}
        <div className="table-controls">
          <div className="status-tabs">
            {["ALL", "PENDING", "ORDERED", "COMPLETED", "CANCELLED"].map(
              (status) => (
                <button
                  key={status}
                  className={`tab-btn ${
                    selectedStatus === status ? "active" : ""
                  }`}
                  onClick={() => handleTabChange(status)}
                >
                  {status === "ALL" ? "Tất cả" : status}
                </button>
              )
            )}
          </div>
          <div className="filter-box">
            <FaCalendarAlt className="filter-icon" />
            <select
              className="time-select"
              value={timeFilter}
              onChange={handleTimeFilterChange}
            >
              {TIME_FILTERS.map((tf) => (
                <option key={tf.value} value={tf.value}>
                  {tf.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Thời gian</th>
                <th>Bàn số</th>
                <th>SL</th>
                <th>Tổng tiền</th>

                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.orderId || order.id}>
                    <td className="fw-bold">ORD{order.orderId || order.id}</td>
                    <td>
                      {new Date(order.createdAt).toLocaleString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td>Bàn {order.tableId || "?"}</td>
                    <td> {order.quantity || "?"}</td>
                    <td className="text-price">
                      {formatCurrency(order.amount || order.totalAmount)}
                    </td>

                    <td className="">{getStatusBadge(order.status)}</td>
                    <td>
                      <button className="btn-icon" title="Xem chi tiết">
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    Không có đơn hàng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination-footer">
          <div className="showing-text">
            {/* Logic hiển thị text đếm kết quả */}
            Hiển thị {orders.length} / {summary.totalOrders || 0} kết quả
          </div>

          {/* GỌI COMPONENT PAGINATION */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
