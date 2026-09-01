import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./_components/AppSidebar";
import React from "react";
import WelcomeContainer from "./dashboard/_components/WelcomeContainer";

const DashboardProvider = ({ children }) => {
  return (
    <SidebarProvider className="bg-black text-zinc-100 min-h-screen">
      <AppSidebar />
      <div className="w-full min-h-screen bg-black">
        <div className="p-4 md:p-6 border-b border-zinc-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="text-zinc-400 hover:text-white" />
            <h1 className="text-sm font-semibold text-zinc-400">Recruiter Portal</h1>
          </div>
        </div>
        <main className="p-6 md:p-8">{children}</main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardProvider;
