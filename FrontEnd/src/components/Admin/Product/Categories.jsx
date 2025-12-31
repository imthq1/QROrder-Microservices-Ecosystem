import React, { useEffect, useState } from "react";
import { getCategories } from "../../../services/menu/menuService";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Lỗi tải danh mục:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="admin-content">
      <div className="page-header">
        <h2>Categories Management</h2>
        <button className="btn-add">
          <FaPlus /> Add Category
        </button>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Order</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td>#{cat.id}</td>
                <td style={{ fontWeight: "bold" }}>{cat.name}</td>
                <td>{cat.description}</td>
                <td>{cat.displayOrder}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon edit">
                      <FaEdit /> Edit
                    </button>
                    <button className="btn-icon delete">
                      <FaTrash /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Categories;
