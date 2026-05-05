import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const { role, ready } = useAuth();
  useEffect(() => {
    if (!ready) return;
    navigate({ to: role ? "/dashboard" : "/login" });
  }, [ready, role, navigate]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-muted-foreground">Memuat SIAT…</p>
    </div>
  );
}
