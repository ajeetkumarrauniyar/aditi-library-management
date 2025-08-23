"use client";

import * as React from "react";
import {
  BookOpen,
  Command,
  LifeBuoy,
  Settings2,
  SquareTerminal,
  Users,
  Building2,
  Shield,
  Database,
  BarChart3,
  FileText,
  Activity,
} from "lucide-react";

import { NavMain } from "@/components/dashboard/nav-main";
import { NavProjects } from "@/components/dashboard/nav-projects";
import { NavSecondary } from "@/components/dashboard/nav-secondary";
import { NavUser } from "@/components/dashboard/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Super Admin",
    email: "admin@library.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        },
        {
          title: "Analytics",
          url: "/dashboard/analytics",
        },
        {
          title: "Reports",
          url: "/dashboard/reports",
        },
      ],
    },
    {
      title: "Organizations",
      url: "/dashboard/organizations",
      icon: Building2,
      items: [
        {
          title: "All Organizations",
          url: "/dashboard/organizations",
        },
        {
          title: "Create Organization",
          url: "/dashboard/organizations/create",
        },
        {
          title: "Organization Settings",
          url: "/dashboard/organizations/settings",
        },
      ],
    },
    {
      title: "User Management",
      url: "/dashboard/users",
      icon: Users,
      items: [
        {
          title: "All Users",
          url: "/dashboard/users",
        },
        {
          title: "Roles & Permissions",
          url: "/dashboard/users/roles",
        },
        {
          title: "User Activity",
          url: "/dashboard/users/activity",
        },
      ],
    },
    {
      title: "Library Management",
      url: "/dashboard/library",
      icon: BookOpen,
      items: [
        {
          title: "Books",
          url: "/dashboard/library/books",
        },
        {
          title: "Categories",
          url: "/dashboard/library/categories",
        },
        {
          title: "Borrowing",
          url: "/dashboard/library/borrowing",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "System Settings",
      url: "/dashboard/settings",
      icon: Settings2,
    },
    {
      title: "Security",
      url: "/dashboard/security",
      icon: Shield,
    },
    {
      title: "Database",
      url: "/dashboard/database",
      icon: Database,
    },
    {
      title: "Support",
      url: "/dashboard/support",
      icon: LifeBuoy,
    },
  ],
  projects: [
    {
      name: "System Health",
      url: "/dashboard/health",
      icon: Activity,
    },
    {
      name: "Global Analytics",
      url: "/dashboard/global-analytics",
      icon: BarChart3,
    },
    {
      name: "Audit Logs",
      url: "/dashboard/audit",
      icon: FileText,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Library System</span>
                  <span className="truncate text-xs">Super Admin</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
