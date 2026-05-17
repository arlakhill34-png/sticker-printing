import { createFileRoute, Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, LineChart, Search, X } from "lucide-react";
import { useAuth } from "../../lib/auth-context";
import { mockAnalytics } from "../../lib/mock-admin";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";

const NAV_ITEMS: { label: string; to: string }[] = [
  { label: "Dashboard", to: "/admin" },
  { label: "Users", to: "/admin/users" },
  { label: "Analytics", to: "/admin/analytics" },
  { label: "Login Logs", to: "/admin/logs" },
  { label: "Settings", to: "/admin/settings" },
];

const ccfg = {
  userGrowth: { label: "Registrations", color: "#1d4ed8" as const },
  activeSubs: { label: "Active Subs", color: "#059669" as const },
};

export const Route = createFileRoute("/admin/analytics")({
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const data = mockAnalytics;
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <AdminInner title="Analytics" subtitle="Subscription trends and user growth insights">
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Summary
            label="Total Active"
            value={data.totalActive}
            icon={BarChart3}
            color="bg-blue-500/10 text-blue-500"
            hint="blue-500"
          />
          <Summary
            label="Expiring Soon"
            value={data.expiringSoon}
            icon={TrendingUp}
            color="bg-amber-500/10 text-amber-500"
            hint="amber-500"
          />
          <Summary
            label="Active Subs"
            value={data.activeSubscriptions?.[data.activeSubscriptions.length - 1]?.count || 0}
            icon={LineChart}
            color="bg-emerald-500/10 text-emerald-500"
            hint="emerald-500"
          />
        </div>

        <TrendLine
          data={data.userGrowth}
          color="#1d4ed8"
          title="Registrations per Day"
          dataKey="userGrowth"
        />
        <TrendBar
          data={data.activeSubscriptions}
          color="#059669"
          title="Active Subscriptions Trend"
          dataKey="activeSubs"
        />
        <BrePie data={data.subscriptionBreakdown} />
      </div>
    </AdminInner>
  );
}

function Badge({
  children,
  variant,
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "outline";
  className?: string;
}) {
  const styles =
    variant === "outline"
      ? "bg-transparent border border-border text-foreground"
      : "bg-primary text-primary-foreground";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles} ${className || ""}`}
    >
      {children}
    </span>
  );
}

function Summary({
  label,
  value,
  icon: Icon,
  color,
  hint,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  hint: string;
}) {
  return (
    <Card className="rounded-xl border bg-card shadow-sm">
      <CardContent className="p-5 flex items-center gap-4">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </div>
          <div className="text-2xl font-bold tracking-tight">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function TrendLine({
  data,
  color,
  title,
  dataKey,
}: {
  data: { date: string; count: number }[];
  color: string;
  title: string;
  dataKey: string;
}) {
  return (
    <Card className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <CardHeader className="py-4">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer config={ccfg} className="h-72">
          <ChartStyle id={dataKey} config={ccfg} />
          <ResponsiveContainer width="100%" height="100%">
            <Line data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                tickFormatter={(v: string) => v.slice(5)}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                allowDecimals={false}
              />
              <ReTooltip content={<ChartTooltipContent hideLabel />} />
              <Line
                type="monotone"
                dataKey="count"
                stroke={`var(--color-${dataKey})`}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </Line>
          </ResponsiveContainer>
          <ChartLegend content={<ChartLegendContent />} />
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function TrendBar({
  data,
  color,
  title,
  dataKey,
}: {
  data: { date: string; count: number }[];
  color: string;
  title: string;
  dataKey: string;
}) {
  return (
    <Card className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <CardHeader className="py-4">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer config={ccfg} className="h-72">
          <ChartStyle id={dataKey} config={ccfg} />
          <ResponsiveContainer width="100%" height="100%">
            <Bar data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                tickFormatter={(v: string) => v.slice(5)}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                allowDecimals={false}
              />
              <ReTooltip content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="count" fill={`var(--color-${dataKey})`} radius={[4, 4, 0, 0]} />
            </Bar>
          </ResponsiveContainer>
          <ChartLegend content={<ChartLegendContent />} />
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function BrePie({ data }: { data: { name: string; value: number; fill: string }[] }) {
  return (
    <Card className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <CardHeader className="py-4">
        <CardTitle className="text-base font-semibold">Subscription Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer config={ccfg} className="h-64">
          <ChartStyle id="breakdown" config={ccfg} />
          <ResponsiveContainer width="100%" height="100%">
            <Pie data={data}>
              <ReTooltip />
              <Pie
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              />
            </Pie>
          </ResponsiveContainer>
          <ChartLegend content={<ChartLegendContent />} />
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function AdminInner({
  children,
  title,
  subtitle,
  actions,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  const location = useLocation();
  const { user } = useAuth();
  const { toggleSidebar, isMobile, openMobile, setOpenMobile } = useSidebar();

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
              useAuth().logout();
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
          {actions ? <div className="mb-4">{actions}</div> : null}
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
              onClick={() => {}}
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

export { Separator };
