import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockUserByRole } from "@/lib/mock-data";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Award, BookOpen, GraduationCap, TrendingUp, Clock, MapPin } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function StudentDashboard() {
  const { user } = useAuth();
  const u = user || mockUserByRole.student;

  const [grades, setGrades] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<{ today: any[]; weekly: any[] }>({ today: [], weekly: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const gradesData = await apiFetch<any[]>("/api/student/grades");
        const scheduleData = await apiFetch<any>("/api/student/schedule");
        setGrades(gradesData);
        setSchedule(scheduleData);
      } catch (err) {
        console.error("Gagal memuat data dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const totalSks = grades.reduce((s, t) => s + t.sks, 0);
  const ipk = totalSks > 0
    ? (grades.reduce((s, t) => s + t.mutu * t.sks, 0) / totalSks).toFixed(2)
    : "0.00";

  const stats = [
    { label: "IPK Kumulatif", value: ipk, icon: Award, hint: "Skala 4.00" },
    { label: "Total SKS Lulus", value: totalSks, icon: BookOpen, hint: "dari 144 SKS" },
    { label: "Semester Aktif", value: 5, icon: GraduationCap, hint: "Ganjil 2025/2026" },
    { label: "IP Semester Lalu", value: "3.71", icon: TrendingUp, hint: "Naik 0.08" },
  ];

  if (loading) {
    return <div className="text-sm text-muted-foreground text-center py-6">Memuat dashboard…</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Selamat datang, {u.name.split(" ")[0]} 👋</h1>
        <p className="text-muted-foreground text-sm">{u.nim || u.username} · {u.program}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <s.icon className="size-5 text-primary" />
                <span className="text-xs text-muted-foreground">{s.hint}</span>
              </div>
              <div className="mt-3 text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Jadwal Kuliah Hari Ini</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {schedule.today.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">Tidak ada jadwal kuliah untuk hari ini.</p>
            ) : (
              schedule.today.map((c, i) => (
                <div key={i} className="flex items-start gap-4 rounded-md border p-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-primary min-w-[120px]">
                    <Clock className="size-4" /> {c.time} {c.end && `– ${c.end}`}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{c.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1"><MapPin className="size-3" /> {c.room}</span>
                      <span>{c.lecturer}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Aksi Cepat</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full justify-start"><Link to="/krs">Isi KRS Semester Ini</Link></Button>
            <Button asChild variant="secondary" className="w-full justify-start"><Link to="/schedule">Lihat Jadwal Mingguan</Link></Button>
            <Button asChild variant="secondary" className="w-full justify-start"><Link to="/grades">Buka Transkrip Nilai</Link></Button>
            <div className="rounded-md bg-warning/15 text-warning-foreground p-3 text-xs mt-3">
              <strong>Pengumuman:</strong> Batas akhir KRS semester ganjil tanggal 15 September 2025.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
