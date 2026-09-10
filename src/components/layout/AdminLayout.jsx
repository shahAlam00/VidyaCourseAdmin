import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <Topbar collapsed={collapsed} />

      <main
        className={`
          pt-[72px]
          transition-all duration-300
          ${collapsed ? "ml-[80px]" : "ml-[260px]"}
        `}
      >
        <div className="min-h-[calc(100vh-72px)] p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;