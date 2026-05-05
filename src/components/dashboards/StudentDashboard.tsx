import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockUserByRole, todaySchedule, transcript } from "@/lib/mock-data";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Award, BookOpen, GraduationCap, TrendingUp, Clock, MapPin } from "lucide-react";

export default function StudentDashboard() {
  const u = mockUserByRole.student;
  const totalSks = transcript.reduce((s, t) => s + t.sks, 0);
  const ipk = (transcript.reduce((s, t) => s + t.mutu * t.sks, 0) / totalSks).toFixed(2);

  const stats = [
    { label: "IPK Kumulatif", value: ipk, icon: Award, hint: "Skala 4.00" },
    { label: "Total SKS Lulus", value: totalSks, icon: BookOpen, hint: "dari 144 SKS" },
    { label: "Semester Aktif", value: 5, icon: GraduationCap, hint: "Ganjil 2025/2026" },
    { label: "IP Semester Lalu", value: "3.71", icon: TrendingUp, hint: "Naik 0.08" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Selamat datang, {u.name.split(" ")[0]} 👋</h1>
        <p className="text-muted-foreground text-sm">{u.nim} · {u.program}</p>
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
            {todaySchedule.map((c) => (
              <div key={c.course} className="flex items-start gap-4 rounded-md border p-3">
                <div className="flex items-center gap-2 text-sm font-medium text-primary min-w-[120px]">
                  <Clock className="size-4" /> {c.time}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{c.course}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1"><MapPin className="size-3" /> {c.room}</span>
                    <span>{c.lecturer}</span>
                  </div>
                </div>
              </div>
            ))}
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
