import React, { useState, useEffect } from "react";
import { getCategories } from "../../../services/menu/menuService";
import { uploadImage } from "../../../services/upload/uploadService";
import "../../../styles/dashboard.css";
import { FaCloudUploadAlt } from "react-icons/fa";

const ProductModal = ({ product, isOpen, onClose, onSave }) => {
  const initialFormState = {
    id: "",
    name: "",
    description: "",
    price: "",
    thumbnailUrl: "",
    categoryId: "",
    isAvailable: true,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [categories, setCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const isEditMode = !!product;

  useEffect(() => {
    if (isOpen) {
      const fetchCats = async () => {
        try {
          const catData = await getCategories();
          setCategories(catData);
        } catch (e) {
          console.error(e);
        }
      };
      fetchCats();

      if (isEditMode) {
        setFormData({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          thumbnailUrl: product.thumbnailUrl || "",
          categoryId: product.categoryId,
          isAvailable: product.isAvailable,
        });

        const CLOUDINARY_BASE = import.meta.env.VITE_URL_CLOUDINARY || "";
        let imgDisplay = product.thumbnailUrl;
        if (imgDisplay && !imgDisplay.startsWith("http")) {
          imgDisplay = CLOUDINARY_BASE + imgDisplay;
        }
        setPreviewUrl(imgDisplay || "https://placehold.co/150");
      } else {
        // --- CHẾ ĐỘ ADD: Reset form về rỗng ---
        setFormData(initialFormState);
        setPreviewUrl("https://placehold.co/150");
      }

      setSelectedFile(null);
    }
  }, [isOpen, product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let finalImageUrl = formData.thumbnailUrl;

      // Logic Upload: Nếu có chọn file mới thì up, không thì giữ nguyên
      if (selectedFile) {
        const uploadedUrl = await uploadImage(selectedFile);
        finalImageUrl = uploadedUrl;
      }

      const dataToSave = {
        ...formData,
        thumbnailUrl: finalImageUrl,
      };

      await onSave(dataToSave);
    } catch (error) {
      alert("Lỗi: " + error);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          {/* Tiêu đề động */}
          <h3>
            {isEditMode ? `Edit Product #${formData.id}` : "Add New Product"}
          </h3>
          <button onClick={onClose} className="btn-close">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div style={{ flex: 2 }}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>Price</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group half">
                  <label>Category</label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div style={{ flex: 1, marginLeft: "20px", textAlign: "center" }}>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "10px",
                }}
              >
                Image
              </label>
              <div className="image-preview-box">
                <img
                  src={previewUrl}
                  alt="Preview"
                  onError={(e) => (e.target.src = "https://placehold.co/150")}
                />
              </div>
              <label htmlFor="file-upload" className="custom-file-upload">
                <FaCloudUploadAlt /> Choose File
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              {selectedFile && (
                <div style={{ fontSize: "11px", marginTop: "5px" }}>
                  {selectedFile.name}
                </div>
              )}
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
              />
              Is Available
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={isUploading}>
              {isUploading
                ? "Processing..."
                : isEditMode
                ? "Save Changes"
                : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
