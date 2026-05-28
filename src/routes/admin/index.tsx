import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Users, BarChart3, ScrollText, Users2, TrendingUp, Settings } from "lucide-react";
import { mockStats } from "../../lib/mock-admin";
import { Card, CardContent } from "../../components/ui/card";
import { AdminOuter, AdminInner } from "./-_admin-inner";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/admin", icon: Users },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Analytics", to: "/admin/analytics", icon: BarChart3 },
  { label: "Login Logs", to: "/admin/logs", icon: ScrollText },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

export { AdminInner };

export const Route = createFileRoute("/admin/")({
  component: DashboardPage,
  lazy: true,
});

function DashboardPage() {
  const cards = useMemo(
    () => [
      {
        title: "Total Users",
        value: mockStats.total,
        color: "bg-blue-500/10 text-blue-500",
        icon: Users,
      },
      {
        title: "Active Users",
        value: mockStats.active,
        color: "bg-emerald-500/10 text-emerald-500",
        icon: Users2,
      },
      {
        title: "Blocked Users",
        value: mockStats.blocked,
        color: "bg-red-500/10 text-red-500",
        icon: BarChart3,
      },
      {
        title: "Expired Users",
        value: mockStats.expired,
        color: "bg-amber-500/10 text-amber-500",
        icon: ScrollText,
      },
      {
        title: "Pending Users",
        value: mockStats.pending,
        color: "bg-indigo-500/10 text-indigo-500",
        icon: TrendingUp,
      },
    ],
    [],
  );

  return (
    <AdminOuter title="Dashboard" subtitle="System overview at a glance" navItems={NAV_ITEMS}>
      <div className="space-y-6">
        <div className="mb-1">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {cards.map((c) => (
            <Card
              key={c.title}
              className="rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md"
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {c.title}
                  </span>
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
            {
              to: "/admin/analytics",
              label: "Analytics",
              desc: "Business insights",
              Icon: BarChart3,
            },
            { to: "/admin/logs", label: "Login Logs", desc: "Access history", Icon: ScrollText },
            { to: "/admin/settings", label: "Settings", desc: "Account & system", Icon: Settings },
          ].map(({ to, label, desc, Icon }) => (
            <Link
              key={to}
              to={to}
              className="group flex items-center gap-3.5 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-sm text-card-foreground"
            >
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
    </AdminOuter>
  );
}