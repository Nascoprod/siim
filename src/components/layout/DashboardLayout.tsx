import React from "react";
import { Outlet } from "react-router-dom";
import SidebarNav from "./SidebarNav";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <aside className="w-64 flex-shrink-0">
        <SidebarNav />
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;