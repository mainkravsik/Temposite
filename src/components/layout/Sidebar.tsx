import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  className?: string;
  isCollapsed?: boolean;
}

interface NavItem {
  title: string;
  icon: React.ReactNode;
  href: string;
}

const defaultNavItems: NavItem[] = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: "/admin",
  },
  {
    title: "Content",
    icon: <FileText className="h-5 w-5" />,
    href: "/admin/content",
  },
  {
    title: "Users",
    icon: <Users className="h-5 w-5" />,
    href: "/admin/users",
  },
  {
    title: "Settings",
    icon: <Settings className="h-5 w-5" />,
    href: "/admin/settings",
  },
];

const Sidebar = ({
  className = "",
  isCollapsed = false,
  items = defaultNavItems,
}: SidebarProps & { items?: NavItem[] }) => {
  return (
    <div
      className={cn(
        "flex flex-col bg-background border-r h-screen transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className,
      )}
    >
      {/* Logo/Brand */}
      <div className="h-16 flex items-center px-4 border-b">
        {!isCollapsed && (
          <span className="text-xl font-semibold">Admin Panel</span>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-2 space-y-1">
        {items.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted transition-colors",
              isCollapsed && "justify-center px-2",
            )}
          >
            {item.icon}
            {!isCollapsed && <span className="flex-1">{item.title}</span>}
            {!isCollapsed && <ChevronRight className="h-4 w-4 opacity-50" />}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="h-16 border-t p-4">
        {!isCollapsed && (
          <div className="text-sm text-muted-foreground">v1.0.0</div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
