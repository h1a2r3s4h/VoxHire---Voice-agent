"use client";
import React from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

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

import { SideBarOptions } from "@/services/Constants";
import { usePathname } from "next/navigation";

export function AppSidebar() {
  const path = usePathname();

  return (
    <Sidebar className="border-r border-zinc-800 bg-black text-zinc-100">
      {/* Header */}
      <SidebarHeader className="px-5 py-5 border-b border-zinc-900">
        <Logo size="md" href="/dashboard" />
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarMenu className="space-y-1">
            {SideBarOptions.map((option, index) => {
              const isActive = path === option.path;
              return (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    asChild
                    className={`px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                      isActive
                        ? "bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-semibold shadow-sm"
                        : "text-zinc-400 hover:bg-zinc-900/60 hover:text-white"
                    }`}
                  >
                    <Link href={option.path} className="flex items-center gap-3">
                      <option.icon
                        className={`h-4 w-4 ${isActive ? "text-indigo-400" : "text-zinc-400"}`}
                      />
                      <span className="text-sm font-medium">
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
