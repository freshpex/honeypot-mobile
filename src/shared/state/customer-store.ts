import { create } from "zustand";
import type { CartItem } from "./meal-cart-store";

export type DeliveryAddress = {
  id: string;
  label: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  isDefault?: boolean;
};

export type SavedCard = {
  id: string;
  brand: "Mastercard";
  last4: string;
  holderName: string;
  expiry: string;
};

export type CustomerOrder = {
  id: string;
  date: string;
  status: "Confirmed" | "Delivered" | "Cancelled";
  type: "One Off";
  total: number;
  items: CartItem[];
  paymentMethod: "Wallet" | "Card";
};

type CustomerState = {
  addresses: DeliveryAddress[];
  cards: SavedCard[];
  dietaryPreferences: string[];
  allergies: string;
  orders: CustomerOrder[];
  addAddress: (address: Omit<DeliveryAddress, "id">) => void;
  addCard: (card: Omit<SavedCard, "id" | "brand" | "last4"> & { number: string }) => void;
  addOrder: (order: Omit<CustomerOrder, "id" | "date" | "status">) => CustomerOrder;
  removeAddress: (addressId: string) => void;
  removeCard: (cardId: string) => void;
  saveDietaryPreferences: (preferences: string[], allergies: string) => void;
};

const createOrderId = () => `#HP-${Math.random().toString(36).slice(2, 9).toUpperCase()}`;

export const useCustomerStore = create<CustomerState>((set) => ({
  addresses: [],
  allergies: "",
  cards: [
    {
      brand: "Mastercard",
      expiry: "11/27",
      holderName: "ENOCH OLUWAKAYODE EPEKIPOLU",
      id: "card-mastercard-5380",
      last4: "5380",
    },
  ],
  dietaryPreferences: ["High Protein"],
  orders: [],
  addAddress: (address) =>
    set((state) => ({
      addresses: [
        ...state.addresses.map((item) => ({ ...item, isDefault: false })),
        { ...address, id: `addr-${Date.now()}` },
      ],
    })),
  addCard: (card) =>
    set((state) => ({
      cards: [
        ...state.cards,
        {
          brand: "Mastercard",
          expiry: card.expiry,
          holderName: card.holderName,
          id: `card-${Date.now()}`,
          last4: card.number.replace(/\s/g, "").slice(-4),
        },
      ],
    })),
  addOrder: (order) => {
    const newOrder: CustomerOrder = {
      ...order,
      date: "Jun 16, 2026",
      id: createOrderId(),
      status: "Confirmed",
    };
    set((state) => ({ orders: [newOrder, ...state.orders] }));
    return newOrder;
  },
  removeAddress: (addressId) =>
    set((state) => ({ addresses: state.addresses.filter((item) => item.id !== addressId) })),
  removeCard: (cardId) =>
    set((state) => ({ cards: state.cards.filter((item) => item.id !== cardId) })),
  saveDietaryPreferences: (preferences, allergies) =>
    set({ allergies, dietaryPreferences: preferences }),
}));
