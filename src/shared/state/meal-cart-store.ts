import { create } from "zustand";
import { ordersService } from "@/app/orders/services";
import type { CartMeal, CartResponse } from "@/app/orders/types";

export type CartItem = {
  id?: string;
  lineTotal?: number;
  meal: CartMeal;
  quantity: number;
};

type MealCartState = {
  error?: string;
  isSyncing: boolean;
  items: CartItem[];
  addMeal: (meal: CartMeal, quantity?: number) => Promise<void>;
  clearCart: () => Promise<void>;
  decrementMeal: (mealId: string) => Promise<void>;
  incrementMeal: (mealId: string) => Promise<void>;
  loadCart: () => Promise<void>;
  removeMeal: (mealId: string) => Promise<void>;
};

const itemsFromCart = (cart: CartResponse): CartItem[] =>
  cart.items.map((item) => ({
    id: item.id,
    lineTotal: item.lineTotal,
    meal: item.meal,
    quantity: item.quantity,
  }));

export const useMealCartStore = create<MealCartState>((set, get) => ({
  isSyncing: false,
  items: [],
  addMeal: async (meal, quantity = 1) => {
    set({ error: undefined, isSyncing: true });
    try {
      const cart = await ordersService.addCartItem(meal.id, quantity);
      set({ isSyncing: false, items: itemsFromCart(cart) });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Unable to add meal.", isSyncing: false });
    }
  },
  clearCart: async () => {
    set({ error: undefined, isSyncing: true });
    try {
      await ordersService.clearCart();
      set({ isSyncing: false, items: [] });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Unable to clear cart.", isSyncing: false });
    }
  },
  decrementMeal: async (mealId) => {
    const item = get().items.find((cartItem) => cartItem.meal.id === mealId);
    if (!item) return;
    const nextQuantity = item.quantity - 1;
    set({ error: undefined, isSyncing: true });
    try {
      const cart =
        nextQuantity <= 0
          ? await ordersService.updateCartItem(mealId, 0)
          : await ordersService.updateCartItem(mealId, nextQuantity);
      set({ isSyncing: false, items: itemsFromCart(cart) });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Unable to update cart.", isSyncing: false });
    }
  },
  incrementMeal: async (mealId) => {
    const item = get().items.find((cartItem) => cartItem.meal.id === mealId);
    if (!item) return;
    set({ error: undefined, isSyncing: true });
    try {
      const cart = await ordersService.updateCartItem(mealId, item.quantity + 1);
      set({ isSyncing: false, items: itemsFromCart(cart) });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Unable to update cart.", isSyncing: false });
    }
  },
  loadCart: async () => {
    set({ error: undefined, isSyncing: true });
    try {
      const cart = await ordersService.getCart();
      set({ isSyncing: false, items: itemsFromCart(cart) });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Unable to load cart.", isSyncing: false });
    }
  },
  removeMeal: async (mealId) => {
    set({ error: undefined, isSyncing: true });
    try {
      const cart = await ordersService.updateCartItem(mealId, 0);
      set({ isSyncing: false, items: itemsFromCart(cart) });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Unable to remove meal.", isSyncing: false });
    }
  },
}));

export const formatNaira = (amount: number) =>
  `₦${new Intl.NumberFormat("en-NG", { maximumFractionDigits: 0 }).format(amount)}`;

export const getCartItemCount = (items: CartItem[]) =>
  items.reduce((total, item) => total + item.quantity, 0);

export const getCartSubtotal = (items: CartItem[]) =>
  items.reduce((total, item) => total + item.meal.price * item.quantity, 0);

export const DELIVERY_FEE = 1500;
