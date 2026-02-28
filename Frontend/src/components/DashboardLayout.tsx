import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  Users,
  BarChart3,
  Calendar,
  Home,
  Megaphone,
  Shield,
  Building2,
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  role: "student" | "staff" | "admin";
}

const navItems = {
  student: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/student" },
    { icon: MessageSquare, label: "My Complaints", path: "/student/complaints" },
    { icon: Megaphone, label: "Announcement Board", path: "/student/board" },
    { icon: Settings, label: "Profile", path: "/student/profile" },
  ],
  staff: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/staff" },
    { icon: MessageSquare, label: "Tickets", path: "/staff/tickets" },
    { icon: Megaphone, label: "Announcements", path: "/staff/announcements" },
    { icon: Calendar, label: "Events", path: "/staff/events" },
    { icon: Settings, label: "Profile", path: "/staff/profile" },
  ],
  admin: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: MessageSquare, label: "All Complaints", path: "/admin/complaints" },
    { icon: Users, label: "Staff Management", path: "/admin/staff" },
    { icon: Megaphone, label: "Announcements", path: "/admin/announcements" },
    { icon: Shield, label: "Clubs & Communities", path: "/admin/clubs" },
    { icon: Building2, label: "Departments", path: "/admin/departments" },
    { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ],
};

const roleLabels = {
  student: "Student Portal",
  staff: "Staff Portal",
  admin: "Admin Portal",
};

const DashboardLayout = ({ children, role }: DashboardLayoutProps) => {
  const location = useLocation();
  const items = navItems[role];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col shrink-0">
        <div className="p-6 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <span className="font-display font-bold text-sidebar-primary-foreground text-sm">A</span>
            </div>
            <div>
              <p className="font-display font-bold text-sm">ASTU</p>
              <p className="text-xs text-sidebar-foreground/60">{roleLabels[role]}</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {items.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors w-full">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
