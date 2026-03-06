import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaMinus, FaPlus, FaArrowLeft } from "react-icons/fa";
import {
  getCart,
  updateQuantity,
  updateNote,
  clearCart,
} from "../../services/cart/cartService";
import { createOrder } from "../../services/order/orderService";
import "../../styles/cart-page.css";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleQuantityChange = (id, delta) => {
    const newCart = updateQuantity(id, delta);
    setCartItems([...newCart]);
  };

  const handleNoteChange = (id, text) => {
    updateNote(id, text);
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, note: text } : item))
    );
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;

    setLoading(true);
    try {
      await createOrder(cartItems);
      alert("Đặt món thành công! Bếp đang chuẩn bị.");
      clearCart();
      setCartItems([]);
      navigate("/menu");
    } catch (error) {
      alert(`Lỗi: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart-container">
        <h3>Giỏ hàng trống</h3>
        <p>Bạn chưa chọn món nào cả :(</p>
        <button className="btn-back-menu" onClick={() => navigate(-1)}>
          Quay lại Menu
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <button onClick={() => navigate(-1)} className="btn-icon">
          <FaArrowLeft />
        </button>
        <h2>Giỏ hàng của bạn</h2>
        <span style={{ width: 24 }}></span>
      </div>

      {/* Danh sách món */}
      <div className="cart-list">
        {cartItems.map((item) => (
          <div className="cart-item" key={item.id}>
            <div className="item-main-info">
              <img
                src={item.image}
                alt={item.name}
                className="item-thumb"
                onError={(e) => (e.target.src = "https://placehold.co/100")}
              />
              <div className="item-details">
                <h4>{item.name}</h4>
                <p className="price">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(item.price)}
                </p>
              </div>

              {/* Bộ chỉnh số lượng */}
              <div className="quantity-control">
                <button onClick={() => handleQuantityChange(item.id, -1)}>
                  {item.quantity === 1 ? (
                    <FaTrash size={12} />
                  ) : (
                    <FaMinus size={12} />
                  )}
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item.id, 1)}>
                  <FaPlus size={12} />
                </button>
              </div>
            </div>

            {/* Phần ghi chú */}
            <div className="item-note">
              <input
                type="text"
                placeholder="Ghi chú (vd: ít ngọt, không hành...)"
                value={item.note}
                onChange={(e) => handleNoteChange(item.id, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer Thanh toán */}
      <div className="cart-footer">
        <div className="total-row">
          <span>Tổng cộng:</span>
          <span className="total-price">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(totalPrice)}
          </span>
        </div>
        <button
          className="btn-checkout"
          onClick={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? "Đang gửi..." : "Xác nhận gọi món"}
        </button>
      </div>
    </div>
  );
};

export default CartPage;
