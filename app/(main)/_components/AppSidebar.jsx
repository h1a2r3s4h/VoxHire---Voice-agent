"use client";
import React from "react";
import Link from "next/link";
import { Mic, Plus } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import { SideBarOptions } from "@/services/Constants";
import { usePathname } from "next/navigation";

export function AppSidebar() {
  const path = usePathname();
  console.log(path);
  return (
    <Sidebar>
      {/* Header */}
      <SidebarHeader className="px-3 py-4">
  <div className="flex items-center gap-2">
    <Mic className="h-7 w-7 text-blue-600" />

    <h1 className="text-2xl font-extrabold tracking-tight">
      <span className="text-blue-500">Vox</span>
      <span className="text-foreground">Hire</span>
    </h1>

  </div>

        
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {SideBarOptions.map((option, index) => {
              const isActive = path === option.path;
              return (
                <SidebarMenuItem key={index} className="p-1">
                  <SidebarMenuButton
                    asChild
                    className={`p-5 cursor-pointer transition-all duration-200 ${
                      isActive 
                        ? "bg-gradient-to-r from-blue-600/20 to-transparent border-r-2 border-blue-500 text-blue-400" 
                        : "hover:bg-white/5"
                    }`}
                  >
                    <Link href={option.path} className="flex items-center gap-3">
                      <option.icon
                        className={`h-5 w-5 ${isActive ? "text-blue-400" : "text-muted-foreground"}`}
                      />
                      <span
                        className={`text-[15px] font-medium ${
                          isActive ? "text-blue-400" : "text-muted-foreground"
                        }`}
                      >
                        {option.name}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter />
    </Sidebar>
  );
}

export default AppSidebar;
