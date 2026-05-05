import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { accreditation } from "@/lib/mock-data";
import { AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/_app/accreditation")({
  head: () => ({ meta: [{ title: "Akreditasi — SIAT" }] }),
  component: AccreditationPage,
});

function AccreditationPage() {
  const critical = accreditation.filter((a) => a.daysToAudit < 120);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tracker Akreditasi</h1>
        <p className="text-muted-foreground text-sm">Pantau status akreditasi & jadwal audit semua program studi</p>
      </div>

      {critical.length > 0 && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-4 flex gap-3">
          <AlertTriangle className="size-5 text-destructive shrink-0" />
          <div className="text-sm">
            <p className="font-semibold text-destructive">Audit mendekat (&lt; 120 hari)</p>
            <p className="text-muted-foreground">{critical.length} program studi memerlukan persiapan dokumen segera.</p>
          </div>
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead>Program Studi</TableHead><TableHead>Fakultas</TableHead><TableHead className="text-center">Peringkat</TableHead><TableHead>Berlaku s/d</TableHead><TableHead className="text-center">Hari ke Audit</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>
                {accreditation.map((a) => {
                  const isCritical = a.daysToAudit < 120;
                  return (
                    <TableRow key={a.program} className={isCritical ? "bg-destructive/5" : ""}>
                      <TableCell className="font-medium">{a.program}</TableCell>
                      <TableCell>{a.fakultas}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={a.grade === "Unggul" ? "default" : "secondary"}>{a.grade}</Badge>
                      </TableCell>
                      <TableCell>{a.expiry}</TableCell>
                      <TableCell className="text-center font-mono">{a.daysToAudit}</TableCell>
                      <TableCell>
                        {isCritical
                          ? <Badge variant="destructive">Persiapkan dokumen</Badge>
                          : <Badge variant="secondary">Aman</Badge>}
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
  );
}
