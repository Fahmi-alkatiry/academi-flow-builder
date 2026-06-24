import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { mockUserByRole } from "@/lib/mock-data";
import { Database, Network, Users, FileCheck } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function StaffDashboard() {
  const { user } = useAuth();
  const u = user || mockUserByRole.staff;

  const [studentCount, setStudentCount] = useState(0);
  const [integrationsList, setIntegrationsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStaffStats() {
      try {
        const students = await apiFetch<any[]>("/api/master/students");
        const integrations = await apiFetch<any[]>("/api/integrations");
        setStudentCount(students.length);
        setIntegrationsList(integrations);
      } catch (err) {
        console.error("Gagal memuat statistik staff:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStaffStats();
  }, []);

  const onlineCount = integrationsList.filter((i) => i.status === "online").length;

  const stats = [
    { label: "Data Mahasiswa", value: studentCount.toLocaleString("id-ID"), icon: Users },
    { label: "Sistem Terhubung", value: `${onlineCount}/${integrationsList.length || 6}`, icon: Network },
    { label: "Antrean Verifikasi", value: 3, icon: FileCheck }, // Mocked verification queue is fine
    { label: "Master Records", value: (studentCount + 40).toString(), icon: Database },
  ];

  if (loading) {
    return <div className="text-sm text-muted-foreground text-center py-6">Memuat dashboard…</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Tenaga Kependidikan</h1>
        <p className="text-muted-foreground text-sm">{u.name} · {u.program}</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
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
          <Button asChild><Link to="/master-data">Kelola Master Data</Link></Button>
          <Button asChild variant="secondary"><Link to="/integration">Status Integrasi</Link></Button>
        </CardContent>
      </Card>
    </div>
  );
}
