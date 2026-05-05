import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  GraduationCap, LayoutDashboard, BookOpen, CalendarDays, FileText,
  Users, ClipboardList, UserCheck, BarChart3, Award, Network, Database,
  LogOut, Menu, X,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { mockUserByRole, roleLabel, type Role } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

type NavItem = { to: string; label: string; icon: React.ComponentType<{ className?: string }> };

const navByRole: Record<Role, NavItem[]> = {
  student: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/krs", label: "KRS", icon: BookOpen },
    { to: "/schedule", label: "Jadwal Kuliah", icon: CalendarDays },
    { to: "/grades", label: "Nilai & Transkrip", icon: FileText },
  ],
  lecturer: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/teaching", label: "Kelas Diampu", icon: Users },
    { to: "/grade-input", label: "Input Nilai", icon: ClipboardList },
    { to: "/advisees", label: "Mahasiswa Perwalian", icon: UserCheck },
  ],
  admin: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/monitoring", label: "Monitoring", icon: BarChart3 },
    { to: "/accreditation", label: "Akreditasi", icon: Award },
    { to: "/integration", label: "Integrasi Sistem", icon: Network },
  ],
  staff: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/master-data", label: "Master Data", icon: Database },
    { to: "/integration", label: "Integrasi Sistem", icon: Network },
  ],
};

function AppLayout() {
  const { role, ready, logout } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (ready && !role) navigate({ to: "/login" });
  }, [ready, role, navigate]);

  useEffect(() => { setOpen(false); }, [path]);

  if (!ready || !role) {
    return <div className="min-h-screen grid place-items-center text-muted-foreground">Memuat…</div>;
  }

  const items = navByRole[role];
  const user = mockUserByRole[role];

  const SidebarBody = (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
        <div className="size-9 rounded-lg bg-sidebar-primary grid place-items-center">
          <GraduationCap className="size-5 text-sidebar-primary-foreground" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">SIAT</p>
          <p className="text-[11px] text-sidebar-foreground/70 truncate">Universitas Madura</p>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {items.map((item) => {
          const active = path === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/85 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon className="size-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-4">
        <div className="text-xs text-sidebar-foreground/70 mb-1">Masuk sebagai</div>
        <div className="text-sm font-medium truncate">{user.name}</div>
        <div className="text-[11px] text-sidebar-foreground/70 truncate">{user.nim}</div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => { logout(); navigate({ to: "/login" }); }}
          className="mt-3 w-full justify-start text-sidebar-foreground/85 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut className="size-4 mr-2" /> Keluar
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex w-full bg-background">
      <aside className="hidden lg:flex w-64 shrink-0 border-r border-sidebar-border">{SidebarBody}</aside>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative w-72 max-w-[80%] h-full">{SidebarBody}</div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 flex items-center gap-3 px-4 lg:px-6 border-b bg-card">
          <button className="lg:hidden p-2 -ml-2" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground truncate">{user.program}</p>
          </div>
          <Badge variant="secondary" className="hidden sm:inline-flex">{roleLabel[role]}</Badge>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
