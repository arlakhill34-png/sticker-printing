import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, TrendingUp, LineChart } from "lucide-react";
import { useAuth } from "../../lib/auth-context";
import { mockAnalytics } from "../../lib/mock-admin";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { AdminOuter } from "./-_admin-inner";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "../../components/ui/chart";
import {
  ResponsiveContainer,
  Line,
  Bar,
  Pie,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

const NAV_ITEMS = [
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
  lazy: true,
});

function AnalyticsPage() {
  const data = mockAnalytics;

  return (
    <AdminOuter title="Analytics" subtitle="Subscription trends and user growth insights" navItems={NAV_ITEMS}>
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
    </AdminOuter>
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
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
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
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
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
          <ResponsiveContainer width="100%" height="100%">
            <Pie data={data}>
              <ChartTooltip />
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