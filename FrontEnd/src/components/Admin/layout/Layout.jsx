import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "../../../styles/layout.css";

const Layout = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        {/* <Header /> */}
        <div className="content-body">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
