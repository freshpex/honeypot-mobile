import { create } from "zustand";

export type AdminUserStatus = "Active" | "Paused" | "Suspended";
export type AdminOrderStatus = "Confirmed" | "Preparing" | "Out for Delivery" | "Delivered" | "Cancelled";
export type AdminLogLevel = "Info" | "Warning" | "Error";

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  plan: string;
  status: AdminUserStatus;
};

export type AdminOrder = {
  id: string;
  customer: string;
  date: string;
  items: string;
  status: AdminOrderStatus;
  total: string;
};

export type AdminLog = {
  id: string;
  actor: string;
  event: string;
  level: AdminLogLevel;
  time: string;
};

type AdminSettings = {
  autoRenewals: boolean;
  deliveryAlerts: boolean;
  walletFunding: boolean;
};

type AdminState = {
  exportMessage?: string;
  logs: AdminLog[];
  orders: AdminOrder[];
  settings: AdminSettings;
  users: AdminUser[];
  downloadLogs: () => string;
  toggleSetting: (key: keyof AdminSettings) => void;
  toggleUserStatus: (userId: string) => void;
  updateOrderStatus: (orderId: string, status: AdminOrderStatus) => void;
};

const users: AdminUser[] = [
  {
    email: "enoch.megatransact@gmail.com",
    id: "usr-enoch",
    name: "Enoch",
    plan: "Basic",
    status: "Active",
  },
  {
    email: "ada@honeypot.app",
    id: "usr-ada",
    name: "Ada Okafor",
    plan: "Standard",
    status: "Paused",
  },
  {
    email: "wale@honeypot.app",
    id: "usr-wale",
    name: "Wale Bello",
    plan: "Premium",
    status: "Active",
  },
];

const orders: AdminOrder[] = [
  {
    customer: "Enoch",
    date: "Jun 16, 2026",
    id: "#HP-MQGX3ZJL",
    items: "Avocado Toast & Eggs x1",
    status: "Confirmed",
    total: "₦4,300",
  },
  {
    customer: "Ada Okafor",
    date: "Jun 16, 2026",
    id: "#HP-DEL-4182",
    items: "Fresh Fruit Bowl x2",
    status: "Preparing",
    total: "₦3,600",
  },
  {
    customer: "Wale Bello",
    date: "Jun 15, 2026",
    id: "#HP-SUB-7001",
    items: "Basic plan renewal",
    status: "Delivered",
    total: "₦25,000",
  },
];

const logs: AdminLog[] = [
  {
    actor: "system",
    event: "Subscription renewal reminder queued",
    id: "log-001",
    level: "Info",
    time: "09:12 AM",
  },
  {
    actor: "admin@honeypot.app",
    event: "Changed order #HP-DEL-4182 to Preparing",
    id: "log-002",
    level: "Warning",
    time: "09:18 AM",
  },
  {
    actor: "payments",
    event: "Wallet funding is disabled until backend launch",
    id: "log-003",
    level: "Info",
    time: "09:25 AM",
  },
];

const nextUserStatus: Record<AdminUserStatus, AdminUserStatus> = {
  Active: "Suspended",
  Paused: "Active",
  Suspended: "Active",
};

export const useAdminStore = create<AdminState>((set, get) => ({
  logs,
  orders,
  settings: {
    autoRenewals: true,
    deliveryAlerts: true,
    walletFunding: false,
  },
  users,
  downloadLogs: () => {
    const csv = [
      "id,time,level,actor,event",
      ...get().logs.map((log) => `${log.id},${log.time},${log.level},${log.actor},${log.event}`),
    ].join("\n");

    set({ exportMessage: "Log export prepared locally. Backend download can replace this action." });
    return csv;
  },
  toggleSetting: (key) =>
    set((state) => ({
      settings: {
        ...state.settings,
        [key]: !state.settings[key],
      },
    })),
  toggleUserStatus: (userId) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === userId ? { ...user, status: nextUserStatus[user.status] } : user,
      ),
    })),
  updateOrderStatus: (orderId, status) =>
    set((state) => ({
      logs: [
        {
          actor: "admin@honeypot.app",
          event: `Changed order ${orderId} to ${status}`,
          id: `log-${Date.now()}`,
          level: "Warning",
          time: "Now",
        },
        ...state.logs,
      ],
      orders: state.orders.map((order) => (order.id === orderId ? { ...order, status } : order)),
    })),
}));
