import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, Pie, PieChart, Cell } from "recharts";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/monitoring")({
  head: () => ({ meta: [{ title: "Monitoring — SIAT" }] }),
  component: MonitoringPage,
});

const gradeConfig = { jumlah: { label: "Jumlah", color: "var(--chart-1)" } } satisfies ChartConfig;
const trendConfig = {
  FT: { label: "F. Teknik", color: "var(--chart-1)" },
  FE: { label: "F. Ekonomi", color: "var(--chart-2)" },
  FH: { label: "F. Hukum", color: "var(--chart-3)" },
  FKIP: { label: "FKIP", color: "var(--chart-4)" },
} satisfies ChartConfig;
const statusConfig = {
  Aktif: { label: "Aktif", color: "var(--chart-3)" },
  Cuti: { label: "Cuti", color: "var(--chart-4)" },
  Lulus: { label: "Lulus", color: "var(--chart-1)" },
  DO: { label: "DO", color: "var(--chart-5)" },
} satisfies ChartConfig;

function MonitoringPage() {
  const [fak, setFak] = useState("Semua");
  const [chartsData, setChartsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCharts() {
      try {
        const data = await apiFetch<any>("/api/monitoring/charts");
        setChartsData(data);
      } catch (err: any) {
        toast.error("Gagal memuat chart monitoring: " + err.message);
      } finally {
        setLoading(false);
      }
    }
    loadCharts();
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Memuat visualisasi data…</div>;
  }

  const { gradeDistribution = [], enrollmentTrend = [], studentStatus = [] } = chartsData || {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Monitoring Akademik</h1>
          <p className="text-muted-foreground text-sm">Tinjauan real-time progres studi universitas</p>
        </div>
        <Select value={fak} onValueChange={setFak}>
          <SelectTrigger className="w-full sm:w-56"><SelectValue /></SelectTrigger>
          <SelectContent>
            {["Semua", "F. Teknik", "F. Ekonomi", "F. Hukum", "FKIP"].map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Distribusi Nilai (Semua Mata Kuliah)</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={gradeConfig} className="h-72 w-full">
              <BarChart data={gradeDistribution}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="grade" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="jumlah" fill="var(--color-jumlah)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Tren Penerimaan Mahasiswa</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={trendConfig} className="h-72 w-full">
              <LineChart data={enrollmentTrend}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="tahun" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line type="monotone" dataKey="FT" stroke="var(--color-FT)" strokeWidth={2} />
                <Line type="monotone" dataKey="FE" stroke="var(--color-FE)" strokeWidth={2} />
                <Line type="monotone" dataKey="FH" stroke="var(--color-FH)" strokeWidth={2} />
                <Line type="monotone" dataKey="FKIP" stroke="var(--color-FKIP)" strokeWidth={2} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Status Mahasiswa</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={statusConfig} className="h-72 w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie data={studentStatus} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100}>
                  {studentStatus.map((s: any) => <Cell key={s.name} fill={`var(--color-${s.name})`} />)}
                </Pie>
                <ChartLegend content={<ChartLegendContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
