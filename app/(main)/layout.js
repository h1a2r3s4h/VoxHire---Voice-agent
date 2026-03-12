import React from "react";
import DashboardProvider from "./provider";

const DashBoardLayout = ({ children }) => {
  return (
    <div className="bg-secondary">
      <DashboardProvider>
        <div className="p-10">{children}</div>
      </DashboardProvider>
    </div>
  );
};

export default DashBoardLayout;
