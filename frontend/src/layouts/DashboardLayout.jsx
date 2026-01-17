import Topbar from "../components/Topbar";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <>
      <Topbar />
      <Header/>
      <Navbar/>
      <Outlet />
    </>
  );
};

export default DashboardLayout;
