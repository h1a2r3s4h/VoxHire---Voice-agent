import React from "react";
import DashboardProvider from "./provider";

const DashBoardLayout = ({ children }) => {
  return (
    <div className="bg-black min-h-screen text-zinc-100 font-sans">
      <DashboardProvider>
        <div className="p-6 md:p-10">{children}</div>
      </DashboardProvider>
    </div>
  );
};

export default DashBoardLayout;
