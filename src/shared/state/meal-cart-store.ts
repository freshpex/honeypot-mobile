import { create } from "zustand";
import type { Meal } from "@/app/meals/types/meal";

export type CartItem = {
  meal: Meal;
  quantity: number;
};

type MealCartState = {
  items: CartItem[];
  addMeal: (meal: Meal, quantity?: number) => void;
  decrementMeal: (mealId: string) => void;
  incrementMeal: (mealId: string) => void;
  removeMeal: (mealId: string) => void;
  clearCart: () => void;
};

export const useMealCartStore = create<MealCartState>((set) => ({
  items: [],
  addMeal: (meal, quantity = 1) =>
    set((state) => {
      const existingItem = state.items.find((item) => item.meal.id === meal.id);
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.meal.id === meal.id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          ),
        };
      }
      return { items: [...state.items, { meal, quantity }] };
    }),
  clearCart: () => set({ items: [] }),
  decrementMeal: (mealId) =>
    set((state) => ({
      items: state.items
        .map((item) =>
          item.meal.id === mealId
            ? { ...item, quantity: Math.max(0, item.quantity - 1) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    })),
  incrementMeal: (mealId) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.meal.id === mealId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    })),
  removeMeal: (mealId) =>
    set((state) => ({ items: state.items.filter((item) => item.meal.id !== mealId) })),
}));

export const formatNaira = (amount: number) =>
  `₦${new Intl.NumberFormat("en-NG", { maximumFractionDigits: 0 }).format(amount)}`;

export const getCartItemCount = (items: CartItem[]) =>
  items.reduce((total, item) => total + item.quantity, 0);

export const getCartSubtotal = (items: CartItem[]) =>
  items.reduce((total, item) => total + item.meal.price * item.quantity, 0);

export const DELIVERY_FEE = 1500;
