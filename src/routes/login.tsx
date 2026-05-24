import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth-context";
import { toastSuccess, toastError, getApiErrorMessage } from "../lib/toast";
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
      toastSuccess("Login successful");
      const redirectTo = res.data.user.role === "ADMIN" ? "/admin" : "/";
      navigate({ to: redirectTo });
    } catch (err) {
      const message = getApiErrorMessage(err);
      toastError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md border-border/60 bg-white shadow-lg">
        <CardHeader className="space-y-4 text-center pt-10 pb-8 px-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <LogIn className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Welcome Back</CardTitle>
          <CardDescription className="text-muted-foreground mx-auto">
            Sign in to continue your journey with us
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="emailOrPhone" className="text-sm font-medium text-foreground">
                Email or Phone
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="emailOrPhone"
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="Enter email or phone"
                  required
                  className="h-12 bg-background border border-border rounded-xl pl-11 text-foreground placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="h-12 bg-background border border-border rounded-xl pl-11 text-foreground placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-12 font-semibold text-base bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
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
  );
}
