import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "../../lib/auth-context";
import { toastError, toastSuccess, getApiErrorMessage } from "../../lib/toast";
import { api } from "../../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Separator } from "../../components/ui/separator";
import { Badge } from "../../components/ui/badge";
import { AdminOuter } from "./-_admin-inner";

const NAV_ITEMS = [
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
    <AdminOuter title="Settings" subtitle="Manage your admin account and preferences" navItems={NAV_ITEMS}>
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
                window.location.href = "/login";
              }}
            >
              Sign Out Everywhere
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminOuter>
  );
}