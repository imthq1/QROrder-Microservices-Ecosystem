import React from "react";

const ClientSidebar = ({ categories, activeCatId, onSelectCategory }) => {
  return (
    <div className="category-section">
      <div className="section-header">
        <h3 className="title">All Categories</h3>
        <button className="see-all-btn">See All &gt;</button>
      </div>

      <div className="category-horizontal-list">
        <div
          className={`cat-pill ${!activeCatId ? "active" : ""}`}
          onClick={() => onSelectCategory(null)}
        >
          <div className="cat-icon-circle">🔥</div>
          <span className="cat-name">All</span>
        </div>

        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`cat-pill ${activeCatId === cat.id ? "active" : ""}`}
            onClick={() => onSelectCategory(cat.id)}
          >
            <div className="cat-img-wrapper">
              <img
                src={cat.image || "https://placehold.co/50"}
                alt={cat.name}h
                className="cat-img"
                onError={(e) => (e.target.src = "https://placehold.co/50")}
              />
            </div>
            <span className="cat-name">{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientSidebar;
