import { createFileRoute, Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Search, X, MoreVertical } from "lucide-react";
import { useState, useMemo } from "react";
import { useAuth } from "../../lib/auth-context";
import { mockUsers } from "../../lib/mock-admin";
import type { User } from "../../lib/api";
import { toastSuccess, toastInfo } from "../../lib/toast";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Separator } from "../../components/ui/separator";
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
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { AdminInner } from "./index";

export const Route = createFileRoute("/admin/users")({
  component: UsersPage,
});

const NAV_ITEMS: { label: string; to: string; Icon: React.ElementType }[] = [
  {
    label: "Dashboard",
    to: "/admin",
    Icon: (p: any) => (
      <svg
        {...p}
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
          d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12"
        />
      </svg>
    ),
  },
  {
    label: "Users",
    to: "/admin/users",
    Icon: (p: any) => (
      <svg
        {...p}
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
          d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Z"
        />
      </svg>
    ),
  },
  {
    label: "Analytics",
    to: "/admin/analytics",
    Icon: (p: any) => (
      <svg
        {...p}
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
          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
        />
      </svg>
    ),
  },
  {
    label: "Login Logs",
    to: "/admin/logs",
    Icon: (p: any) => (
      <svg
        {...p}
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
          d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    ),
  },
  {
    label: "Settings",
    to: "/admin/settings",
    Icon: (p: any) => (
      <svg
        {...p}
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
          d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
      </svg>
    ),
  },
];

type StatusFilter = "all" | "ACTIVE" | "BLOCKED" | "PENDING" | User["status"];

function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [confirmDialog, setConfirmDialog] = useState<{
    type: "block" | "unblock" | "delete";
    user: User;
  } | null>(null);
  const [extendDialog, setExtendDialog] = useState<{ user: User; days: number } | null>(null);

  const search = searchInput.trim();
  const filtered = useMemo(
    () =>
      users.filter(
        (u) =>
          (!search ||
            u.companyName.toLowerCase().includes(search.toLowerCase()) ||
            u.companyEmail.toLowerCase().includes(search.toLowerCase())) &&
          (statusFilter === "all" || u.status === statusFilter),
      ),
    [users, search, statusFilter],
  );

  const statusBadge: Record<"ACTIVE" | "BLOCKED" | "PENDING", string> = {
    ACTIVE: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    BLOCKED: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    PENDING: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  };
  const statusDot: Record<"ACTIVE" | "BLOCKED" | "PENDING", string> = {
    ACTIVE: "bg-emerald-500",
    BLOCKED: "bg-red-500",
    PENDING: "bg-amber-500",
  };

  const actionsBar = (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1 max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search company or email…"
          className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-8 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/15"
        />
        {searchInput && (
          <button
            onClick={() => {
              setSearchInput("");
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <div className="hidden min-w-0 items-center gap-1 overflow-x-auto sm:flex">
        {(["all", "ACTIVE", "BLOCKED", "PENDING"] as StatusFilter[]).map((s) => (
          <button
            key={s}
            onClick={() => {
              setStatusFilter(s);
              setSearchInput("");
            }}
            className={`
            h-8 shrink-0 px-3 rounded-full text-xs font-medium border transition-all
            ${statusFilter === s && !search ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border hover:bg-muted"}
          `}
          >
            {s === "all" ? "All" : s}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <AdminInner
      title="User Management"
      subtitle="Manage all registered companies and subscriptions"
      actions={actionsBar}
    >
      <div className="space-y-6">
        {/* Mobile status pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto sm:hidden pb-1">
          {(["all", "ACTIVE", "BLOCKED", "PENDING"] as StatusFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setSearchInput("");
              }}
              className={`
              h-8 shrink-0 px-3 rounded-full text-xs font-medium border whitespace-nowrap transition-all
              ${statusFilter === s && !search ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border hover:bg-muted"}
            `}
            >
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>

        {/* Table */}
        <Card className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[160px] px-4 py-3">Company</TableHead>
                    <TableHead className="min-w-[200px] px-4 py-3">Email</TableHead>
                    <TableHead className="min-w-[120px] px-4 py-3">Phone</TableHead>
                    <TableHead className="min-w-[100px] px-4 py-3">Status</TableHead>
                    <TableHead className="min-w-[120px] px-4 py-3">Sub Expiry</TableHead>
                    <TableHead className="min-w-[80px] px-4 py-3">Role</TableHead>
                    <TableHead className="text-right px-4 py-3">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((user) => {
                    const badgeCls = `${statusBadge[user.status] || ""} inline-flex items-center gap-1.5`;
                    return (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium px-4 py-3">{user.companyName}</TableCell>
                        <TableCell className="text-xs text-muted-foreground px-4 py-3">
                          {user.companyEmail}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground px-4 py-3">
                          {user.phoneNumber}
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <Badge variant="outline" className={badgeCls}>
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${statusDot[user.status] || "bg-gray-400"}`}
                            />
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground px-4 py-3">
                          {user.subscriptionExpiry}
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <Badge
                            variant={user.role === "ADMIN" ? "default" : "outline"}
                            className="text-xs"
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-right">
                          <UserActionsDropdown
                            user={user}
                            onBlock={() => setConfirmDialog({ type: "block", user })}
                            onUnblock={() => setConfirmDialog({ type: "unblock", user })}
                            onExtend={(u, d) => setExtendDialog({ user: u, days: d })}
                            onDelete={() => setConfirmDialog({ type: "delete", user })}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="py-12 text-center text-sm text-muted-foreground"
                      >
                        No users match your current filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Confirm / Extend dialogs */}
        <Dialog
          open={!!confirmDialog && confirmDialog?.type !== "delete"}
          onOpenChange={() => setConfirmDialog(null)}
        >
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-base">
                {confirmDialog?.type === "block" ? "Block User" : "Unblock User"}
              </DialogTitle>
              <DialogDescription className="text-sm">
                {confirmDialog?.type === "block"
                  ? `Block access for ${confirmDialog?.user.companyName}?`
                  : `Restore access for ${confirmDialog?.user.companyName}?`}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 flex-row justify-end">
              <Button variant="outline" size="sm" onClick={() => setConfirmDialog(null)}>
                Cancel
              </Button>
              <Button
                variant={confirmDialog?.type === "block" ? "destructive" : "default"}
                size="sm"
                onClick={applyConfirm}
              >
                {confirmDialog?.type === "block" ? "Block" : "Unblock"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={!!extendDialog} onOpenChange={() => setExtendDialog(null)}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-base">Extend Subscription</DialogTitle>
              <DialogDescription className="text-sm">
                Extend <strong>{extendDialog?.user.companyName}</strong>'s subscription.
              </DialogDescription>
            </DialogHeader>
            <div className="my-3">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Days to extend
              </label>
              <input
                type="number"
                min={1}
                max={365}
                value={extendDialog?.days || 30}
                onChange={(e) => {
                  const v = Math.max(1, Math.min(365, parseInt(e.target.value || "30", 10)));
                  if (extendDialog) setExtendDialog({ ...extendDialog, days: v });
                }}
                className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm outline-none focus:border-ring"
              />
            </div>
            <DialogFooter className="gap-2 flex-row justify-end">
              <Button variant="outline" size="sm" onClick={() => setExtendDialog(null)}>
                Cancel
              </Button>
              <Button size="sm" onClick={applyExtend}>
                Extend
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={!!confirmDialog && confirmDialog?.type === "delete"}
          onOpenChange={() => setConfirmDialog(null)}
        >
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-base text-destructive">Delete User</DialogTitle>
              <DialogDescription className="text-sm">
                Permanently delete <strong>{confirmDialog?.user.companyName}</strong>? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 flex-row justify-end">
              <Button variant="outline" size="sm" onClick={() => setConfirmDialog(null)}>
                Cancel
              </Button>
              <Button variant="destructive" size="sm" onClick={applyDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminInner>
  );
}

function UserActionsDropdown({
  user,
  onBlock,
  onUnblock,
  onExtend,
  onDelete,
}: {
  user: User;
  onBlock: (u: User) => void;
  onUnblock: (u: User) => void;
  onExtend: (u: User, days: number) => void;
  onDelete: (u: User) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Actions"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem
          className="text-xs"
          onSelect={() => toastInfo("Details", { description: `Viewing ${user.companyName}` })}
        >
          View Details
        </DropdownMenuItem>
        {user.status === "ACTIVE" ? (
          <DropdownMenuItem
            className="text-xs text-red-500 focus:text-red-500"
            onSelect={() => onBlock(user)}
          >
            Block User
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            className="text-xs text-emerald-500 focus:text-emerald-500"
            onSelect={() => onUnblock(user)}
          >
            Unblock User
          </DropdownMenuItem>
        )}
        <DropdownMenuItem className="text-xs" onSelect={() => onExtend(user, 30)}>
          Extend Subscription
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-xs text-destructive focus:text-destructive"
          onSelect={() => onDelete(user)}
        >
          Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { Separator, Avatar, AvatarFallback, Button, Badge, useAuth };

function applyConfirm() {
  if (!confirmDialog) return;
  const { type, user } = confirmDialog;
  setUsers((prev) =>
    prev.map((u) => ({
      ...u,
      status: type === "block" ? ("BLOCKED" as const) : ("ACTIVE" as const),
    })),
  );
  toastSuccess(type === "block" ? "User Blocked" : "User Unblocked", {
    description: `${user.companyName} has been ${type === "block" ? "blocked" : "unblocked"}.`,
  });
  setConfirmDialog(null);
}

function applyExtend() {
  if (!extendDialog) return;
  const d = new Date();
  d.setDate(d.getDate() + extendDialog.days);
  setUsers((prev) =>
    prev.map((u) =>
      u.id === extendDialog.user.id
        ? { ...u, subscriptionExpiry: d.toISOString().split("T")[0] }
        : u,
    ),
  );
  toastSuccess("Subscription Extended", {
    description: `${extendDialog.user.companyName} extended by ${extendDialog.days} days.`,
  });
  setExtendDialog(null);
}

function applyDelete() {
  if (!confirmDialog) return;
  setUsers((prev) => prev.filter((u) => u.id !== confirmDialog.user.id));
  toastSuccess("User Deleted", { description: `${confirmDialog.user.companyName} removed.` });
  setConfirmDialog(null);
}
