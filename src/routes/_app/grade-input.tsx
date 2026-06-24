import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/grade-input")({
  head: () => ({ meta: [{ title: "Input Nilai — SIAT" }] }),
  component: GradeInputPage,
});

const GRADES = ["", "A", "A-", "B+", "B", "B-", "C+", "C", "D", "E"];
const mutuMap: Record<string, number> = { A: 4, "A-": 3.7, "B+": 3.3, B: 3, "B-": 2.7, "C+": 2.3, C: 2, D: 1, E: 0 };

function GradeInputPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [rows, setRows] = useState<any[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingRoster, setLoadingRoster] = useState(false);

  useEffect(() => {
    async function loadClasses() {
      try {
        const data = await apiFetch<any[]>("/api/lecturer/classes");
        setClasses(data);
        if (data.length > 0) {
          setSelectedClassId(data[0].id.toString());
        }
      } catch (err: any) {
        toast.error("Gagal memuat kelas: " + err.message);
      } finally {
        setLoadingClasses(false);
      }
    }
    loadClasses();
  }, []);

  useEffect(() => {
    if (!selectedClassId) return;

    async function loadRoster() {
      setLoadingRoster(true);
      try {
        const roster = await apiFetch<any[]>(`/api/classes/${selectedClassId}/roster`);
        setRows(roster);
      } catch (err: any) {
        toast.error("Gagal memuat roster mahasiswa: " + err.message);
      } finally {
        setLoadingRoster(false);
      }
    }
    loadRoster();
  }, [selectedClassId]);

  const setGrade = (nim: string, g: string) => {
    setRows((prev) => prev.map((r) => (r.nim === nim ? { ...r, grade: g } : r)));
  };

  const submit = async () => {
    if (!selectedClassId) return;
    const filled = rows.filter((r) => r.grade).length;
    
    try {
      await apiFetch("/api/grades", {
        method: "POST",
        body: JSON.stringify({
          classId: parseInt(selectedClassId),
          grades: rows.map(r => ({ nim: r.nim, scoreAlphabet: r.grade }))
        })
      });
      toast.success(`Nilai diserahkan untuk ${filled} dari ${rows.length} mahasiswa.`);
    } catch (err: any) {
      toast.error("Gagal menyimpan nilai: " + err.message);
    }
  };

  if (loadingClasses) {
    return <div className="text-center py-12 text-muted-foreground">Memuat data kelas…</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Input Nilai Mahasiswa</h1>
        <p className="text-muted-foreground text-sm">Semester Ganjil 2025/2026</p>
      </div>
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-base">Pilih Kelas</CardTitle>
          {classes.length > 0 ? (
            <Select value={selectedClassId} onValueChange={setSelectedClassId}>
              <SelectTrigger className="w-full sm:w-72"><SelectValue /></SelectTrigger>
              <SelectContent>
                {classes.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.code} · {c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          ) : (
            <span className="text-sm text-muted-foreground">Tidak ada kelas diampu.</span>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {loadingRoster ? (
            <div className="text-center py-12 text-muted-foreground">Memuat daftar mahasiswa…</div>
          ) : rows.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">Tidak ada mahasiswa terdaftar di kelas ini.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow><TableHead>NIM</TableHead><TableHead>Nama</TableHead><TableHead className="w-32">Nilai</TableHead><TableHead className="text-center">Mutu</TableHead></TableRow></TableHeader>
                <TableBody>
                  {rows.map((r) => (
                    <TableRow key={r.nim}>
                      <TableCell className="font-mono text-xs">{r.nim}</TableCell>
                      <TableCell>{r.name}</TableCell>
                      <TableCell>
                        <Select value={r.grade} onValueChange={(v) => setGrade(r.nim, v)}>
                          <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                          <SelectContent>
                            {GRADES.filter(Boolean).map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-center">{r.grade ? mutuMap[r.grade].toFixed(1) : "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {rows.length > 0 && (
            <div className="flex justify-end gap-2 p-4 border-t">
              <Button variant="outline" onClick={() => toast("Draft disimpan (simulasi)")}>Simpan Draft</Button>
              <Button onClick={submit}>Submit Nilai</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
