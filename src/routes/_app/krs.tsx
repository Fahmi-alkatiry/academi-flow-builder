import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { courses } from "@/lib/mock-data";
import { Search, AlertTriangle, CheckCircle2, Plus, Minus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/krs")({
  head: () => ({
    meta: [
      { title: "KRS — SIAT Universitas Madura" },
      { name: "description", content: "Pengisian Kartu Rencana Studi semester berjalan." },
    ],
  }),
  component: KrsPage,
});

const MAX_SKS = 24;
type Cat = "Semua" | "Wajib" | "Pilihan";

function KrsPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set(["TIF301", "TIF302"]));
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Cat>("Semua");

  const filtered = useMemo(() => courses.filter((c) => {
    const matchQ = c.name.toLowerCase().includes(q.toLowerCase()) || c.code.toLowerCase().includes(q.toLowerCase());
    const matchC = cat === "Semua" || c.category === cat;
    return matchQ && matchC;
  }), [q, cat]);

  const selectedCourses = courses.filter((c) => selected.has(c.code));
  const totalSks = selectedCourses.reduce((s, c) => s + c.sks, 0);
  const over = totalSks > MAX_SKS;

  const toggle = (code: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code); else next.add(code);
      return next;
    });
  };

  const submit = () => {
    if (over) { toast.error("Total SKS melebihi batas maksimum 24."); return; }
    if (selectedCourses.length === 0) { toast.error("Pilih minimal satu mata kuliah."); return; }
    toast.success("KRS dikirim. Menunggu persetujuan dosen wali.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Kartu Rencana Studi</h1>
        <p className="text-muted-foreground text-sm">Semester Ganjil 2025/2026 · Maksimum {MAX_SKS} SKS</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input className="pl-9" placeholder="Cari kode atau nama mata kuliah…" value={q} onChange={(e) => setQ(e.target.value)} />
                </div>
                <div className="flex gap-1">
                  {(["Semua", "Wajib", "Pilihan"] as Cat[]).map((c) => (
                    <Button key={c} size="sm" variant={cat === c ? "default" : "outline"} onClick={() => setCat(c)}>{c}</Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kode</TableHead>
                      <TableHead>Mata Kuliah</TableHead>
                      <TableHead className="text-center">SKS</TableHead>
                      <TableHead className="hidden md:table-cell">Dosen</TableHead>
                      <TableHead className="hidden lg:table-cell">Jadwal</TableHead>
                      <TableHead className="text-center">Kuota</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((c) => {
                      const isSel = selected.has(c.code);
                      const full = c.quotaFilled >= c.quotaTotal;
                      return (
                        <TableRow key={c.code} className={isSel ? "bg-primary/5" : ""}>
                          <TableCell className="font-mono text-xs">{c.code}</TableCell>
                          <TableCell>
                            <div className="font-medium text-sm">{c.name}</div>
                            <div className="md:hidden text-xs text-muted-foreground">{c.lecturer}</div>
                            <Badge variant={c.category === "Wajib" ? "default" : "secondary"} className="mt-1 text-[10px]">{c.category}</Badge>
                          </TableCell>
                          <TableCell className="text-center font-semibold">{c.sks}</TableCell>
                          <TableCell className="hidden md:table-cell text-sm">{c.lecturer}</TableCell>
                          <TableCell className="hidden lg:table-cell text-sm">{c.schedule}</TableCell>
                          <TableCell className="text-center text-xs">
                            <span className={full ? "text-destructive font-semibold" : ""}>{c.quotaFilled}/{c.quotaTotal}</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant={isSel ? "destructive" : "default"} onClick={() => toggle(c.code)} disabled={!isSel && full}>
                              {isSel ? <><Minus className="size-3 mr-1" /> Hapus</> : <><Plus className="size-3 mr-1" /> Ambil</>}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="lg:sticky lg:top-4">
            <CardHeader><CardTitle className="text-base">Ringkasan Pilihan</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted-foreground">Total SKS</span>
                  <span className={`text-2xl font-bold ${over ? "text-destructive" : ""}`}>{totalSks}<span className="text-sm text-muted-foreground"> / {MAX_SKS}</span></span>
                </div>
                <Progress value={Math.min((totalSks / MAX_SKS) * 100, 100)} className={`mt-2 ${over ? "[&>div]:bg-destructive" : ""}`} />
              </div>

              {over && (
                <div className="flex gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
                  <AlertTriangle className="size-4 shrink-0" />
                  <span>Total SKS melebihi batas maksimum. Hapus beberapa mata kuliah untuk melanjutkan.</span>
                </div>
              )}
              {!over && totalSks > 0 && (
                <div className="flex gap-2 rounded-md border border-success/40 bg-success/10 p-3 text-xs text-success-foreground">
                  <CheckCircle2 className="size-4 shrink-0 text-success" />
                  <span>Beban SKS dalam batas wajar.</span>
                </div>
              )}

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {selectedCourses.length === 0 && (
                  <p className="text-xs text-muted-foreground">Belum ada mata kuliah dipilih.</p>
                )}
                {selectedCourses.map((c) => (
                  <div key={c.code} className="flex items-start justify-between gap-2 rounded-md border p-2">
                    <div className="min-w-0">
                      <div className="text-xs font-mono text-muted-foreground">{c.code}</div>
                      <div className="text-sm font-medium truncate">{c.name}</div>
                    </div>
                    <Badge variant="secondary">{c.sks} SKS</Badge>
                  </div>
                ))}
              </div>

              <Button className="w-full" disabled={over || selectedCourses.length === 0} onClick={submit}>
                Ajukan KRS
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
