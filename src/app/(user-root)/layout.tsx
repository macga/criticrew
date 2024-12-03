import React from "react";
import { ThemeProvider } from "@/components/providers";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import AppHeader from "@/components/app-header";

export default function UserRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <div className="flex min-h-screen flex-col w-full">
          <AppHeader />
          <div className="flex w-full flex-1">
            <AppSidebar className="border-r pt-14" />
            <main className="flex-1 flex flex-col mt-14">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
