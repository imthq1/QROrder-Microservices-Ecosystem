import React, { useEffect, useState } from "react";
import {
  getProducts,
  deleteProduct,
  updateProduct,
  createProduct,
} from "../../../services/menu/menuService";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import "../../../styles/dashboard.css";
import ProductModal from "./ProductModal";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_URL_CLOUDINARY;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddClick = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (formData) => {
    try {
      if (selectedProduct) {
        await updateProduct(formData.id, formData);
        alert("Cập nhật thành công!");
      } else {
        await createProduct(formData);
        alert("Thêm mới thành công!");
      }

      setIsModalOpen(false);
      fetchProductData();
    } catch (error) {
      alert("Lỗi: " + error);
    }
  };
  const fetchProductData = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      try {
        await deleteProduct(id);
        alert("Xóa thành công!");
        fetchProductData();
      } catch (err) {
        alert(typeof err === "string" ? err : "Có lỗi xảy ra khi xóa");
      }
    }
  };

  if (loading) return <div className="loading">Đang tải dữ liệu...</div>;
  if (error) return <div className="error-msg">Lỗi: {error}</div>;

  return (
    <div className="admin-content">
      <div className="page-header">
        <h2>Product Management</h2>
        <button className="btn-add" onClick={handleAddClick}>
          <FaPlus /> Add Product
        </button>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>Status</th>
              <th>Category</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {products.length > 0 ? (
              products.map((item) => (
                <tr key={item.id}>
                  <td>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="product-thumb"
                      onError={(e) => {
                        e.target.src = "https://picsum.photos/150";
                      }}
                    />
                  </td>
                  <td>
                    <div className="product-info">
                      <strong>{item.name}</strong>
                      <span className="product-desc">{item.description}</span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${
                        item.isAvailable ? "in-stock" : "out-stock"
                      }`}
                    >
                      {item.statusText}
                    </span>
                  </td>
                  <td>{item.categoryName}</td>
                  <td>{item.formattedPrice}</td>

                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon edit"
                        onClick={() => handleEditClick(item)}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        className="btn-icon delete"
                        onClick={() => handleDelete(item.id)}
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  Không có sản phẩm nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ProductModal
        isOpen={isModalOpen}
        product={selectedProduct}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
      />
    </div>
  );
};

export default Products;
