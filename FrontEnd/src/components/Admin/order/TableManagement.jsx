import React, { useEffect, useState } from "react";
import { FaSyncAlt, FaUserFriends, FaUtensils } from "react-icons/fa";
import { getTables } from "../../../services/table/tableService";
import "../../../styles/table-management.css";
import TableOrderModal from "./TableOrderModal";
const TableManagement = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const fetchTableData = async () => {
    setLoading(true);
    try {
      const data = await getTables();
      const sortedData = data.sort((a, b) => a.id - b.id);
      setTables(sortedData);
    } catch (err) {
      console.error("Lỗi fetch tables:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleTableClick = (table) => {
    if (!table.isAvailable) {
      setSelectedTable(table);
      setIsModalOpen(true);
    }
  };
  useEffect(() => {
    fetchTableData();
  }, []);

  // Tính toán thống kê nhanh
  const totalTables = tables.length;
  const availableTables = tables.filter((t) => t.isAvailable).length;
  const occupiedTables = totalTables - availableTables;

  return (
    <div className="admin-content">
      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <h2>Sơ đồ Bàn</h2>
          <p className="subtitle">Quản lý tình trạng chỗ ngồi tại nhà hàng</p>
        </div>
        <button className="btn-refresh" onClick={fetchTableData}>
          <FaSyncAlt className={loading ? "spin" : ""} /> Làm mới
        </button>
      </div>

      {/* Main Container */}
      <div className="table-white-container">
        {/* Thanh chú thích (Legend) & Thống kê */}
        <div className="table-toolbar">
          <div className="table-stats">
            <span>
              Tổng số: <strong>{totalTables}</strong>
            </span>
            <span className="divider">|</span>
            <span className="text-green">
              Trống: <strong>{availableTables}</strong>
            </span>
            <span className="divider">|</span>
            <span className="text-blue">
              Đang phục vụ: <strong>{occupiedTables}</strong>
            </span>
          </div>

          <div className="table-legend">
            <div className="legend-item">
              <span className="color-box empty"></span> Trống
            </div>
            <div className="legend-item">
              <span className="color-box occupied"></span> Đang sử dụng
            </div>
          </div>
        </div>

        {/* Grid Sơ đồ bàn hiện đại */}
        <div className="table-grid">
          {loading ? (
            <div className="loading-state">Đang tải sơ đồ bàn...</div>
          ) : tables.length > 0 ? (
            tables.map((table) => (
              <div
                key={table.id}
                className={`modern-table-card ${table.isAvailable ? "is-empty" : "is-occupied"}`}
                onClick={() => handleTableClick(table)}
              >
                <div className="card-top">
                  <h3 className="table-title">{table.numberTable}</h3>
                  <span className="status-dot"></span>
                </div>

                <div className="card-middle">
                  <div className="info-row">
                    <FaUserFriends className="info-icon" />
                    <span>{table.capacity} chỗ ngồi</span>
                  </div>
                </div>

                <div className="card-bottom">
                  <div className="status-badge">
                    {table.isAvailable ? "Sẵn sàng" : "Đang phục vụ"}
                  </div>
                  {/* Nút thao tác nhanh (nếu cần) */}
                  {!table.isAvailable && (
                    <button className="btn-action-mini" title="Xem Order">
                      <FaUtensils />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">Chưa có dữ liệu bàn.</div>
          )}
        </div>
      </div>
      <TableOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tableInfo={selectedTable}
      />
    </div>
  );
};

export default TableManagement;
