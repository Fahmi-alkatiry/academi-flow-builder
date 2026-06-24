import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/advisees")({
  head: () => ({ meta: [{ title: "Mahasiswa Perwalian — SIAT" }] }),
  component: AdviseesPage,
});

const statusColor = { 
  "Menunggu": "default", 
  "Disetujui": "secondary", 
  "Revisi": "destructive",
  "Draft": "outline"
} as const;

function AdviseesPage() {
  const [advisees, setAdvisees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNim, setSelectedNim] = useState<string | null>(null);
  const [selectedKrs, setSelectedKrs] = useState<any | null>(null);
  const [loadingKrs, setLoadingKrs] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (val: string) => {
    setStatusFilter(val);
    setCurrentPage(1);
  };

  const filteredAdvisees = useMemo(() => {
    return advisees.filter(a => {
      const matchesSearch = 
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.nim.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "ALL" || a.krsStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [advisees, searchQuery, statusFilter]);

  const paginatedAdvisees = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAdvisees.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAdvisees, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredAdvisees.length / ITEMS_PER_PAGE));

  async function loadAdvisees() {
    try {
      const data = await apiFetch<any[]>("/api/lecturer/advisees");
      setAdvisees(data);
    } catch (err: any) {
      toast.error("Gagal memuat mahasiswa perwalian: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAdvisees();
  }, []);

  const openReview = async (nim: string, krsId: number | null) => {
    if (!krsId) {
      toast.error("Mahasiswa belum mengisi KRS");
      return;
    }
    setSelectedNim(nim);
    setLoadingKrs(true);
    try {
      const krsData = await apiFetch<any>(`/api/lecturer/krs/${krsId}`);
      setSelectedKrs(krsData);
    } catch (err: any) {
      toast.error("Gagal memuat rencana studi: " + err.message);
    } finally {
      setLoadingKrs(false);
    }
  };

  const handleKrsApproval = async (status: "APPROVED" | "REVISION") => {
    if (!selectedKrs) return;
    try {
      await apiFetch(`/api/krs/${selectedKrs.id}/approval`, {
        method: "PUT",
        body: JSON.stringify({ status })
      });
      toast.success(status === "APPROVED" ? "KRS disetujui" : "Permohonan revisi dikirim");
      setSelectedNim(null);
      setSelectedKrs(null);
      loadAdvisees(); // reload lists
    } catch (err: any) {
      toast.error("Gagal mengubah status KRS: " + err.message);
    }
  };

  const toggleDetailApproval = async (detailId: number, currentStatus: string) => {
    const nextStatus = currentStatus === "APPROVED" ? "REJECTED" : "APPROVED";
    try {
      await apiFetch(`/api/krs-detail/${detailId}/approval`, {
        method: "PUT",
        body: JSON.stringify({ approvalStatus: nextStatus })
      });
      // reload specific KRS view
      const krsData = await apiFetch<any>(`/api/lecturer/krs/${selectedKrs.id}`);
      setSelectedKrs(krsData);
      toast.success("Status persetujuan matakuliah diubah");
    } catch (err: any) {
      toast.error("Gagal mengubah status matakuliah: " + err.message);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Memuat data perwalian…</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mahasiswa Perwalian</h1>
        <p className="text-muted-foreground text-sm">Validasi KRS semester berjalan</p>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center p-4 border-b">
            <div className="flex flex-col sm:flex-row gap-2 flex-1 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Cari NIM atau nama..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-8 w-full"
                />
              </div>
              <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Status</SelectItem>
                  <SelectItem value="Menunggu">Menunggu</SelectItem>
                  <SelectItem value="Disetujui">Disetujui</SelectItem>
                  <SelectItem value="Revisi">Revisi</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-4">
              <span className="text-sm text-muted-foreground">
                {filteredAdvisees.length} record
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead>NIM</TableHead><TableHead>Nama</TableHead><TableHead className="text-center">Sem</TableHead><TableHead className="text-center">IPK</TableHead><TableHead className="text-center">SKS KRS</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow></TableHeader>
              <TableBody>
                {paginatedAdvisees.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-6">Tidak ada mahasiswa perwalian terdaftar.</TableCell></TableRow>
                ) : (
                  paginatedAdvisees.map((a) => (
                    <TableRow key={a.nim}>
                      <TableCell className="font-mono text-xs">{a.nim}</TableCell>
                      <TableCell className="font-medium">{a.name}</TableCell>
                      <TableCell className="text-center">{a.semester}</TableCell>
                      <TableCell className="text-center">{a.ipk.toFixed(2)}</TableCell>
                      <TableCell className="text-center">{a.krsSks}</TableCell>
                      <TableCell><Badge variant={statusColor[a.krsStatus as keyof typeof statusColor] || "outline"}>{a.krsStatus}</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          disabled={!a.krsId} 
                          onClick={() => openReview(a.nim, a.krsId)}
                        >
                          Tinjau
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
            <div className="text-sm text-muted-foreground order-2 sm:order-1">
              Menampilkan {filteredAdvisees.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredAdvisees.length)} dari {filteredAdvisees.length} record
            </div>
            <div className="flex items-center gap-2 order-1 sm:order-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Sebelumnya
              </Button>
              <span className="text-sm font-medium">
                Hal {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Berikutnya
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedNim} onOpenChange={(v) => !v && setSelectedNim(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tinjau KRS Mahasiswa</DialogTitle>
            <DialogDescription>
              {selectedKrs?.studentName} · {selectedNim}
            </DialogDescription>
          </DialogHeader>
          
          {loadingKrs ? (
            <div className="text-center py-6 text-muted-foreground">Memuat detail rencana studi…</div>
          ) : !selectedKrs ? (
            <div className="text-center py-6 text-muted-foreground">KRS tidak ditemukan atau belum diajukan.</div>
          ) : (
            <>
              <div className="max-h-80 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kode</TableHead>
                      <TableHead>Mata Kuliah</TableHead>
                      <TableHead className="text-center">SKS</TableHead>
                      <TableHead>Jadwal</TableHead>
                      <TableHead>Ruang</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedKrs.details.map((c: any) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-mono text-xs">{c.code}</TableCell>
                        <TableCell className="text-sm font-medium">{c.name}</TableCell>
                        <TableCell className="text-center">{c.sks}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{c.schedule}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{c.room}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm" 
                            variant={c.approvalStatus === "APPROVED" ? "secondary" : "destructive"} 
                            onClick={() => toggleDetailApproval(c.id, c.approvalStatus)}
                          >
                            {c.approvalStatus === "APPROVED" ? "Setuju" : "Tolak"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-between items-center text-sm pt-2 border-t font-semibold">
                <span className="text-muted-foreground">Total:</span>
                <span>{selectedKrs.details.reduce((acc: number, item: any) => acc + item.sks, 0)} SKS</span>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => handleKrsApproval("REVISION")}>Minta Revisi</Button>
                <Button onClick={() => handleKrsApproval("APPROVED")}>Setujui KRS</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
