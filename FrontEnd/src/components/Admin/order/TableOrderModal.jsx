import React, { useEffect, useState } from "react";
import { FaTimes, FaTrashAlt, FaPlus, FaMinus } from "react-icons/fa";
import {
  getTableOrderDetails,
  updateOrderItemQuantity,
  deleteOrderItem,
} from "../../../services/order/orderService";
import "../../../styles/table-order-modal.css";

const TableOrderModal = ({ isOpen, onClose, tableInfo }) => {
  const [orderData, setOrderData] = useState(null);
  const [localItems, setLocalItems] = useState([]); // Chứa items đang thao tác
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasChanges, setHasChanges] = useState(false); // Xác định xem nút là Cập nhật hay Thanh toán

  useEffect(() => {
    if (isOpen && tableInfo?.id) {
      fetchOrderDetails(tableInfo.id);
    }
    // Reset state khi đóng modal
    if (!isOpen) {
      setHasChanges(false);
      setLocalItems([]);
    }
  }, [isOpen, tableInfo]);

  const fetchOrderDetails = async (tableId) => {
    setLoading(true);
    try {
      const data = await getTableOrderDetails(tableId);
      setOrderData(data);
      // Tạo bản sao items để thao tác local
      // Lưu lại quantity gốc (originalQuantity) để check xem có thay đổi hay không
      const clonedItems = (data.items || []).map((item) => ({
        ...item,
        originalQuantity: item.quantity,
      }));
      setLocalItems(clonedItems);
      setHasChanges(false);
    } catch (error) {
      console.error(error);
      alert("Không thể tải thông tin Order!");
    } finally {
      setLoading(false);
    }
  };

  // --- Xử lý thay đổi số lượng local ---
  const handleQuantityChange = (index, delta) => {
    const newItems = [...localItems];
    const newQuantity = newItems[index].quantity + delta;

    if (newQuantity < 1) return; // Không cho giảm dưới 1 bằng nút này

    newItems[index].quantity = newQuantity;
    // Tự động tính lại subTotal local để UI cập nhật ngay
    newItems[index].subTotal = newItems[index].price * newQuantity;

    setLocalItems(newItems);
    setHasChanges(true);
  };

  // --- Xử lý xóa món local ---
  const handleDeleteItem = (index) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa món này khỏi hóa đơn?")) {
      const newItems = [...localItems];
      // Đánh dấu là bị xóa (soft delete) thay vì xóa hẳn khỏi mảng
      // để lúc bấm Cập nhật biết đường gọi API Delete
      newItems[index].isDeleted = true;
      setLocalItems(newItems);
      setHasChanges(true);
    }
  };

  // --- Xử lý nút Hành động chính (Cập nhật hoặc Thanh toán) ---
  const handlePrimaryAction = async () => {
    if (hasChanges) {
      // HÀNH ĐỘNG CẬP NHẬT GỌI API
      setIsUpdating(true);
      try {
        // Duyệt qua localItems để xem cái nào cần cập nhật/xóa
        const updatePromises = localItems.map(async (item) => {
          if (item.isDeleted) {
            return deleteOrderItem(item.id);
          } else if (item.quantity !== item.originalQuantity) {
            return updateOrderItemQuantity(item.id, item.quantity);
          }
          return Promise.resolve();
        });

        await Promise.all(updatePromises);

        // Xong thì fetch lại data từ server để đồng bộ
        await fetchOrderDetails(tableInfo.id);
        alert("Cập nhật thành công!");
      } catch (error) {
        alert(error || "Lỗi trong quá trình cập nhật!");
      } finally {
        setIsUpdating(false);
      }
    } else {
      // HÀNH ĐỘNG THANH TOÁN
      alert(`Đang tiến hành thanh toán cho ${tableInfo.numberTable}...`);
    }
  };

  // Tính lại tổng tiền local
  const calculateLocalTotal = () => {
    return localItems
      .filter((i) => !i.isDeleted)
      .reduce((sum, item) => sum + item.subTotal, 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);
  };

  if (!isOpen) return null;

  const currentTotal = hasChanges
    ? calculateLocalTotal()
    : orderData?.totalAmount;
  // Lọc ra những món chưa bị xóa để hiển thị
  const displayItems = localItems.filter((item) => !item.isDeleted);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-receipt-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="receipt-header">
          <div className="receipt-title-box">
            <h3 className="receipt-icon">
              Chi tiết Order - {tableInfo?.numberTable}
            </h3>
          </div>
          <button className="btn-close-modal" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="receipt-body">
          {loading ? (
            <div className="loading-state">Đang tải hóa đơn...</div>
          ) : displayItems.length > 0 ? (
            <table className="receipt-table editable-table">
              <thead>
                <tr>
                  <th className="text-left" style={{ width: "40%" }}>
                    Tên món
                  </th>
                  <th className="text-center" style={{ width: "25%" }}>
                    Số lượng
                  </th>
                  <th className="text-right">Thành tiền</th>
                  <th className="text-center" style={{ width: "10%" }}></th>
                </tr>
              </thead>
              <tbody>
                {/* Dùng biến displayItems thay vì orderData.items */}
                {localItems.map((item, index) => {
                  if (item.isDeleted) return null;

                  return (
                    <tr key={item.id}>
                      <td className="text-left">
                        <span className="item-name">{item.productName}</span>
                        {item.note && (
                          <span className="item-note">Note: {item.note}</span>
                        )}
                      </td>
                      <td className="text-center">
                        {/* Khối tăng giảm số lượng */}
                        <div className="qty-control">
                          <button
                            className="qty-btn"
                            onClick={() => handleQuantityChange(index, -1)}
                            disabled={item.quantity <= 1}
                          >
                            <FaMinus />
                          </button>
                          <span className="qty-value">{item.quantity}</span>
                          <button
                            className="qty-btn"
                            onClick={() => handleQuantityChange(index, 1)}
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </td>
                      <td className="text-right fw-bold">
                        {formatPrice(item.subTotal)}
                      </td>
                      <td className="text-center">
                        {/* Nút xóa */}
                        <button
                          className="btn-delete-item"
                          onClick={() => handleDeleteItem(index)}
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">Bàn này chưa có món nào được gọi.</div>
          )}
        </div>

        <div className="receipt-footer">
          <div className="total-row">
            <span>Tổng cộng:</span>
            <span className="total-amount">{formatPrice(currentTotal)}</span>
          </div>
          <button
            // Đổi class để đổi màu nút nếu có thay đổi
            className={`btn-checkout-primary ${hasChanges ? "btn-update" : ""}`}
            onClick={handlePrimaryAction}
            disabled={
              loading ||
              isUpdating ||
              (displayItems.length === 0 && !hasChanges)
            }
          >
            {isUpdating
              ? "Đang xử lý..."
              : hasChanges
                ? "Cập nhật thay đổi"
                : "Thanh toán"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableOrderModal;
