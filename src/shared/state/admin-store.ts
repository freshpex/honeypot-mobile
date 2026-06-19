import { create } from "zustand";
import { adminService, type AdminOverview } from "@/app/admin/services";
import type { Meal } from "@/app/meals/types";

export type AdminUserStatus = "Active" | "Paused" | "Suspended";
export type AdminOrderStatus =
  | "Confirmed"
  | "Preparing"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";
export type AdminLogLevel = "Info" | "Warning" | "Error";
export type AdminMealStatus = "Available" | "Hidden" | "Sold Out";

export type AdminMeal = Meal & {
  status: AdminMealStatus;
};

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  plan: string;
  role?: string;
  stats: {
    activeOrders: number;
    deliveredOrders: number;
    totalOrders: number;
    totalSpend: number;
  };
  status: AdminUserStatus;
};

export type AdminOrder = {
  id: string;
  reference?: string;
  customer: string;
  date: string;
  items: string;
  status: AdminOrderStatus;
  total: string;
  totalAmount?: number;
};

export type AdminLog = {
  id: string;
  actor: string;
  event: string;
  level: AdminLogLevel;
  time: string;
};

export type AdminSettings = {
  autoRenewals: boolean;
  deliveryAlerts: boolean;
  walletFunding: boolean;
};

type AdminState = {
  error?: string;
  exportMessage?: string;
  isLoading: boolean;
  logs: AdminLog[];
  meals: AdminMeal[];
  overview?: AdminOverview;
  orders: AdminOrder[];
  settings: AdminSettings;
  users: AdminUser[];
  addMeal: (meal: Omit<AdminMeal, "id">) => Promise<AdminMeal>;
  deleteMeal: (mealId: string) => Promise<void>;
  downloadLogs: () => string;
  loadAll: () => Promise<void>;
  loadLogs: () => Promise<void>;
  loadMeals: () => Promise<void>;
  loadOrders: () => Promise<void>;
  loadOverview: () => Promise<void>;
  loadSettings: () => Promise<void>;
  loadUsers: () => Promise<void>;
  toggleSetting: (key: keyof AdminSettings) => Promise<void>;
  toggleUserStatus: (userId: string) => Promise<void>;
  updateMeal: (mealId: string, meal: Partial<Omit<AdminMeal, "id">>) => Promise<void>;
  updateOrderStatus: (orderId: string, status: AdminOrderStatus) => Promise<void>;
};

export const ADMIN_PAGE_SIZE = 100;

const meals: AdminMeal[] = [];
const users: AdminUser[] = [];
const orders: AdminOrder[] = [];
const logs: AdminLog[] = [];

const nextUserStatus: Record<AdminUserStatus, AdminUserStatus> = {
  Active: "Suspended",
  Paused: "Active",
  Suspended: "Active",
};

export const useAdminStore = create<AdminState>((set, get) => ({
  error: undefined,
  isLoading: false,
  logs,
  meals,
  orders,
  settings: {
    autoRenewals: false,
    deliveryAlerts: false,
    walletFunding: false,
  },
  users,
  addMeal: async (meal) => {
    set({ error: undefined, isLoading: true });
    try {
      const newMeal = await adminService.createMeal(meal);
      set((state) => ({
        isLoading: false,
        meals: [newMeal, ...state.meals.filter((item) => item.id !== newMeal.id)],
      }));
      void get().loadLogs();
      void get().loadOverview();
      return newMeal;
    } catch (error) {
      set({ error: messageFromError(error), isLoading: false });
      throw error;
    }
  },
  deleteMeal: async (mealId) => {
    set({ error: undefined, isLoading: true });
    try {
      const hiddenMeal = await adminService.deleteMeal(mealId);
      set((state) => ({
        isLoading: false,
        meals: state.meals.map((item) => (item.id === mealId ? hiddenMeal : item)),
      }));
      void get().loadLogs();
      void get().loadOverview();
    } catch (error) {
      set({ error: messageFromError(error), isLoading: false });
      throw error;
    }
  },
  downloadLogs: () => {
    const csv = [
      "id,time,level,actor,event",
      ...get().logs.map((log) => `${log.id},${log.time},${log.level},${log.actor},${log.event}`),
    ].join("\n");

    set({ exportMessage: "Log export prepared from backend audit records." });
    return csv;
  },
  loadAll: async () => {
    await Promise.all([
      get().loadOverview(),
      get().loadUsers(),
      get().loadMeals(),
      get().loadOrders(),
      get().loadLogs(),
      get().loadSettings(),
    ]);
  },
  loadLogs: async () => {
    try {
      const response = await adminService.logs();
      set({ logs: response.items });
    } catch (error) {
      set({ error: messageFromError(error) });
    }
  },
  loadMeals: async () => {
    try {
      const response = await adminService.meals();
      set({ meals: response.items });
    } catch (error) {
      set({ error: messageFromError(error) });
    }
  },
  loadOrders: async () => {
    try {
      const response = await adminService.orders();
      set({ orders: response.items });
    } catch (error) {
      set({ error: messageFromError(error) });
    }
  },
  loadOverview: async () => {
    try {
      const overview = await adminService.overview();
      set({ overview });
    } catch (error) {
      set({ error: messageFromError(error) });
    }
  },
  loadSettings: async () => {
    try {
      set({ settings: await adminService.settings() });
    } catch (error) {
      set({ error: messageFromError(error) });
    }
  },
  loadUsers: async () => {
    try {
      const response = await adminService.users();
      set({ users: response.items });
    } catch (error) {
      set({ error: messageFromError(error) });
    }
  },
  toggleSetting: async (key) => {
    const nextValue = !get().settings[key];
    set((state) => ({ settings: { ...state.settings, [key]: nextValue } }));
    try {
      set({ settings: await adminService.updateSetting(key, nextValue) });
      void get().loadLogs();
    } catch (error) {
      set((state) => ({
        error: messageFromError(error),
        settings: { ...state.settings, [key]: !nextValue },
      }));
      throw error;
    }
  },
  toggleUserStatus: async (userId) => {
    const user = get().users.find((item) => item.id === userId);
    if (!user) return;
    const nextStatus = nextUserStatus[user.status];
    set((state) => ({
      users: state.users.map((item) =>
        item.id === userId ? { ...item, status: nextStatus } : item,
      ),
    }));
    try {
      const updated = await adminService.updateUserStatus(userId, nextStatus);
      set((state) => ({
        users: state.users.map((item) => (item.id === userId ? { ...item, ...updated } : item)),
      }));
      void get().loadLogs();
      void get().loadOverview();
    } catch (error) {
      set((state) => ({
        error: messageFromError(error),
        users: state.users.map((item) => (item.id === userId ? user : item)),
      }));
      throw error;
    }
  },
  updateMeal: async (mealId, meal) => {
    const previous = get().meals.find((item) => item.id === mealId);
    set((state) => ({
      meals: state.meals.map((item) => (item.id === mealId ? { ...item, ...meal } : item)),
    }));
    try {
      const updated = await adminService.updateMeal(mealId, meal);
      set((state) => ({
        meals: state.meals.map((item) => (item.id === mealId ? updated : item)),
      }));
      void get().loadLogs();
      void get().loadOverview();
    } catch (error) {
      set((state) => ({
        error: messageFromError(error),
        meals: previous
          ? state.meals.map((item) => (item.id === mealId ? previous : item))
          : state.meals,
      }));
      throw error;
    }
  },
  updateOrderStatus: async (orderId, status) => {
    const previous = get().orders.find((item) => item.id === orderId);
    set((state) => ({
      orders: state.orders.map((order) => (order.id === orderId ? { ...order, status } : order)),
    }));
    try {
      const updated = await adminService.updateOrderStatus(orderId, status);
      set((state) => ({
        orders: state.orders.map((order) => (order.id === orderId ? updated : order)),
      }));
      void get().loadLogs();
      void get().loadOverview();
    } catch (error) {
      set((state) => ({
        error: messageFromError(error),
        orders: previous
          ? state.orders.map((order) => (order.id === orderId ? previous : order))
          : state.orders,
      }));
      throw error;
    }
  },
}));

const messageFromError = (error: unknown) =>
  error instanceof Error ? error.message : "Admin service is unavailable.";
