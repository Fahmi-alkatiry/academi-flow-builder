import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { advisees, lecturerClasses, mockUserByRole } from "@/lib/mock-data";
import { Users, ClipboardCheck, GraduationCap, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export default function LecturerDashboard() {
  const u = mockUserByRole.lecturer;
  const totalStudents = lecturerClasses.reduce((s, c) => s + c.students, 0);
  const pending = advisees.filter((a) => a.krsStatus === "Menunggu").length;

  const stats = [
    { label: "Kelas Diampu", value: lecturerClasses.length, icon: GraduationCap },
    { label: "Total Mahasiswa", value: totalStudents, icon: Users },
    { label: "Mahasiswa Perwalian", value: advisees.length, icon: ClipboardCheck },
    { label: "KRS Menunggu", value: pending, icon: AlertCircle },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Selamat datang, {u.name.split(",")[0]}</h1>
        <p className="text-muted-foreground text-sm">{u.nim} · {u.program}</p>
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
            {lecturerClasses.map((c) => (
              <div key={c.code} className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <div className="font-medium text-sm">{c.code} · {c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.schedule} · {c.room}</div>
                </div>
                <Badge variant="secondary">{c.students} mhs</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">KRS Menunggu Persetujuan</CardTitle>
            <Button asChild size="sm" variant="ghost"><Link to="/advisees">Kelola</Link></Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {advisees.filter((a) => a.krsStatus === "Menunggu").map((a) => (
              <div key={a.nim} className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <div className="font-medium text-sm">{a.name}</div>
                  <div className="text-xs text-muted-foreground">{a.nim} · IPK {a.ipk}</div>
                </div>
                <Badge>{a.krsSks} SKS</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
