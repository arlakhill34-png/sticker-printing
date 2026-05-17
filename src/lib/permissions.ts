import { useAuth } from "./auth-context";

export const ADMIN_ROLE = "ADMIN" as const;

export function isAdmin(role: string): boolean {
  return role === ADMIN_ROLE;
}

export function requireAdmin(userRole: string): asserts userRole is "ADMIN" {
  if (!isAdmin(userRole)) {
    throw new Error("Forbidden – Admin access required");
  }
}

/** Hook that throws if the current user is not an admin. */
export function useRequireAdmin() {
  const { user } = useAuth();
  if (!user) throw new Error("Not authenticated");
  requireAdmin(user.role);
  return user;
}
