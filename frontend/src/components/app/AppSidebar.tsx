import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Radar,
  Bug,
  Grid3X3,
  Store,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/app/dashboard" },
  { icon: Radar, label: "ASM", href: "/app/asm", badge: "Live" },
  { icon: Bug, label: "Vulnerability Scans", href: "/app/vs", badge: "Live" },
  { icon: Grid3X3, label: "Services", href: "/app/services" },
  { icon: Store, label: "Marketplace", href: "/app/marketplace" },
  { icon: FileText, label: "Reports", href: "/app/reports" },
  { icon: Settings, label: "Account", href: "/app/account" },
];

export function AppSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "h-screen bg-card border-r border-border flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        <Link to="/app/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-heading font-bold text-foreground">CyberSentinel</span>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="shrink-0"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className={cn("w-5 h-5 shrink-0", isActive && "text-primary-foreground")} />
              {!collapsed && (
                <>
                  <span className="font-medium flex-1">{item.label}</span>
                  {item.badge && (
                    <span className={cn(
                      "text-xs px-1.5 py-0.5 rounded-full",
                      isActive 
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-success/10 text-success"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <Link
          to="/"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="font-medium">Sign out</span>}
        </Link>
      </div>
    </aside>
  );
}
