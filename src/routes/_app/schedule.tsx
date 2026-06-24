import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/schedule")({
  head: () => ({ meta: [{ title: "Jadwal Kuliah — SIAT" }] }),
  component: SchedulePage,
});

function SchedulePage() {
  const [weeklySchedule, setWeeklySchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSchedule() {
      try {
        const data = await apiFetch<any>("/api/student/schedule");
        setWeeklySchedule(data.weekly || []);
      } catch (err: any) {
        toast.error("Gagal memuat jadwal: " + err.message);
      } finally {
        setLoading(false);
      }
    }
    loadSchedule();
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Memuat data jadwal…</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Jadwal Kuliah Mingguan</h1>
        <p className="text-muted-foreground text-sm">Semester Ganjil 2025/2026</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {weeklySchedule.map((day) => (
          <Card key={day.day}>
            <CardHeader className="pb-3"><CardTitle className="text-base">{day.day}</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {day.items.length === 0 && <p className="text-xs text-muted-foreground">Tidak ada kuliah.</p>}
              {day.items.map((it: any, i: number) => (
                <div key={i} className="rounded-md border-l-4 border-primary bg-primary/5 p-3">
                  <div className="text-xs text-muted-foreground">{it.time} {it.end && `– ${it.end}`}</div>
                  <div className="font-medium text-sm">{it.name}</div>
                  <div className="text-xs text-muted-foreground">{it.room} · {it.lecturer}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
