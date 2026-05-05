import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { mockUserByRole, studentStatus, accreditation } from "@/lib/mock-data";
import { Users, GraduationCap, Award, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const u = mockUserByRole.admin;
  const total = studentStatus.reduce((s, x) => s + x.value, 0);
  const accCritical = accreditation.filter((a) => a.daysToAudit < 120).length;

  const stats = [
    { label: "Mahasiswa Aktif", value: studentStatus[0].value.toLocaleString("id-ID"), icon: Users },
    { label: "Total Terdaftar", value: total.toLocaleString("id-ID"), icon: GraduationCap },
    { label: "Program Studi", value: accreditation.length, icon: Award },
    { label: "Audit < 120 hari", value: accCritical, icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Pimpinan</h1>
        <p className="text-muted-foreground text-sm">{u.name} · {u.nim}</p>
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
          <Button asChild><Link to="/monitoring">Buka Monitoring</Link></Button>
          <Button asChild variant="secondary"><Link to="/accreditation">Tracker Akreditasi</Link></Button>
          <Button asChild variant="secondary"><Link to="/integration">Status Integrasi</Link></Button>
        </CardContent>
      </Card>
    </div>
  );
}
