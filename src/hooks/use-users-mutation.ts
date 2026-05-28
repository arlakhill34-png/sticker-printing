import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "../lib/admin-service";
import type { User } from "../lib/api";
import { USERS_QUERY_KEY } from "./use-users-query";
import { toastSuccess, toastError } from "../lib/toast";

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: "ACTIVE" | "BLOCKED" }) =>
      adminService.updateUserStatus(id, status),
    
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: USERS_QUERY_KEY });
      const previous = queryClient.getQueryData<User[]>(USERS_QUERY_KEY);
      queryClient.setQueryData<User[]>(USERS_QUERY_KEY, (old) =>
        old?.map(u => u.id === id ? { ...u, status } : u) ?? []
      );
      return { previous };
    },
    
    onError: (err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(USERS_QUERY_KEY, context.previous);
      }
      toastError("Failed to update status", {
        description: err instanceof Error ? err.message : "Unknown error"
      });
    },
    
    onSuccess: (_, variables) => {
      toastSuccess(variables.status === "ACTIVE" ? "User Activated" : "User Blocked");
    }
  });
}

export function useExtendSubscription() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, days }: { id: number; days: number }) =>
      adminService.extendSubscription(id, days),
    
    onMutate: async ({ id, days }) => {
      await queryClient.cancelQueries({ queryKey: USERS_QUERY_KEY });
      const previous = queryClient.getQueryData<User[]>(USERS_QUERY_KEY);
      const d = new Date();
      d.setDate(d.getDate() + days);
      const newExpiry = d.toISOString().split("T")[0];
      queryClient.setQueryData<User[]>(USERS_QUERY_KEY, (old) =>
        old?.map(u => u.id === id ? { ...u, subscriptionExpiry: newExpiry } : u) ?? []
      );
      return { previous };
    },
    
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(USERS_QUERY_KEY, context.previous);
      }
      toastError("Failed to extend subscription");
    },
    
    onSuccess: (_data, variables) => {
      toastSuccess("Subscription Extended", {
        description: `Extended by ${variables.days} days`
      });
    }
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => adminService.deleteUser(id),
    
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: USERS_QUERY_KEY });
      const previous = queryClient.getQueryData<User[]>(USERS_QUERY_KEY);
      queryClient.setQueryData<User[]>(USERS_QUERY_KEY, (old) =>
        old?.filter(u => u.id !== id) ?? []
      );
      return { previous };
    },
    
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(USERS_QUERY_KEY, context.previous);
      }
      toastError("Failed to delete user");
    },
    
    onSuccess: () => {
      toastSuccess("User Deleted");
    }
  });
}