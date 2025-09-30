import { Outlet } from "react-router-dom";
import Header from "./Header/Header";

const Layout = () => {
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Header />
      <main
        style={{
          flex: 1,
          maxWidth: "1200px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        <Outlet />
      </main>
      <footer
        style={{
          borderTop: "1px solid #ccc",
          padding: "1rem",
          textAlign: "center",
        }}
      >
        © 2025 Daniel's App
      </footer>
    </div>
  );
};

export default Layout;
