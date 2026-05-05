import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { lecturerClasses, classRoster } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/grade-input")({
  head: () => ({ meta: [{ title: "Input Nilai — SIAT" }] }),
  component: GradeInputPage,
});

const GRADES = ["", "A", "A-", "B+", "B", "B-", "C+", "C", "D", "E"];
const mutuMap: Record<string, number> = { A: 4, "A-": 3.7, "B+": 3.3, B: 3, "B-": 2.7, "C+": 2.3, C: 2, D: 1, E: 0 };

function GradeInputPage() {
  const [klass, setKlass] = useState(lecturerClasses[0].code);
  const [rows, setRows] = useState(classRoster.map((r) => ({ ...r })));

  const setGrade = (nim: string, g: string) => {
    setRows((prev) => prev.map((r) => (r.nim === nim ? { ...r, grade: g } : r)));
  };

  const submit = () => {
    const filled = rows.filter((r) => r.grade).length;
    toast.success(`Nilai disimpan untuk ${filled} dari ${rows.length} mahasiswa.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Input Nilai Mahasiswa</h1>
        <p className="text-muted-foreground text-sm">Semester Ganjil 2025/2026</p>
      </div>
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-base">Pilih Kelas</CardTitle>
          <Select value={klass} onValueChange={setKlass}>
            <SelectTrigger className="w-full sm:w-72"><SelectValue /></SelectTrigger>
            <SelectContent>
              {lecturerClasses.map((c) => <SelectItem key={c.code} value={c.code}>{c.code} · {c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="p-0">
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
          <div className="flex justify-end gap-2 p-4 border-t">
            <Button variant="outline" onClick={() => toast("Draft tersimpan")}>Simpan Draft</Button>
            <Button onClick={submit}>Submit Nilai</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
