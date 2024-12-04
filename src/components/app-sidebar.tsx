"use client";

import * as React from "react";
import {
  Film,
  Tv,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  Popcorn,
} from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  getTokenFromLocalStorage,
  decodeToken,
  isTokenExpired,
} from "@/lib/auth";
import { getAvatarColor } from "@/lib/utils";

function getInitials(name: string | undefined | null) {
  if (!name) return "?";
  return name[0];
}

const data = {
  navMain: [
    {
      title: "영화",
      url: "#",
      icon: Popcorn,
      isActive: true,
      items: [
        {
          title: "박스오피스",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "TV프로그램",
      url: "#",
      icon: Tv,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "애니메이션",
      url: "#",
      icon: Film,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<
    | {
        name: string;
        email: string;
        avatar: string;
        color: string;
      }
    | undefined
  >();

  React.useEffect(() => {
    const token = getTokenFromLocalStorage();
    if (token && !isTokenExpired(token)) {
      const decoded = decodeToken(token);
      if (decoded) {
        setUser({
          name: decoded.nickname,
          email: decoded.email,
          avatar: getInitials(decoded.nickname),
          color: getAvatarColor(decoded.nickname),
        });
      }
    }
  }, []);

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
