import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GraduationCap, Building2, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
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

function LoginPage() {
  const { role: currentRole, ready, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (ready && currentRole) navigate({ to: "/dashboard" });
  }, [ready, currentRole, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Masukkan username dan password");
      return;
    }
    try {
      const u = await login(username.trim(), password);
      toast.success(`Selamat datang, ${u.name}`);
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      toast.error(err.message || "Gagal masuk");
    }
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
            <CardDescription>Masukkan username dan password untuk masuk ke sistem</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username / NIM / NIDN</Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="contoh: 210411100123" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="••••••••" 
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full">Masuk</Button>
              <p className="text-xs text-center text-muted-foreground">Password default untuk akun mahasiswa/dosen baru adalah 123456.</p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

