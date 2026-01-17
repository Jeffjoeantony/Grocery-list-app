import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Grocery from "../pages/Grocery";
import DashboardLayout from "../layouts/DashboardLayout";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />

      <Route element={<DashboardLayout />}>
        <Route path="/grocery" element={<Grocery />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
