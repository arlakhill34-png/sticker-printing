import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { AdminOuter } from "./-_admin-inner";
import { mockLoginLogs } from "../../lib/mock-admin";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/admin" },
  { label: "Users", to: "/admin/users" },
  { label: "Analytics", to: "/admin/analytics" },
  { label: "Login Logs", to: "/admin/logs" },
  { label: "Settings", to: "/admin/settings" },
];

export const Route = createFileRoute("/admin/logs")({
  component: LogsPage,
  lazy: true,
});

function LogsPage() {
  const logs = mockLoginLogs;
  const [searchInput, setSearchInput] = useState("");

  const filtered = useMemo(
    () =>
      logs.filter(
        (l) =>
          !searchInput.trim() ||
          l.companyName.toLowerCase().includes(searchInput.trim().toLowerCase()) ||
          l.companyEmail.toLowerCase().includes(searchInput.trim().toLowerCase()) ||
          l.ipAddress.includes(searchInput.trim()) ||
          l.deviceInfo.toLowerCase().includes(searchInput.trim().toLowerCase()),
      ),
    [logs, searchInput],
  );

  function fmt(iso: string) {
    const d = new Date(iso);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
        <button
          onClick={() => setSearchInput("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );

  return (
    <AdminOuter
      title="Login Logs"
      subtitle="Track all user access events across the system"
      actions={actionsBar}
      navItems={NAV_ITEMS}
    >
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
                      <TableCell className="font-medium text-sm px-4 py-3">
                        {log.companyName}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground px-4 py-3">
                        {log.companyEmail}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap px-4 py-3">
                        {fmt(log.loginTime)}
                      </TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground px-4 py-3">
                        {log.ipAddress}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground px-4 py-3">
                        {log.deviceInfo}
                      </TableCell>
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
                      <TableCell
                        colSpan={6}
                        className="py-12 text-center text-sm text-muted-foreground"
                      >
                        No login records found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminOuter>
  );
}