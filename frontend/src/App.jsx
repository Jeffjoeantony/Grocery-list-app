import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Grocery from "./pages/Grocery";
// import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/grocery" element={<Grocery />} />
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}

export default App;
