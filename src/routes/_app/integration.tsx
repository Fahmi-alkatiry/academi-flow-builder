import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Network } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/integration")({
  head: () => ({ meta: [{ title: "Integrasi Sistem — SIAT" }] }),
  component: IntegrationPage,
});

const dot = { online: "bg-success", warning: "bg-warning", offline: "bg-destructive" } as const;
const label = { online: "Online", warning: "Lambat", offline: "Offline" } as const;

function IntegrationPage() {
  const [integrationsList, setIntegrationsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadIntegrations() {
    try {
      const data = await apiFetch<any[]>("/api/integrations");
      setIntegrationsList(data);
    } catch (err: any) {
      toast.error("Gagal memuat status integrasi: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadIntegrations();
  }, []);

  const triggerSync = async (name: string) => {
    toast.info(`Sinkronisasi ${name} sedang diproses...`);
    try {
      await apiFetch(`/api/integrations/${encodeURIComponent(name)}/sync`, {
        method: "POST"
      });
      toast.success(`Sinkronisasi ${name} berhasil diselesaikan.`);
      loadIntegrations();
    } catch (err: any) {
      toast.error(`Gagal melakukan sinkronisasi ${name}: ` + err.message);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Memuat status integrasi…</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Status Integrasi Sistem</h1>
        <p className="text-muted-foreground text-sm">Konektivitas dengan sistem legacy dan eksternal</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrationsList.map((i) => (
          <Card key={i.name}>
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Network className="size-4 text-primary" />
                  <span className="font-medium text-sm">{i.name}</span>
                </div>
                <span className={`size-2.5 rounded-full ${dot[i.status as keyof typeof dot]}`} />
              </div>
              <p className="text-xs text-muted-foreground">{i.desc}</p>
              <div className="flex items-center justify-between text-xs">
                <Badge variant={i.status === "online" ? "secondary" : i.status === "warning" ? "outline" : "destructive"}>
                  {label[i.status as keyof typeof label]}
                </Badge>
                <span className="text-muted-foreground">Sync: {i.lastSync}</span>
              </div>
              <Button size="sm" variant="outline" className="w-full" onClick={() => triggerSync(i.name)}>
                <RefreshCw className="size-3 mr-1" /> Sync Sekarang
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
