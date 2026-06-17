import { create } from "zustand";
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
  meals: AdminMeal[];
  orders: AdminOrder[];
  settings: AdminSettings;
  users: AdminUser[];
  addMeal: (meal: Omit<AdminMeal, "id">) => AdminMeal;
  deleteMeal: (mealId: string) => void;
  downloadLogs: () => string;
  toggleSetting: (key: keyof AdminSettings) => void;
  toggleUserStatus: (userId: string) => void;
  updateMeal: (mealId: string, meal: Partial<Omit<AdminMeal, "id">>) => void;
  updateOrderStatus: (orderId: string, status: AdminOrderStatus) => void;
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

const createLog = (event: string, level: AdminLogLevel = "Info"): AdminLog => ({
  actor: "admin@honeypot.app",
  event,
  id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  level,
  time: "Now",
});

export const useAdminStore = create<AdminState>((set, get) => ({
  logs,
  meals,
  orders,
  settings: {
    autoRenewals: true,
    deliveryAlerts: true,
    walletFunding: false,
  },
  users,
  addMeal: (meal) => {
    const slug = meal.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const newMeal: AdminMeal = {
      ...meal,
      id: `meal-${slug || Date.now()}-${Date.now()}`,
    };
    set((state) => ({
      logs: [createLog(`Added meal ${newMeal.name}`), ...state.logs],
      meals: [newMeal, ...state.meals],
    }));
    return newMeal;
  },
  deleteMeal: (mealId) =>
    set((state) => {
      const meal = state.meals.find((item) => item.id === mealId);
      return {
        logs: meal ? [createLog(`Deleted meal ${meal.name}`, "Warning"), ...state.logs] : state.logs,
        meals: state.meals.filter((item) => item.id !== mealId),
      };
    }),
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
  updateMeal: (mealId, meal) =>
    set((state) => ({
      logs: [
        createLog(`Updated meal ${state.meals.find((item) => item.id === mealId)?.name ?? mealId}`),
        ...state.logs,
      ],
      meals: state.meals.map((item) => (item.id === mealId ? { ...item, ...meal } : item)),
    })),
  updateOrderStatus: (orderId, status) =>
    set((state) => ({
      logs: [createLog(`Changed order ${orderId} to ${status}`, "Warning"), ...state.logs],
      orders: state.orders.map((order) => (order.id === orderId ? { ...order, status } : order)),
    })),
}));
