import { createFileRoute } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Separator, Avatar, AvatarFallback } from "../../components/ui/separator";
import {
  Sidebar, SidebarContent, SidebarFooter,
  SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar,
} from "../../components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";
import { mockLoginLogs } from "../../lib/mock-admin";
import { useAuth } from "../../lib/auth-context";
import { Toaster } from "../../components/ui/sonner";
import { toast } from "sonner";

const NAV_ITEMS: { label: string; to: string; }[] = [
  { label: "Dashboard",  to: "/admin" },
  { label: "Users",      to: "/admin/users" },
  { label: "Analytics",  to: "/admin/analytics" },
  { label: "Login Logs", to: "/admin/logs" },
  { label: "Settings",   to: "/admin/settings" },
];

export const Route = createFileRoute("/admin/logs")({
  component: LogsPage,
});

function LogsPage() {
  const logs = mockLoginLogs;
  const [searchInput, setSearchInput] = useState("");
  const { user, logout } = useAuth();

  const filtered = useMemo(() => logs.filter(
    (l) =>
      !searchInput.trim() ||
      l.companyName.toLowerCase().includes(searchInput.trim().toLowerCase()) ||
      l.companyEmail.toLowerCase().includes(searchInput.trim().toLowerCase()) ||
      l.ipAddress.includes(searchInput.trim()) ||
      l.deviceInfo.toLowerCase().includes(searchInput.trim().toLowerCase())
  ), [logs, searchInput]);

  function fmt(iso: string) {
    const d = new Date(iso);
    return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  const actionsBar = (
    <div className="relative max-w-xs">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search logs…"
        className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-8 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/15"
      />
      {searchInput && (
        <button onClick={() => setSearchInput("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );

  return (
    <AdminInner title="Login Logs" subtitle="Track all user access events across the system" actions={actionsBar}>
      <div className="space-y-6">
        <Card className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[160px] px-4">Company</TableHead>
                    <TableHead className="min-w-[200px] px-4">Email</TableHead>
                    <TableHead className="min-w-[160px] px-4">Login Time</TableHead>
                    <TableHead className="min-w-[130px] px-4">IP Address</TableHead>
                    <TableHead className="min-w-[180px] px-4">Device</TableHead>
                    <TableHead className="min-w-[100px] px-4">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium text-sm px-4 py-3">{log.companyName}</TableCell>
                      <TableCell className="text-xs text-muted-foreground px-4 py-3">{log.companyEmail}</TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap px-4 py-3">{fmt(log.loginTime)}</TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground px-4 py-3">{log.ipAddress}</TableCell>
                      <TableCell className="text-xs text-muted-foreground px-4 py-3">{log.deviceInfo}</TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={
                            log.status === "SUCCESS"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                              : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                          }
                        >
                          {log.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">No login records found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminInner>
  );
}

function AdminInner({ children, title, subtitle, actions }: { children: React.ReactNode; title: string; subtitle?: string; actions?: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  useAuth();
  const { toggleSidebar, isMobile, openMobile, setOpenMobile } = useSidebar();

  return (
    <SidebarProvider defaultOpen={true}>
      {/* Mobile drawer */}
      {isMobile && openMobile && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setOpenMobile(false)} />
      )}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-in-out md:hidden ${openMobile ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full p-3">
          <div className="flex items-center gap-2 px-1 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"/></svg>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold tracking-tight">LabelFlow</div>
              <div className="text-[10px] text-sidebar-foreground/60 uppercase tracking-wider">Admin Panel</div>
            </div>
          </div>
          <Separator className="bg-sidebar-border" />
          <nav className="flex-1 py-3 space-y-1">
            {NAV_ITEMS.map(({ label, to }) => {
              const active = location.pathname === to || (to !== "/admin" && location.pathname.startsWith(to));
              return (
                <Link key={to} to={to} onClick={() => setOpenMobile(false)} className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                  ${active ? "bg-primary/15 text-primary font-medium" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"}
                `}>{label}</Link>
              );
            })}
          </nav>
          <div className="pt-3 border-t border-sidebar-border">
            <button onClick={() => { logout(); navigate({ to: "/login" }); }} className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"/></svg>
              Log out
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <Sidebar className="hidden md:flex bg-sidebar border-sidebar-border">
        <SidebarHeader className="px-3 py-4">
          <Link to="/admin" className="flex items-center gap-2 px-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"/></svg>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold tracking-tight text-sidebar-foreground">LabelFlow</div>
              <div className="text-[10px] text-sidebar-foreground/60 uppercase tracking-wider">Admin Panel</div>
            </div>
          </Link>
        </SidebarHeader>
        <Separator className="mx-2 bg-sidebar-border" />
        <SidebarContent className="px-2 py-3">
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-sidebar-foreground/45">Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV_ITEMS.map(({ label, to }) => {
                  const active = location.pathname === to || (to !== "/admin" && location.pathname.startsWith(to));
                  return (
                    <SidebarMenuItem key={to}>
                      <SidebarMenuButton asChild isActive={active} tooltip={label} className="text-[13px]">
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
          <button onClick={() => { logout(); navigate({ to: "/login" }); }} className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"/></svg>
            Log out
          </button>
        </SidebarFooter>
      </Sidebar>

      <main className="min-h-screen bg-background md:ml-64">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 backdrop-blur-md px-4 md:hidden">
          <button onClick={() => setOpenMobile(true)} className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted" aria-label="Open sidebar">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/></svg>
          </button>
          <span className="text-sm font-semibold tracking-tight">Admin Panel</span>
        </header>
        <div className="hidden items-center gap-2 border-b border-border px-6 py-2.5 md:flex bg-muted/30">
          <SidebarTrigger className="h-8 w-8" />
          <Separator className="h-5" orientation="vertical" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</span>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">
          {subtitle ? <p className="mb-2 text-sm text-muted-foreground">{subtitle}</p> : null}
          {actions ? <div className="mb-4">{actions}</div> : null}
          {children}
        </div>
      </main>
      <Toaster position="top-right" richColors closeButton />
    </SidebarProvider>
  );
}
