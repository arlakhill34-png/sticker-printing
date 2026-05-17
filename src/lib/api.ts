const TOKEN_KEY = "token";

/** Read the stored JWT token from localStorage. */
export function getToken(): string | null {
  const token = localStorage.getItem(TOKEN_KEY);
  return token;
}

/** Persist the JWT token to localStorage. */
export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/** Remove the JWT token from localStorage. */
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/** Build an authenticated fetch header set. */
function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * Low-level helper that always attaches Authorization when a token is stored.
 * Any endpoint added in this module should use this instead of raw fetch().
 */
async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(url, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers as HeadersInit) },
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const API_BASE = "https://sticker-backend-b88c.onrender.com/api";

/** Standard response envelope returned by the Spring backend. */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface User {
  id: number;
  companyName: string;
  companyEmail: string;
  phoneNumber: string;
  role: "ADMIN" | "USER";
  status: "ACTIVE" | "BLOCKED" | "PENDING";
  subscriptionExpiry: string;
  subscriptionStatus: string;
  createdAt: string;
}

export interface AdminUsersResponse {
  success: boolean;
  message: string;
  data: User[];
  timestamp: string;
}

export interface StatusUpdateResponse {
  success: boolean;
  message: string;
  data: { id: number; status: string };
  timestamp: string;
}

export interface ExtendResponse {
  success: boolean;
  message: string;
  data: { id: number; subscriptionExpiry: string };
  timestamp: string;
}

export interface LoginLog {
  id: number;
  companyName: string;
  companyEmail: string;
  loginTime: string;
  ipAddress: string;
  deviceInfo: string;
  status: "SUCCESS" | "FAILED";
}

export interface AnalyticsData {
  totalActive: number;
  expiringSoon: number;
  userGrowth: { date: string; count: number }[];
  activeSubscriptions: { date: string; count: number }[];
  subscriptionBreakdown: { name: string; value: number; fill: string }[];
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
  data: null;
  timestamp: string;
}

export interface RegisterData {
  companyName: string;
  companyEmail: string;
  phoneNumber: string;
  password: string;
}

export interface LoginData {
  emailOrPhone: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export const api = {
  register: async (data: RegisterData): Promise<LoginResponse> => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody?.message || "Registration failed");
    }
    const response = await res.json();
    return response;
  },

  login: async (data: LoginData): Promise<LoginResponse> => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody?.message || "Login failed");
    }
    const response = await res.json();
    return response;
  },

  getMe: async (): Promise<User> => {
    const response = await apiFetch<ApiResponse<User>>(`${API_BASE}/user/me`);
    return response.data;
  },

  // ─── ADMIN ───────────────────────────────────────────────

  /** GET /api/admin/users */
  getAdminUsers: async (): Promise<AdminUsersResponse> => {
    const response = await apiFetch<AdminUsersResponse>(`${API_BASE}/admin/users`);
    return response;
  },

  /** PUT /api/admin/users/:id/status */
  updateUserStatus: async (id: number, status: string): Promise<StatusUpdateResponse> => {
    const response = await apiFetch<StatusUpdateResponse>(
      `${API_BASE}/admin/users/${id}/status`,
      {
        method: "PUT",
        body: JSON.stringify({ status }),
      }
    );
    return response;
  },

  /** PUT /api/admin/users/:id/extend */
  extendSubscription: async (id: number, days: number): Promise<ExtendResponse> => {
    const response = await apiFetch<ExtendResponse>(
      `${API_BASE}/admin/users/${id}/extend`,
      {
        method: "PUT",
        body: JSON.stringify({ days }),
      }
    );
    return response;
  },

  /** DELETE /api/admin/users/:id */
  deleteUser: async (id: number): Promise<{ success: boolean; message: string; data: null; timestamp: string }> => {
    const response = await apiFetch<{ success: boolean; message: string; data: null; timestamp: string }>(
      `${API_BASE}/admin/users/${id}`,
      { method: "DELETE" }
    );
    return response;
  },

  /** GET /api/admin/analytics */
  getAnalytics: async (): Promise<ApiResponse<AnalyticsData>> => {
    const response = await apiFetch<ApiResponse<AnalyticsData>>(`${API_BASE}/admin/analytics`);
    return response;
  },

  /** GET /api/admin/login-logs */
  getLoginLogs: async (): Promise<ApiResponse<LoginLog[]>> => {
    const response = await apiFetch<ApiResponse<LoginLog[]>>(`${API_BASE}/admin/login-logs`);
    return response;
  },

  /** PUT /api/admin/profile/password */
  changePassword: async (data: ChangePasswordData): Promise<ChangePasswordResponse> => {
    const response = await apiFetch<ChangePasswordResponse>(
      `${API_BASE}/admin/profile/password`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
    return response;
  },
};
