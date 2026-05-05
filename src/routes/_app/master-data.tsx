import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { masterMahasiswa, courses } from "@/lib/mock-data";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/master-data")({
  head: () => ({ meta: [{ title: "Master Data — SIAT" }] }),
  component: MasterDataPage,
});

function MasterDataPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manajemen Master Data</h1>
        <p className="text-muted-foreground text-sm">Pengelolaan data dasar oleh tenaga kependidikan</p>
      </div>
      <Tabs defaultValue="mahasiswa">
        <TabsList>
          <TabsTrigger value="mahasiswa">Mahasiswa</TabsTrigger>
          <TabsTrigger value="dosen">Dosen</TabsTrigger>
          <TabsTrigger value="matkul">Mata Kuliah</TabsTrigger>
          <TabsTrigger value="ruang">Ruangan</TabsTrigger>
        </TabsList>

        <TabsContent value="mahasiswa">
          <Card>
            <CardContent className="p-0">
              <div className="flex justify-between items-center p-4 border-b">
                <span className="text-sm text-muted-foreground">{masterMahasiswa.length} record</span>
                <Button size="sm" onClick={() => toast("Form tambah mahasiswa")}><Plus className="size-3 mr-1" /> Tambah</Button>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow><TableHead>NIM</TableHead><TableHead>Nama</TableHead><TableHead>Program Studi</TableHead><TableHead className="text-center">Angkatan</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {masterMahasiswa.map((m) => (
                      <TableRow key={m.nim}>
                        <TableCell className="font-mono text-xs">{m.nim}</TableCell>
                        <TableCell className="font-medium">{m.nama}</TableCell>
                        <TableCell>{m.prodi}</TableCell>
                        <TableCell className="text-center">{m.angkatan}</TableCell>
                        <TableCell><Badge variant={m.status === "Aktif" ? "secondary" : "outline"}>{m.status}</Badge></TableCell>
                        <TableCell className="text-right">
                          <Button size="icon" variant="ghost" onClick={() => toast("Edit")}><Pencil className="size-3" /></Button>
                          <Button size="icon" variant="ghost" onClick={() => toast("Hapus")}><Trash2 className="size-3" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dosen">
          <Card><CardContent className="p-6 text-sm text-muted-foreground">Modul manajemen data dosen — wireframe.</CardContent></Card>
        </TabsContent>

        <TabsContent value="matkul">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow><TableHead>Kode</TableHead><TableHead>Mata Kuliah</TableHead><TableHead className="text-center">SKS</TableHead><TableHead>Kategori</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {courses.map((c) => (
                      <TableRow key={c.code}>
                        <TableCell className="font-mono text-xs">{c.code}</TableCell>
                        <TableCell className="font-medium">{c.name}</TableCell>
                        <TableCell className="text-center">{c.sks}</TableCell>
                        <TableCell><Badge variant="secondary">{c.category}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ruang">
          <Card><CardContent className="p-6 text-sm text-muted-foreground">Modul manajemen ruangan — wireframe.</CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
