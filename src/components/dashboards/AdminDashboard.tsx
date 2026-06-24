import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { mockUserByRole } from "@/lib/mock-data";
import { Users, GraduationCap, Award, TrendingUp } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function AdminDashboard() {
  const { user } = useAuth();
  const u = user || mockUserByRole.admin;

  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminStats() {
      try {
        const statsData = await apiFetch<any>("/api/monitoring/stats");
        setStats(statsData);
      } catch (err) {
        console.error("Gagal memuat statistik admin:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminStats();
  }, []);

  const activeStudentsVal = stats ? stats.activeStudents : 0;
  const totalRegisteredVal = stats ? stats.totalRegistered : 0;
  const prodiCountVal = stats ? stats.prodiCount : 0;
  const accCriticalVal = stats ? stats.accCriticalCount : 0;

  const statItems = [
    { label: "Mahasiswa Aktif", value: activeStudentsVal.toLocaleString("id-ID"), icon: Users },
    { label: "Total Terdaftar", value: totalRegisteredVal.toLocaleString("id-ID"), icon: GraduationCap },
    { label: "Program Studi", value: prodiCountVal, icon: Award },
    { label: "Audit < 120 hari", value: accCriticalVal, icon: TrendingUp },
  ];

  if (loading) {
    return <div className="text-sm text-muted-foreground text-center py-6">Memuat dashboard…</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Pimpinan</h1>
        <p className="text-muted-foreground text-sm">{u.name} · {u.nim || u.username}</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-6">
              <s.icon className="size-5 text-primary" />
              <div className="mt-3 text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Aksi Cepat</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild><Link to="/monitoring">Buka Monitoring</Link></Button>
          <Button asChild variant="secondary"><Link to="/accreditation">Tracker Akreditasi</Link></Button>
          <Button asChild variant="secondary"><Link to="/integration">Status Integrasi</Link></Button>
        </CardContent>
      </Card>
    </div>
  );
}
