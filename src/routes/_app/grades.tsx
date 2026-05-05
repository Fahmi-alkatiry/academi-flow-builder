import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { transcript } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/grades")({
  head: () => ({ meta: [{ title: "Nilai & Transkrip — SIAT" }] }),
  component: GradesPage,
});

function GradesPage() {
  const semesters = useMemo(() => {
    const map = new Map<number, typeof transcript>();
    transcript.forEach((t) => {
      if (!map.has(t.semester)) map.set(t.semester, []);
      map.get(t.semester)!.push(t);
    });
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, []);
  const totalSks = transcript.reduce((s, t) => s + t.sks, 0);
  const ipk = (transcript.reduce((s, t) => s + t.mutu * t.sks, 0) / totalSks).toFixed(2);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Nilai & Transkrip Akademik</h1>
        <p className="text-muted-foreground text-sm">IPK Kumulatif: <span className="font-semibold text-foreground">{ipk}</span> · Total {totalSks} SKS</p>
      </div>
      <Tabs defaultValue="per-semester">
        <TabsList>
          <TabsTrigger value="per-semester">Per Semester</TabsTrigger>
          <TabsTrigger value="transkrip">Transkrip Lengkap</TabsTrigger>
        </TabsList>
        <TabsContent value="per-semester" className="space-y-4">
          {semesters.map(([sem, rows]) => {
            const sks = rows.reduce((s, r) => s + r.sks, 0);
            const ip = (rows.reduce((s, r) => s + r.mutu * r.sks, 0) / sks).toFixed(2);
            return (
              <Card key={sem}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">Semester {sem}</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{sks} SKS</Badge>
                    <Badge>IP {ip}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader><TableRow><TableHead>Kode</TableHead><TableHead>Mata Kuliah</TableHead><TableHead className="text-center">SKS</TableHead><TableHead className="text-center">Nilai</TableHead><TableHead className="text-center">Mutu</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {rows.map((r) => (
                          <TableRow key={r.code}>
                            <TableCell className="font-mono text-xs">{r.code}</TableCell>
                            <TableCell>{r.name}</TableCell>
                            <TableCell className="text-center">{r.sks}</TableCell>
                            <TableCell className="text-center"><Badge variant="outline">{r.grade}</Badge></TableCell>
                            <TableCell className="text-center">{r.mutu.toFixed(1)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
        <TabsContent value="transkrip">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow><TableHead>Sem</TableHead><TableHead>Kode</TableHead><TableHead>Mata Kuliah</TableHead><TableHead className="text-center">SKS</TableHead><TableHead className="text-center">Nilai</TableHead><TableHead className="text-center">Mutu</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {transcript.map((r, i) => (
                      <TableRow key={i}>
                        <TableCell>{r.semester}</TableCell>
                        <TableCell className="font-mono text-xs">{r.code}</TableCell>
                        <TableCell>{r.name}</TableCell>
                        <TableCell className="text-center">{r.sks}</TableCell>
                        <TableCell className="text-center"><Badge variant="outline">{r.grade}</Badge></TableCell>
                        <TableCell className="text-center">{r.mutu.toFixed(1)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
