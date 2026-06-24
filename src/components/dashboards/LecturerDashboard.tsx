import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockUserByRole } from "@/lib/mock-data";
import { Users, ClipboardCheck, GraduationCap, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function LecturerDashboard() {
  const { user } = useAuth();
  const u = user || mockUserByRole.lecturer;

  const [classes, setClasses] = useState<any[]>([]);
  const [advisees, setAdvisees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const classesData = await apiFetch<any[]>("/api/lecturer/classes");
        const adviseesData = await apiFetch<any[]>("/api/lecturer/advisees");
        setClasses(classesData);
        setAdvisees(adviseesData);
      } catch (err) {
        console.error("Gagal memuat dashboard dosen:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const totalStudents = classes.reduce((s, c) => s + c.students, 0);
  const pending = advisees.filter((a) => a.krsStatus === "Menunggu").length;

  const stats = [
    { label: "Kelas Diampu", value: classes.length, icon: GraduationCap },
    { label: "Total Mahasiswa", value: totalStudents, icon: Users },
    { label: "Mahasiswa Perwalian", value: advisees.length, icon: ClipboardCheck },
    { label: "KRS Menunggu", value: pending, icon: AlertCircle },
  ];

  if (loading) {
    return <div className="text-sm text-muted-foreground text-center py-6">Memuat dashboard…</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Selamat datang, {u.name.split(",")[0]}</h1>
        <p className="text-muted-foreground text-sm">{u.nidn || u.username} · {u.program}</p>
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
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Kelas Aktif</CardTitle>
            <Button asChild size="sm" variant="ghost"><Link to="/teaching">Lihat semua</Link></Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {classes.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">Tidak ada kelas aktif semester ini.</p>
            ) : (
              classes.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <div className="font-medium text-sm">{c.code} · {c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.schedule} · {c.room}</div>
                  </div>
                  <Badge variant="secondary">{c.students} mhs</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">KRS Menunggu Persetujuan</CardTitle>
            <Button asChild size="sm" variant="ghost"><Link to="/advisees">Kelola</Link></Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {advisees.filter((a) => a.krsStatus === "Menunggu").length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">Semua KRS mahasiswa perwalian sudah disetujui/direvisi.</p>
            ) : (
              advisees.filter((a) => a.krsStatus === "Menunggu").map((a) => (
                <div key={a.nim} className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <div className="font-medium text-sm">{a.name}</div>
                    <div className="text-xs text-muted-foreground">{a.nim} · IPK {a.ipk.toFixed(2)}</div>
                  </div>
                  <Badge>{a.krsSks} SKS</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
