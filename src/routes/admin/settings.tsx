import { createFileRoute, Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "../../lib/auth-context";
import { toastError, toastSuccess, getApiErrorMessage } from "../../lib/toast";
import { api } from "../../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "../../components/ui/sidebar";
import { Separator } from "../../components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";

const NAV_ITEMS: { label: string; to: string }[] = [
  { label: "Dashboard", to: "/admin" },
  { label: "Users", to: "/admin/users" },
  { label: "Analytics", to: "/admin/analytics" },
  { label: "Login Logs", to: "/admin/logs" },
  { label: "Settings", to: "/admin/settings" },
];

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { user, logout } = useAuth();
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!current || !newPass) {
      toastError("Missing fields", { description: "Please fill in all password fields." });
      return;
    }
    if (newPass !== confirm) {
      toastError("Mismatch", { description: "New passwords do not match." });
      return;
    }
    setSaving(true);
    try {
      await api.changePassword({ currentPassword: current, newPassword: newPass });
      toastSuccess("Password Updated", {
        description: "Your password has been successfully changed.",
      });
      setCurrent("");
      setNewPass("");
      setConfirm("");
    } catch (err) {
      const message = getApiErrorMessage(err);
      toastError("Error", { description: message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminInner title="Settings" subtitle="Manage your admin account and preferences">
      <div className="space-y-6 max-w-2xl">
        {/* Profile card */}
        <Card className="rounded-xl border bg-card shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Profile</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary text-lg font-bold">
                {user?.companyName?.[0]?.toUpperCase() || "A"}
              </div>
              <div>
                <div className="font-semibold">{user?.companyName}</div>
                <div className="text-xs text-muted-foreground">{user?.companyEmail}</div>
                <div className="mt-1">
                  <Badge
                    variant={user?.role === "ADMIN" ? "default" : "outline"}
                    className="text-[11px]"
                  >
                    {user?.role}
                  </Badge>
                </div>
              </div>
            </div>
            <Card className="rounded-lg border bg-muted/40">
              <CardContent className="p-3 text-xs text-muted-foreground">
                <div className="flex justify-between py-1">
                  <span>Phone</span>
                  <span className="font-medium text-foreground">{user?.phoneNumber || "—"}</span>
                </div>
                <Separator className="my-1.5" />
                <div className="flex justify-between py-1">
                  <span>User ID</span>
                  <span className="font-medium text-foreground">#{user?.id}</span>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Password card */}
        <Card className="rounded-xl border bg-card shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Change Password</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Current Password</Label>
              <Input
                type="password"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                placeholder="Enter current password"
                className="mt-1.5 h-9"
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">New Password</Label>
              <Input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="Enter new password"
                className="mt-1.5 h-9"
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">
                Confirm New Password
              </Label>
              <Input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Re-enter new password"
                className="mt-1.5 h-9"
              />
            </div>
            <Button onClick={handleSave} disabled={saving} className="mt-1">
              {saving ? "Saving…" : "Update Password"}
            </Button>
          </CardContent>
        </Card>

        {/* Danger zone */}
        <Card className="rounded-xl border border-destructive/30 bg-destructive/5 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-destructive">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-3">
              Sign out of your admin session on this device and all active sessions.
            </p>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                logout();
                nave("login");
              }}
            >
              Sign Out Everywhere
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminInner>
  );
}

function AdminInner({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { isMobile, openMobile, setOpenMobile } = useSidebar();

  function nave(path: string) {
    window.location.href = path;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      {isMobile && openMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setOpenMobile(false)}
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-in-out md:hidden ${openMobile ? "translate-x-0" : "-translate-x-full"}`}
      >
        <MobileNav />
      </div>

      <Sidebar className="hidden md:flex bg-sidebar border-sidebar-border">
        <SidebarHeader className="px-3 py-4">
          <SidebarBrand />
        </SidebarHeader>
        <Separator className="mx-2 bg-sidebar-border" />
        <SidebarContent className="px-2 py-3">
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-sidebar-foreground/45">
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV_ITEMS.map(({ label, to }) => {
                  const active =
                    location.pathname === to ||
                    (to !== "/admin" && location.pathname.startsWith(to));
                  return (
                    <SidebarMenuItem key={to}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={label}
                        className="text-[13px]"
                      >
                        <Link to={to}>{label}</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="px-2 py-3">
          <Separator className="mb-2 mx-1 bg-sidebar-border" />
          <button
            onClick={() => {
              logout();
              navigate({ to: "/login" });
            }}
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
              />
            </svg>
            Log out
          </button>
        </SidebarFooter>
      </Sidebar>

      <main className="min-h-screen bg-background md:ml-64">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 backdrop-blur-md px-4 md:hidden">
          <button
            onClick={() => setOpenMobile(true)}
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted"
            aria-label="Open sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
          <span className="text-sm font-semibold tracking-tight">Admin Panel</span>
        </header>
        <div className="hidden items-center gap-2 border-b border-border px-6 py-2.5 md:flex bg-muted/30">
          <SidebarTrigger className="h-8 w-8" />
          <Separator className="h-5" orientation="vertical" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </span>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">
          {subtitle ? <p className="mb-2 text-sm text-muted-foreground">{subtitle}</p> : null}
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}

function SidebarBrand() {
  return (
    <Link to="/admin" className="flex items-center gap-2 px-1">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
          />
        </svg>
      </div>
      <div className="leading-tight">
        <div className="text-sm font-bold tracking-tight text-sidebar-foreground">LabelFlow</div>
        <div className="text-[10px] text-sidebar-foreground/60 uppercase tracking-wider">
          Admin Panel
        </div>
      </div>
    </Link>
  );
}

function MobileNav() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <nav className="flex flex-col h-full p-3">
      <SidebarBrand />
      <Separator className="bg-sidebar-border mt-2" />
      <div className="flex-1 py-3 space-y-1">
        {NAV_ITEMS.map(({ label, to }) => {
          const active =
            location.pathname === to || (to !== "/admin" && location.pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              onClick={() => setOpenMobile(false)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                ${active ? "bg-primary/15 text-primary font-medium" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"}
              `}
            >
              {label}
            </Link>
          );
        })}
      </div>
      <div className="pt-3 border-t border-sidebar-border">
        <button
          onClick={() => {
            logout();
            navigate({ to: "/login" });
          }}
          className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
            />
          </svg>
          Log out
        </button>
      </div>
    </nav>
  );
}
