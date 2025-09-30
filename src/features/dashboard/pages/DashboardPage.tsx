import React from "react";
import { Outlet } from "react-router-dom";

const DashboardPage: React.FC = () => (
  <div style={{ padding: "1rem 0" }}>
    <Outlet />
  </div>
);

export default DashboardPage;
