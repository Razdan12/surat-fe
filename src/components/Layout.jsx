import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbars";

const Layout = () => {
  return (
    <div className="flex h-full bg-base-200">
      <div className="flex-shrink-0 h-full z-50">
        <Sidebar />
      </div>
      <div className="flex flex-col w-full h-full">
        <div className="flex">
          <Navbar/>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Outlet />
          
        </div>
      </div>
    </div>
  );
};

export default Layout;
