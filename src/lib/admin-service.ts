import { api } from "./api";
import type { User } from "./api";

export const adminService = {
  getUsers: (): Promise<User[]> => 
    api.getAdminUsers().then(res => res.data),

  updateUserStatus: (id: number, status: "ACTIVE" | "BLOCKED"): Promise<User> =>
    api.updateUserStatus(id, status).then(res => ({ ...res.data, status } as User)),

  extendSubscription: (id: number, days: number): Promise<string> =>
    api.extendSubscription(id, days).then(res => res.data.subscriptionExpiry),

  deleteUser: (id: number): Promise<number> =>
    api.deleteUser(id).then(() => id),
};