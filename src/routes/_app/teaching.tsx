import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { lecturerClasses } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/teaching")({
  head: () => ({ meta: [{ title: "Kelas Diampu — SIAT" }] }),
  component: TeachingPage,
});

function TeachingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Kelas yang Diampu</h1>
        <p className="text-muted-foreground text-sm">Semester Ganjil 2025/2026</p>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead>Kode</TableHead><TableHead>Mata Kuliah</TableHead><TableHead className="text-center">Mahasiswa</TableHead><TableHead>Jadwal</TableHead><TableHead>Ruang</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow></TableHeader>
              <TableBody>
                {lecturerClasses.map((c) => (
                  <TableRow key={c.code}>
                    <TableCell className="font-mono text-xs">{c.code}</TableCell>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="text-center">{c.students}</TableCell>
                    <TableCell>{c.schedule}</TableCell>
                    <TableCell>{c.room}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="sm" variant="secondary"><Link to="/grade-input">Input Nilai</Link></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
