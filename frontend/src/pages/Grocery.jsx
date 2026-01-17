import Header from "../components/Header";
import Navbar from "../components/Navbar";
import "../styles/grocery.css";

const Grocery = () => {
  return (
    <>
      <Header />
      <Navbar />

      <div className="grocery-page">
        <h2>🛒 Grocery Page Loaded</h2>
      </div>
    </>
  );
};

export default Grocery;
