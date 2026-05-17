import type { AdminUsersResponse, AnalyticsData, LoginLog, User } from "./api";

/** Stub data used while the backend is unavailable. */
const TODAY = new Date();

export const mockUsers: User[] = [
  {
    id: 1,
    companyName: "ABC Traders",
    companyEmail: "abc@gmail.com",
    phoneNumber: "9800000000",
    role: "USER",
    status: "ACTIVE",
    subscriptionExpiry: new Date(TODAY.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    subscriptionStatus: "ACTIVE",
    createdAt: "2025-01-15T00:00:00",
  },
  {
    id: 2,
    companyName: "XYZ Mart",
    companyEmail: "xyz@gmail.com",
    phoneNumber: "9700000000",
    role: "USER",
    status: "ACTIVE",
    subscriptionExpiry: new Date(TODAY.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    subscriptionStatus: "EXPIRING_SOON",
    createdAt: "2025-03-22T00:00:00",
  },
  {
    id: 3,
    companyName: "Lima Products",
    companyEmail: "lima@gmail.com",
    phoneNumber: "9600000000",
    role: "USER",
    status: "BLOCKED",
    subscriptionExpiry: new Date(TODAY.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    subscriptionStatus: "ACTIVE",
    createdAt: "2025-02-10T00:00:00",
  },
  {
    id: 4,
    companyName: "Delta Stores",
    companyEmail: "delta@gmail.com",
    phoneNumber: "9500000000",
    role: "USER",
    status: "ACTIVE",
    subscriptionExpiry: new Date(TODAY.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    subscriptionStatus: "EXPIRED",
    createdAt: "2025-04-05T00:00:00",
  },
  {
    id: 5,
    companyName: "Nova Shop",
    companyEmail: "nova@gmail.com",
    phoneNumber: "9400000000",
    role: "USER",
    status: "PENDING",
    subscriptionExpiry: new Date(TODAY.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    subscriptionStatus: "ACTIVE",
    createdAt: "2025-05-10T00:00:00",
  },
  {
    id: 6,
    companyName: "Elite Mart",
    companyEmail: "elite@gmail.com",
    phoneNumber: "9300000000",
    role: "USER",
    status: "ACTIVE",
    subscriptionExpiry: new Date(TODAY.getTime() + 120 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    subscriptionStatus: "ACTIVE",
    createdAt: "2025-05-12T00:00:00",
  },
];

export function getMockUsers(): AdminUsersResponse {
  return {
    success: true,
    message: "Users fetched successfully",
    data: mockUsers,
    timestamp: new Date().toISOString(),
  };
}

export const mockLoginLogs: LoginLog[] = [
  {
    id: 1,
    companyName: "ABC Traders",
    companyEmail: "abc@gmail.com",
    loginTime: new Date(TODAY.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    ipAddress: "192.168.1.101",
    deviceInfo: "Chrome / Windows 11",
    status: "SUCCESS",
  },
  {
    id: 2,
    companyName: "XYZ Mart",
    companyEmail: "xyz@gmail.com",
    loginTime: new Date(TODAY.getTime() - 4 * 60 * 60 * 1000).toISOString(),
    ipAddress: "192.168.1.102",
    deviceInfo: "Safari / macOS",
    status: "SUCCESS",
  },
  {
    id: 3,
    companyName: "Lima Products",
    companyEmail: "lima@gmail.com",
    loginTime: new Date(TODAY.getTime() - 8 * 60 * 60 * 1000).toISOString(),
    ipAddress: "10.0.0.5",
    deviceInfo: "Firefox / Ubuntu",
    status: "FAILED",
  },
  {
    id: 4,
    companyName: "Delta Stores",
    companyEmail: "delta@gmail.com",
    loginTime: new Date(TODAY.getTime() - 24 * 60 * 60 * 1000).toISOString(),
    ipAddress: "172.16.0.3",
    deviceInfo: "Chrome / Android",
    status: "SUCCESS",
  },
  {
    id: 5,
    companyName: "Nova Shop",
    companyEmail: "nova@gmail.com",
    loginTime: new Date(TODAY.getTime() - 48 * 60 * 60 * 1000).toISOString(),
    ipAddress: "192.168.1.105",
    deviceInfo: "Edge / Windows 11",
    status: "SUCCESS",
  },
];

export const mockAnalytics: AnalyticsData = {
  totalActive: mockUsers.filter((u) => u.status === "ACTIVE").length,
  expiringSoon: mockUsers.filter((u) => u.subscriptionStatus === "EXPIRING_SOON").length,
  userGrowth: Array.from({ length: 14 }, (_, i) => {
    const d = new Date(TODAY);
    d.setDate(d.getDate() - 13 + i);
    return { date: d.toISOString().split("T")[0], count: 2 + Math.floor(Math.random() * 8) };
  }),
  activeSubscriptions: Array.from({ length: 14 }, (_, i) => {
    const d = new Date(TODAY);
    d.setDate(d.getDate() - 13 + i);
    return { date: d.toISOString().split("T")[0], count: 4 + Math.floor(Math.random() * 6) };
  }),
  subscriptionBreakdown: [
    { name: "Active", value: mockUsers.filter((u) => u.subscriptionStatus === "ACTIVE").length, fill: "#1d4ed8" },
    { name: "Expiring Soon", value: mockUsers.filter((u) => u.subscriptionStatus === "EXPIRING_SOON").length, fill: "#d97706" },
    { name: "Expired", value: mockUsers.filter((u) => u.subscriptionStatus === "EXPIRED").length, fill: "#dc2626" },
  ],
};

export const mockStats = {
  total: mockUsers.length,
  active: mockUsers.filter((u) => u.status === "ACTIVE").length,
  blocked: mockUsers.filter((u) => u.status === "BLOCKED").length,
  expired: mockUsers.filter((u) => u.subscriptionStatus === "EXPIRED").length,
  pending: mockUsers.filter((u) => u.status === "PENDING").length,
};
