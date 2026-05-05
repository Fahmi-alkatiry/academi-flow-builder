import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import StudentDashboard from "@/components/dashboards/StudentDashboard";
import LecturerDashboard from "@/components/dashboards/LecturerDashboard";
import AdminDashboard from "@/components/dashboards/AdminDashboard";
import StaffDashboard from "@/components/dashboards/StaffDashboard";

export const Route = createFileRoute("/_app/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { role } = useAuth();
  if (role === "student") return <StudentDashboard />;
  if (role === "lecturer") return <LecturerDashboard />;
  if (role === "admin") return <AdminDashboard />;
  if (role === "staff") return <StaffDashboard />;
  return null;
}
