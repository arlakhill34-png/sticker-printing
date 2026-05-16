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

export const API_BASE = "http://localhost:8090/api";

/** Standard response envelope returned by the Spring backend. */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface User {
  id: string;
  companyName: string;
  companyEmail: string;
  phoneNumber: string;
  role: string;
  subscriptionStatus: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
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

export const api = {
  register: async (data: RegisterData): Promise<LoginResponse> => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Registration failed");
    const response = await res.json();
    return response;
  },

  login: async (data: LoginData): Promise<LoginResponse> => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Login failed");
    const response = await res.json();
    return response;
  },

  getMe: async (): Promise<User> => {
    const response = await apiFetch<ApiResponse<User>>(`${API_BASE}/user/me`);
    return response.data;
  },
};
