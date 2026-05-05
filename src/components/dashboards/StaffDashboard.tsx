import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { mockUserByRole, masterMahasiswa, integrations } from "@/lib/mock-data";
import { Database, Network, Users, FileCheck } from "lucide-react";

export default function StaffDashboard() {
  const u = mockUserByRole.staff;
  const onlineCount = integrations.filter((i) => i.status === "online").length;

  const stats = [
    { label: "Data Mahasiswa", value: masterMahasiswa.length.toLocaleString("id-ID"), icon: Users },
    { label: "Sistem Terhubung", value: `${onlineCount}/${integrations.length}`, icon: Network },
    { label: "Antrean Verifikasi", value: 12, icon: FileCheck },
    { label: "Master Records", value: "1.2K", icon: Database },
  ];

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
