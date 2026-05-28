import { useQuery, type QueryKey } from "@tanstack/react-query";
import { adminService } from "../lib/admin-service";
import type { User } from "../lib/api";

export const USERS_QUERY_KEY = ["admin", "users"] as const;

export function useUsers() {
  return useQuery<User[], Error>({
    queryKey: USERS_QUERY_KEY,
    queryFn: () => adminService.getUsers(),
  });
}