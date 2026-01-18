import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

// Minimal dashboard layout: compact sidebar + main content area.
// No Topbar/Header/Navbar are rendered here — that keeps the page simple.
const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;