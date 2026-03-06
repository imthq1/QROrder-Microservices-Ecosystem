import React from "react";
import "../styles/order-management.css"; // Import CSS cũ hoặc file CSS riêng nếu bạn đã tách

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  const current = currentPage + 1; // UI hiển thị từ 1, data backend từ 0
  const total = totalPages || 1;

  // Helper: Thêm nút số trang
  const pushPage = (p) => {
    pages.push(
      <button
        key={p}
        className={`page-btn ${p === current ? "active" : ""}`}
        onClick={() => onPageChange(p - 1)} // Trả về index 0-based cho backend
      >
        {p}
      </button>
    );
  };

  // Helper: Thêm dấu ...
  const pushEllipsis = (key) => {
    pages.push(
      <span key={key} className="pagination-ellipsis">
        ...
      </span>
    );
  };

  // Logic tính toán hiển thị (giữ nguyên logic cũ)
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pushPage(i);
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pushPage(i);
      pushEllipsis("end");
      pushPage(total);
    } else if (current >= total - 3) {
      pushPage(1);
      pushEllipsis("start");
      for (let i = total - 4; i <= total; i++) pushPage(i);
    } else {
      pushPage(1);
      pushEllipsis("start");
      pushPage(current - 1);
      pushPage(current);
      pushPage(current + 1);
      pushEllipsis("end");
      pushPage(total);
    }
  }

  return (
    <div className="pagination-container">
      <button
        className="page-btn nav-btn"
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
      >
        &lt;
      </button>

      {pages}

      <button
        className="page-btn nav-btn"
        disabled={currentPage >= total - 1}
        onClick={() => onPageChange(currentPage + 1)}
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
