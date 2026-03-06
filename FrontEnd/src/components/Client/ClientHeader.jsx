import React from "react";
import {
  FaBars,
  FaShoppingBag,
  FaSearch,
  FaMapMarkerAlt,
  FaChevronDown,
} from "react-icons/fa";

const ClientHeader = ({
  cartCount = 0,
  userName = "Khách",
  searchTerm,
  onSearchChange,
  onMenuToggle,
  userAddress = "Vui lòng chọn bàn",
  onCartClick, // 1. Nhận prop onCartClick từ cha
}) => {
  return (
    <div className="client-header-container">
      <div className="top-bar">
        <button className="icon-btn menu-btn" onClick={onMenuToggle}>
          <FaBars />
        </button>

        <div className="address-section">
          <span className="label-deliver">Bàn số / Địa chỉ</span>
          <div className="address-value">
            <span className="text">{userAddress}</span>
            <FaChevronDown className="arrow-icon" />
          </div>
        </div>

        <button className="icon-btn cart-btn" onClick={onCartClick}>
          <FaShoppingBag />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
      </div>

      <div className="greeting-section">
        <span className="greeting-text">
          Xin chào {userName}, <strong>Chúc ngon miệng!</strong>
        </span>
      </div>
      <div className="search-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Tìm món ăn..."
            className="search-input"
            value={searchTerm}
            onChange={onSearchChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientHeader;
