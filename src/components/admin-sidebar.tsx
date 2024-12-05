"use client";

import * as React from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  navMain: [
    {
      title: "관리자 홈",
      url: "/admin",
      items: [
        {
          title: "기본 설정",
          url: "/admin",
        },
        {
          title: "서비스 통계",
          url: "/admin",
        },
      ],
    },
    {
      title: "사용자 정보",
      url: "/admin/users",
      items: [
        {
          title: "회원정보",
          url: "/admin/users",
        },
        {
          title: "Data Fetching",
          url: "/admin/users",
        },
        {
          title: "Rendering",
          url: "/admin/users",
        },
      ],
    },
    {
      title: "API 관리",
      url: "/admin",
      items: [
        {
          title: "기본 API 명세",
          url: "/admin",
        },
        {
          title: "영화 API 설정",
          url: "/admin/settings/tmdb",
        },
        {
          title: "Functions",
          url: "/admin",
        },
        {
          title: "next.config.js Options",
          url: "/admin",
        },
        {
          title: "CLI",
          url: "/admin",
        },
        {
          title: "Edge Runtime",
          url: "/admin",
        },
      ],
    },
    {
      title: "콘텐츠 관리",
      url: "/admin/movies",
      items: [
        {
          title: "영화 관리",
          url: "/admin/movies",
        },
        {
          title: "Fast Refresh",
          url: "/admin/movies",
        },
        {
          title: "Next.js Compiler",
          url: "/admin/movies",
        },
        {
          title: "Supported Browsers",
          url: "/admin/movies",
        },
        {
          title: "Turbopack",
          url: "/admin/movies",
        },
      ],
    },
    {
      title: "Community",
      url: "/admin",
      items: [
        {
          title: "Contribution Guide",
          url: "/admin",
        },
      ],
    },
  ],
};

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Criticrew Admin</span>
                  <span className="">v1.0.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link href={item.url} className="font-medium">
                    {item.title}
                  </Link>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={pathname === subItem.url}>
                          <Link href={subItem.url}>{subItem.title}</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
