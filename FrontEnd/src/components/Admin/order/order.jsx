import React, { useEffect, useState, useRef } from "react";
import { FaSearch, FaSyncAlt, FaClock } from "react-icons/fa";
import {
  getKitchenOrders,
  updateOrderStatus,
} from "../../../services/kitcheen/kitchenService";
import {
  connectToKitchenSocket,
  disconnectSocket,
} from "../../../services/websocket/socketService";
import "../../../styles/kitchen-order.css";

import notificationSound from "../../../assets/bell-notification-337658.mp3";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const audioRef = useRef(new Audio(notificationSound));

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getKitchenOrders();
      const sortedData = data.data.sort((a, b) => a.id - b.id);
      setOrders(sortedData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý cập nhật status
  const handleUpdateStatus = async (orderId, status) => {
    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatus(orderId, status);

      // Cập nhật lại danh sách sau khi update thành công
      // Có 2 cách:
      // Cách 1: Xóa order khỏi danh sách (vì đã DONE hoặc CANCELLED)
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== orderId),
      );

      // Cách 2: Fetch lại toàn bộ (nếu muốn đồng bộ với server)
      // await fetchOrders();
    } catch (error) {
      console.error("Lỗi cập nhật status:", error);
      alert(error || "Không thể cập nhật trạng thái order");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  useEffect(() => {
    fetchOrders();

    connectToKitchenSocket((newOrder) => {
      audioRef.current
        .play()
        .catch((e) => console.log("Chrome chặn autoplay:", e));

      setOrders((prevOrders) => {
        const exists = prevOrders.some(
          (o) => o.id === newOrder.kitchenOrderId || o.id === newOrder.id,
        );
        if (exists) return prevOrders;

        return [...prevOrders, newOrder];
      });
    });

    return () => {
      disconnectSocket();
    };
  }, []);

  // Filter local
  const filteredOrders = orders.filter(
    (order) =>
      order.tableId?.toString().includes(searchTerm) ||
      order.id?.toString().includes(searchTerm),
  );

  return (
    <div className="admin-content">
      <div className="page-header">
        <div className="header-left">
          <h2>Kitchen Monitor (Realtime)</h2>
          <p className="subtitle">Quản lý chế biến món ăn</p>
        </div>
        <button className="btn-refresh" onClick={fetchOrders}>
          <FaSyncAlt className={loading ? "spin" : ""} /> Sync
        </button>
      </div>

      <div className="search-section"></div>

      <div className="order-grid">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div className="order-card" key={order.id || order.kitchenOrderId}>
              <div className="card-header">
                <div className="table-badge">Bàn {order.tableId}</div>
                <div className="order-meta">
                  <span className="order-id">
                    #{order.id || order.kitchenOrderId}
                  </span>
                  <span className="order-time">
                    <FaClock style={{ marginRight: 4 }} />
                    {new Date(order.createdAt).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              <div className="card-body">
                {order.items.map((item) => (
                  <div className="order-item" key={item.id}>
                    <div className="item-info">
                      <div className="item-main">
                        <span className="qty">x{item.quantity}</span>
                        <span className="name">{item.menuItemName}</span>
                      </div>
                      {item.note && (
                        <div className="item-note">Note: {item.note}</div>
                      )}
                    </div>
                    <span className="status-badge cooking">
                      {item.status || "COOKING"}
                    </span>
                  </div>
                ))}
              </div>

              <div className="card-footer">
                <button
                  className="btn-action btn-reject"
                  onClick={() => handleUpdateStatus(order.id, "CANCELLED")}
                  disabled={updatingOrderId === order.id}
                >
                  {updatingOrderId === order.id ? "Đang xử lý..." : "Hủy"}
                </button>
                <button
                  className="btn-action btn-done"
                  onClick={() => handleUpdateStatus(order.id, "DONE")}
                  disabled={updatingOrderId === order.id}
                >
                  {updatingOrderId === order.id ? "Đang xử lý..." : "Xong"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">Bếp đang rảnh...</div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
