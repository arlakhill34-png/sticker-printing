import { createFileRoute, Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { Users, BarChart3, ScrollText, Users2, TrendingUp } from "lucide-react";
import { mockStats } from "../../lib/mock-admin";
import {
  Card, CardContent,
} from "../../components/ui/card";

export const Route = createFileRoute("/admin/")({
  component: DashboardRoot,
});

function DashboardRoot() {
  const cards = useMemo(() => [
    { title: "Total Users",   value: mockStats.total,   color: "bg-blue-500/10 text-blue-500",   icon: Users },
    { title: "Active Users",  value: mockStats.active,  color: "bg-emerald-500/10 text-emerald-500", icon: Users2 },
    { title: "Blocked Users", value: mockStats.blocked, color: "bg-red-500/10 text-red-500",   icon: BarChart3 },
    { title: "Expired Users", value: mockStats.expired, color: "bg-amber-500/10 text-amber-500", icon: ScrollText },
    { title: "Pending Users", value: mockStats.pending, color: "bg-indigo-500/10 text-indigo-500", icon: TrendingUp },
  ], []);

  return (
    <AdminInner title="Dashboard" subtitle="System overview at a glance">
      <div className="space-y-6">
        <div className="mb-1">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {cards.map((c) => (
            <Card key={c.title} className="rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{c.title}</span>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${c.color}`}>
                    <c.icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-2.5 text-3xl font-bold tracking-tight">{c.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-2">
          {[
            { to: "/admin/users", label: "Users", desc: "Manage all companies", Icon: Users },
            { to: "/admin/analytics", label: "Analytics", desc: "Business insights", Icon: BarChart3 },
            { to: "/admin/logs", label: "Login Logs", desc: "Access history", Icon: ScrollText },
            { to: "/admin/settings", label: "Settings", desc: "Account & system", Icon: Settings },
          ].map(({ to, label, desc, Icon }) => (
            <Link key={to} to={to} className="group flex items-center gap-3.5 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-sm text-card-foreground">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Icon className="h-4.5 w-4.5" />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold">{label}</div>
                <div className="text-[11px] text-muted-foreground">{desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AdminInner>
  );
}

import { Settings } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter,
  SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar,
} from "../../components/ui/sidebar";
import { Separator } from "../../components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { useAuth } from "../../lib/auth-context";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Toaster } from "../../components/ui/sonner";
import { toast } from "sonner";

const NAV_ITEMS: { label: string; to: string; Icon: React.ElementType }[] = [
  { label: "Dashboard", to: "/admin", Icon: Users },
  { label: "Users", to: "/admin/users", Icon: Users },
  { label: "Analytics", to: "/admin/analytics", Icon: BarChart3 },
  { label: "Login Logs", to: "/admin/logs", Icon: ScrollText },
  { label: "Settings", to: "/admin/settings", Icon: Settings },
];

function AdminInner({ children, title, subtitle, actions }: { children: React.ReactNode; title: string; subtitle?: string; actions?: React.ReactNode }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toggleSidebar, isMobile, openMobile, setOpenMobile } = useSidebar();

  function SidebarBrand() {
    return (
      <Link to="/admin" className="flex items-center gap-2 px-1">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"/></svg>
        </div>
        <div className="leading-tight">
          <div className="text-sm font-bold tracking-tight text-sidebar-foreground">LabelFlow</div>
          <div className="text-[10px] text-sidebar-foreground/60 uppercase tracking-wider">Admin Panel</div>
        </div>
      </Link>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      {isMobile && openMobile && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setOpenMobile(false)} />
      )}
      <SidebarDrawer />
      <Sidebar className="hidden md:flex bg-sidebar border-sidebar-border">
        <SidebarHeader className="px-3 py-4"><SidebarBrand /></SidebarHeader>
        <Separator className="mx-2 bg-sidebar-border" />
        <SidebarContent className="px-2 py-3">
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-sidebar-foreground/45">Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV_ITEMS.map(({ label, to, Icon }) => {
                  const active = location.pathname === to || (to !== "/admin" && location.pathname.startsWith(to));
                  return (
                    <SidebarMenuItem key={to}>
                      <SidebarMenuButton asChild isActive={active} tooltip={label} className="text-[13px]">
                        <Link to={to}><Icon className="h-4 w-4" /><span>{label}</span></Link>
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
          <UserDropdown />
        </SidebarFooter>
      </Sidebar>

      <main className="min-h-screen bg-background md:ml-64">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 backdrop-blur-md px-4 md:hidden">
          <button onClick={() => setOpenMobile(true)} className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted" aria-label="Open sidebar">
            <Users className="h-5 w-5" />
          </button>
          <span className="text-sm font-semibold tracking-tight">Admin Panel</span>
        </header>
        <div className="hidden items-center gap-2 border-b border-border px-6 py-2.5 md:flex bg-muted/30">
          <SidebarTrigger className="h-8 w-8" />
          <Separator orientation="vertical" className="h-5" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</span>
          {actions && <div className="ml-auto">{actions}</div>}
        </div>
        {actions && <div className="flex items-center gap-2 border-b border-border px-4 py-3 md:hidden">{actions}</div>}
        <div className="p-4 sm:p-6 lg:p-8">{subtitle ? <p className="mb-2 text-sm text-muted-foreground">{subtitle}</p> : null}{children}</div>
      </main>

      <Toaster position="top-right" richColors closeButton />
    </SidebarProvider>
  );

  function SidebarDrawer() {
    return (
      <>
        {isMobile && openMobile && (
          <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setOpenMobile(false)} />
        )}
        <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-in-out md:hidden ${openMobile ? "translate-x-0" : "-translate-x-full"}`}>
          <nav className="flex flex-col h-full">
            <div className="flex items-center gap-2 p-3">
              <SidebarBrand />
            </div>
            <Separator className="bg-sidebar-border" />
            <div className="flex-1 py-3 space-y-1 px-1">
              {NAV_ITEMS.map(({ label, to, Icon }) => {
                const active = location.pathname === to || (to !== "/admin" && location.pathname.startsWith(to));
                return (
                  <Link key={to} to={to} onClick={() => setOpenMobile(false)}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                      ${active ? "bg-primary/15 text-primary font-medium" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"}
                    `}>
                    <Icon className="h-4 w-4" /> {label}
                  </Link>
                );
              })}
            </div>
            <div className="p-3 pt-0 border-t border-sidebar-border">
              <button onClick={() => { logout(); navigate({ to: "/login" }); }}
                className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"/></svg>
                Log out
              </button>
            </div>
          </nav>
        </div>
      </>
    );
  }

  function UserDropdown() {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex w-full items-center gap-2 rounded-lg p-2 text-left text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/15 text-primary text-xs font-semibold">
                {user?.companyName?.[0]?.toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 leading-tight">
              <div className="truncate text-[13px] font-medium">{user?.companyName || "Admin"}</div>
              <div className="truncate text-[11px] text-sidebar-foreground/55">{user?.companyEmail || ""}</div>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="start" className="w-52">
          <DropdownMenuLabel className="text-xs">Signed in as</DropdownMenuLabel>
          <DropdownMenuLabel className="text-xs font-normal text-sidebar-foreground/55">{user?.companyEmail}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-xs cursor-pointer" onSelect={() => navigate({ to: "/admin/settings" })}>
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-xs text-destructive focus:text-destructive cursor-pointer"
            onSelect={() => { logout(); navigate({ to: "/login" }); }}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
}

export { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarTrigger, useSidebar, Toaster };
