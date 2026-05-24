import { useAuth } from "./auth-context";
import { ADMIN_ROLE, isAdmin } from "./permissions";
import { useNavigate } from "@tanstack/react-router";

/**
 * Custom hook to check if current user is admin
 */
export function useIsAdmin(): boolean {
  const { user } = useAuth();
  return !!user && isAdmin(user.role);
}

/**
 * Custom hook to check if current user is regular user
 */
export function useIsUser(): boolean {
  const { user } = useAuth();
  return !!user && !isAdmin(user.role);
}

/**
 * Custom hook to get current user role
 */
export function useUserRole(): "ADMIN" | "USER" | null {
  const { user } = useAuth();
  return user?.role ?? null;
}

/**
 * Custom hook to get current user
 */
export function useCurrentUser() {
  const { user } = useAuth();
  return user;
}

/**
 * Sync guard helper — checks a role string, does NOT call hooks.
 * Use this inside useEffect, beforeLoad, etc.
 * @throws if not authenticated/authorized
 */
export function requireAdminByRole(userRole: string | undefined): asserts userRole is "ADMIN" {
  if (!userRole || !isAdmin(userRole)) {
    throw new Error("Forbidden – Admin access required");
  }
}

/**
 * Route guard for admin-only routes
 * Redirects non-admins to home page
 * Pure function — safe to call from beforeLoad/useEffect.
 */
export function requireAdminSync(userRole: string | undefined): asserts userRole is "ADMIN" {
  if (!userRole) {
    throw new Error("Unauthenticated");
  }
  if (!isAdmin(userRole)) {
    throw new Error("FORBIDDEN: Redirect to home");
  }
}

/**
 * Route guard for user-only routes
 * Redirects admins to admin dashboard
 * Pure function — safe to call from beforeLoad/useEffect.
 */
export function requireUserSync(
  userRole: string | undefined,
): asserts userRole is Exclude<string, "ADMIN"> {
  if (!userRole) {
    throw new Error("Unauthenticated");
  }
  if (isAdmin(userRole)) {
    throw new Error("REDIRECT_ADMIN: Redirect to admin");
  }
}

/**
 * Custom hook for admin route protection with redirect
 * Can be called from component scope (not beforeLoad).
 */
export function useAdminGuard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // If not authenticated, redirect to login
  if (!user) {
    navigate({ to: "/login" });
    return null;
  }

  // If not admin, redirect to home
  if (!isAdmin(user.role)) {
    navigate({ to: "/" });
    return null;
  }

  return user;
}

/**
 * Custom hook for user route protection with redirect
 * Can be called from component scope (not beforeLoad).
 */
export function useUserGuard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // If not authenticated, redirect to login
  if (!user) {
    navigate({ to: "/login" });
    return null;
  }

  // If admin, redirect to admin dashboard
  if (isAdmin(user.role)) {
    navigate({ to: "/admin" });
    return null;
  }

  return user;
}
