import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom"; // Thêm useNavigate
import {
  getProductsWith,
  getCategories,
} from "../../services/menu/menuService";
import { createTokenFromTable } from "../../services/table/tableService";
// Import service giỏ hàng
import { addToCart, getCart } from "../../services/cart/cartService";

import ClientHeader from "../../components/Client/ClientHeader";
import ClientSidebar from "../../components/Client/ClientSidebar";
import { FaPlus, FaStar, FaClock } from "react-icons/fa";
import "../../styles/client-header.css";
import "../../styles/menu-page.css";

const MenuPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate(); 

  // Data State
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  // UI State
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSessionReady, setIsSessionReady] = useState(false);

  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = getCart();
      const count = cart.reduce((total, item) => total + item.quantity, 0);
      setCartCount(count);
    };

    updateCartCount();

    window.addEventListener("storage", updateCartCount);

    // Cleanup khi thoát trang
    return () => window.removeEventListener("storage", updateCartCount);
  }, []);
  // ---------------------------------------------

  useEffect(() => {
    const initSession = async () => {
      const code = searchParams.get("table");
      if (code) {
        try {
          await createTokenFromTable(code);
          setIsSessionReady(true);
        } catch (err) {
          console.error("Lỗi vào bàn:", err);
        }
      } else {
        setIsSessionReady(true);
      }
    };
    initSession();
  }, []);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (e) {
        console.error("Lỗi danh mục:", e);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    if (!isSessionReady) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = { availableOnly: true };
        if (activeCategoryId) params.categoryId = activeCategoryId;
        if (searchTerm.trim() !== "") params.search = searchTerm.trim();

        const data = await getProductsWith(params);
        setProducts(data);
      } catch (e) {
        console.error("Lỗi sản phẩm:", e);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [activeCategoryId, searchTerm, isSessionReady]);

  const handleAddToCart = (item, e) => {
    e.stopPropagation();
    addToCart(item);
  };

  return (
    <div className="modern-menu-layout">
      <ClientHeader
        cartCount={cartCount}
        userName="Khách Hàng"
        searchTerm={searchTerm}
        userAddress={searchParams.get("table")}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        onCartClick={() => navigate("/cart")}
      />
      <div className="category-container-wrapper">
        <ClientSidebar
          categories={categories}
          activeCatId={activeCategoryId}
          onSelectCategory={setActiveCategoryId}
        />
      </div>

      <main className="product-section">
        <div className="section-title-row">
          <h3>
            {activeCategoryId
              ? categories.find((c) => c.id === activeCategoryId)?.name
              : "Món ngon phổ biến"}
          </h3>
          <span className="see-all">See All &gt;</span>
        </div>

        {loading ? (
          <div className="loading-spinner">Đang tải món ngon...</div>
        ) : (
          <div className="product-grid">
            {products.length > 0 ? (
              products.map((item) => (
                <div className="food-card" key={item.id}>
                  <div className="card-img-box">
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) =>
                        (e.target.src = "https://placehold.co/400x300")
                      }
                    />
                    <div className="price-tag">
                      {item.formattedPrice || item.price}
                    </div>
                  </div>
                  <div className="card-content">
                    <h4 className="food-name">{item.name}</h4>
                    <p className="food-desc">
                      {item.description || "Món ngon trứ danh..."}
                    </p>

                    <div className="card-footer">
                      <div className="rating-info">
                        <FaStar className="star-icon" />
                        <span>4.7</span>
                        <span className="dot">•</span>
                      </div>

                      <button
                        className="btn-add-mini"
                        onClick={(e) => handleAddToCart(item, e)}
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">Không tìm thấy món nào :(</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default MenuPage;
