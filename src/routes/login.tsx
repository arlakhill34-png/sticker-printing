import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth-context";
import { showSuccessToast, showErrorToast } from "../lib/toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Mail, Lock, LogIn, Loader2 } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.login({ emailOrPhone, password });

      if (!res?.data?.token) {
        throw new Error("Invalid login response: token missing");
      }

      login(res.data.token, res.data.user);
      showSuccessToast("Login successful", { duration: 2500 });
      setTimeout(() => navigate({ to: "/" }), 1000);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Invalid credentials";
      showErrorToast(message, { duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] px-4 py-8">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-card/70 backdrop-blur-xl bg-opacity-60 border border-white/10">
          <CardHeader className="space-y-4 text-center pb-8">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/40">
              <LogIn className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold text-white">Welcome Back</CardTitle>
            <CardDescription className="text-muted-foreground/80 max-w-xl mx-auto">
              Sign in to continue your journey with us
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-3">
                <Label htmlFor="emailOrPhone" className="block text-sm font-medium text-white mb-1">
                  Email or Phone
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                  <Input
                    id="emailOrPhone"
                    type="text"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="Enter email or phone"
                    required
                    className="pl-11 h-12 bg-background/30 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white/10 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="password" className="block text-sm font-medium text-white mb-1">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    className="pl-11 h-12 bg-background/30 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white/10 transition-all"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-12 font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
            <div className="pt-4 text-center text-sm">
              <span className="text-muted-foreground/70">Don't have an account? </span>
              <button
                onClick={() => navigate({ to: "/register" })}
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Register
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}