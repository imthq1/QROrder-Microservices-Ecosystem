import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaThLarge,
  FaClipboardList,
  FaHamburger,
  FaUser,
  FaBell,
  FaPaperPlane,
  FaCog,
  FaOpencart,
} from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <FaOpencart className="logo-icon" />
      </div>

      <ul className="menu">
        <li className={isActive("/admin/dashboard")}>
          <Link to="/admin/dashboard">
            <FaThLarge />
          </Link>
        </li>

        <li className={isActive("/admin/categories")}>
          <Link to="/admin/categories">
            <FaClipboardList />
          </Link>
        </li>

        <li className={isActive("/admin/products")}>
          <Link to="/admin/products">
            <FaHamburger />
          </Link>
        </li>

        <li className="disabled">
          <FaBell />
        </li>

        <li className={isActive("/admin/users")}>
          <Link to="/admin/users">
            <FaUser />
          </Link>
        </li>

        <li className="disabled">
          <FaPaperPlane />
        </li>
      </ul>

      {/* Settings ở dưới cùng */}
      <div className="sidebar-footer">
        <Link to="/admin/settings" className={isActive("/admin/settings")}>
          <FaCog />
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
