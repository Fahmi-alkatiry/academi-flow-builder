import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GraduationCap, Building2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import type { Role } from "@/lib/mock-data";
import { roleLabel } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — SIAT Universitas Madura" },
      { name: "description", content: "Masuk ke Sistem Informasi Akademik Terpadu Universitas Madura." },
    ],
  }),
  component: LoginPage,
});

const roles: Role[] = ["student", "lecturer", "admin", "staff"];

function LoginPage() {
  const { role: currentRole, ready, login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("student");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (ready && currentRole) navigate({ to: "/dashboard" });
  }, [ready, currentRole, navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Masukkan username dan password");
      return;
    }
    login(role);
    toast.success(`Selamat datang, ${roleLabel[role]}`);
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-sidebar text-sidebar-foreground">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-sidebar-primary grid place-items-center">
            <GraduationCap className="size-6 text-sidebar-primary-foreground" />
          </div>
          <div>
            <p className="font-semibold">SIAT</p>
            <p className="text-xs text-sidebar-foreground/70">Universitas Madura</p>
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold leading-tight">Sistem Informasi Akademik Terpadu</h1>
          <p className="mt-4 text-sidebar-foreground/80 max-w-md">
            Satu platform untuk mahasiswa, dosen, pimpinan, dan tenaga kependidikan — terintegrasi dengan PDDikti, SIMKEU, dan sistem legacy.
          </p>
        </div>
        <p className="text-xs text-sidebar-foreground/60">© {new Date().getFullYear()} Universitas Madura</p>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex lg:hidden items-center gap-2 mb-2">
              <Building2 className="size-5 text-primary" />
              <span className="font-semibold">SIAT Universitas Madura</span>
            </div>
            <CardTitle className="text-2xl">Masuk ke akun Anda</CardTitle>
            <CardDescription>Pilih peran lalu masukkan kredensial Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label>Peran</Label>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map((r) => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setRole(r)}
                      className={`text-sm rounded-md border px-3 py-2 text-left transition ${
                        role === r
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border hover:bg-accent"
                      }`}
                    >
                      {roleLabel[r]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username / NIM / NIDN</Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="contoh: 210411100123" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </div>
              <Button type="submit" className="w-full">Masuk</Button>
              <p className="text-xs text-center text-muted-foreground">Wireframe demo — kredensial apa pun diterima.</p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
