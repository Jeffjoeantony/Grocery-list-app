import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/sidebar.css";
import { Person2Outlined } from "@mui/icons-material";

const Sidebar = () => {
  const navigate = useNavigate();


  function handleLogout() {
    try {
      localStorage.removeItem("authToken");
    } catch (e) {
    }

    navigate("/login");
  }

  return (
    <aside className="sidebar" aria-label="Compact sidebar">
      <div className="sidebar-top">
        <NavLink to="/dashboard" className="logo-link" title="Dashboard home">
          <div className="logo">G</div>
        </NavLink>
      </div>

      <div className="sidebar-divider" />

      <nav className="sidebar-nav" aria-label="Primary">
        <ul>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => (isActive ? "icon-btn active" : "icon-btn")}
              title="Dashboard"
            >
              <span className="icon">🏠</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/products"
              className={({ isActive }) => (isActive ? "icon-btn active" : "icon-btn")}
              title="Products"
            >
              <span className="icon">🛒</span>
            </NavLink>
          </li>

          {/* Add more menu items here as needed */}
        </ul>
      </nav>

      {/* Bottom area - fixed to the bottom of the sidebar */}
      <div className="sidebar-bottom">
        <button
          type="button"
          className="icon-btn logout-btn"
          onClick={handleLogout}
          title="Sign out"
          aria-label="Sign out"
        >
          <span className="icon"><Person2Outlined/></span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;