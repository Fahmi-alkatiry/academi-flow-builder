import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { advisees, courses } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/advisees")({
  head: () => ({ meta: [{ title: "Mahasiswa Perwalian — SIAT" }] }),
  component: AdviseesPage,
});

const statusColor = { Menunggu: "default", Disetujui: "secondary", Revisi: "destructive" } as const;

function AdviseesPage() {
  const [open, setOpen] = useState<string | null>(null);
  const sample = courses.slice(0, 7);
  const total = sample.reduce((s, c) => s + c.sks, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mahasiswa Perwalian</h1>
        <p className="text-muted-foreground text-sm">Validasi KRS semester berjalan</p>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead>NIM</TableHead><TableHead>Nama</TableHead><TableHead className="text-center">Sem</TableHead><TableHead className="text-center">IPK</TableHead><TableHead className="text-center">SKS KRS</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow></TableHeader>
              <TableBody>
                {advisees.map((a) => (
                  <TableRow key={a.nim}>
                    <TableCell className="font-mono text-xs">{a.nim}</TableCell>
                    <TableCell className="font-medium">{a.name}</TableCell>
                    <TableCell className="text-center">{a.semester}</TableCell>
                    <TableCell className="text-center">{a.ipk}</TableCell>
                    <TableCell className="text-center">{a.krsSks}</TableCell>
                    <TableCell><Badge variant={statusColor[a.krsStatus]}>{a.krsStatus}</Badge></TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" onClick={() => setOpen(a.nim)}>Tinjau</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tinjau KRS Mahasiswa</DialogTitle>
            <DialogDescription>{advisees.find((a) => a.nim === open)?.name} · {open}</DialogDescription>
          </DialogHeader>
          <div className="max-h-80 overflow-y-auto">
            <Table>
              <TableHeader><TableRow><TableHead>Kode</TableHead><TableHead>Mata Kuliah</TableHead><TableHead className="text-center">SKS</TableHead></TableRow></TableHeader>
              <TableBody>
                {sample.map((c) => (
                  <TableRow key={c.code}><TableCell className="font-mono text-xs">{c.code}</TableCell><TableCell>{c.name}</TableCell><TableCell className="text-center">{c.sks}</TableCell></TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Total: <span className="font-semibold text-foreground">{total} SKS</span></span>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { toast("Diminta revisi"); setOpen(null); }}>Minta Revisi</Button>
            <Button onClick={() => { toast.success("KRS disetujui"); setOpen(null); }}>Setujui KRS</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
