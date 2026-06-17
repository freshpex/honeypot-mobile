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

const meals: AdminMeal[] = [
  {
    id: "avocado-toast-eggs",
    name: "Avocado Toast & Eggs",
    category: "Breakfast",
    description: "Whole grain toast topped with smashed avocado, poached eggs...",
    detailDescription:
      "Whole grain toast topped with smashed avocado, poached eggs and chilli flakes",
    imageUrl:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80",
    calories: 380,
    protein: 18,
    carbs: 28,
    fat: 22,
    price: 2800,
    status: "Available",
    tags: ["vegetarian"],
  },
  {
    id: "fresh-fruit-bowl",
    name: "Fresh Fruit Bowl",
    category: "Breakfast",
    description: "Seasonal fresh fruits with granola, yogurt and a drizzle of raw honey",
    detailDescription:
      "Seasonal fresh fruits with granola, yogurt and a drizzle of raw honey",
    imageUrl:
      "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=900&q=80",
    calories: 250,
    protein: 8,
    carbs: 39,
    fat: 8,
    price: 1800,
    status: "Available",
    tags: ["vegetarian", "weight loss"],
  },
  {
    id: "green-detox-smoothie",
    name: "Green Detox Smoothie",
    category: "Smoothies",
    description: "Fresh spinach, banana, ginger, apple and lemon blended to perfection",
    detailDescription:
      "Fresh spinach, banana, ginger, apple and lemon blended to perfection",
    imageUrl:
      "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=900&q=80",
    calories: 180,
    protein: 5,
    carbs: 34,
    fat: 3,
    price: 1500,
    status: "Available",
    tags: ["vegan", "weight loss"],
  },
  {
    id: "grilled-chicken-vegetables",
    name: "Grilled Chicken & Vegetables",
    category: "Lunch",
    description: "Juicy grilled chicken breast served with seasonal roasted vegetables...",
    detailDescription:
      "Juicy grilled chicken breast served with seasonal roasted vegetables and lemon",
    imageUrl:
      "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=80",
    calories: 420,
    protein: 34,
    carbs: 20,
    fat: 18,
    price: 3500,
    status: "Available",
    tags: ["high protein", "low carb"],
  },
];

const users: AdminUser[] = [
  {
    email: "enoch.megatransact@gmail.com",
    id: "usr-enoch",
    name: "Enoch",
    plan: "Basic",
    stats: { activeOrders: 1, deliveredOrders: 0, totalOrders: 1, totalSpend: 4300 },
    status: "Active",
  },
  {
    email: "ada@honeypot.app",
    id: "usr-ada",
    name: "Ada Okafor",
    plan: "Standard",
    stats: { activeOrders: 1, deliveredOrders: 0, totalOrders: 1, totalSpend: 3600 },
    status: "Paused",
  },
  {
    email: "wale@honeypot.app",
    id: "usr-wale",
    name: "Wale Bello",
    plan: "Premium",
    stats: { activeOrders: 0, deliveredOrders: 1, totalOrders: 1, totalSpend: 25000 },
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

const createLog = (event: string, level: AdminLogLevel = "Info"): AdminLog => ({
  actor: "admin@honeypot.app",
  event,
  id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  level,
  time: "Now",
});

export const useAdminStore = create<AdminState>((set, get) => ({
  error: undefined,
  isLoading: false,
  logs,
  meals,
  orders,
  settings: {
    autoRenewals: true,
    deliveryAlerts: true,
    walletFunding: false,
  },
  users,
  addMeal: async (meal) => {
    set({ error: undefined, isLoading: true });
    try {
      const newMeal = await adminService.createMeal(meal);
      set((state) => ({
        isLoading: false,
        logs: [createLog(`Added meal ${newMeal.name}`), ...state.logs],
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
        logs: [createLog(`Deleted meal ${hiddenMeal.name}`, "Warning"), ...state.logs],
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
        logs: [createLog(`Updated meal ${updated.name}`), ...state.logs],
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
        logs: [createLog(`Changed order ${updated.reference} to ${status}`, "Warning"), ...state.logs],
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
