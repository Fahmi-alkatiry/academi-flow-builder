import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { integrations } from "@/lib/mock-data";
import { RefreshCw, Network } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/integration")({
  head: () => ({ meta: [{ title: "Integrasi Sistem — SIAT" }] }),
  component: IntegrationPage,
});

const dot = { online: "bg-success", warning: "bg-warning", offline: "bg-destructive" } as const;
const label = { online: "Online", warning: "Lambat", offline: "Offline" } as const;

function IntegrationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Status Integrasi Sistem</h1>
        <p className="text-muted-foreground text-sm">Konektivitas dengan sistem legacy dan eksternal</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((i) => (
          <Card key={i.name}>
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Network className="size-4 text-primary" />
                  <span className="font-medium text-sm">{i.name}</span>
                </div>
                <span className={`size-2.5 rounded-full ${dot[i.status]}`} />
              </div>
              <p className="text-xs text-muted-foreground">{i.desc}</p>
              <div className="flex items-center justify-between text-xs">
                <Badge variant={i.status === "online" ? "secondary" : i.status === "warning" ? "outline" : "destructive"}>{label[i.status]}</Badge>
                <span className="text-muted-foreground">Sync: {i.lastSync}</span>
              </div>
              <Button size="sm" variant="outline" className="w-full" onClick={() => toast.success(`Sinkronisasi ${i.name} dimulai`)}>
                <RefreshCw className="size-3 mr-1" /> Sync Sekarang
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
