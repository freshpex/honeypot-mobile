import { create } from "zustand";
import { paymentsService, type PaymentHistoryItem } from "@/app/payments/services";
import { profileService } from "@/app/profile/services";
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
  brand: string;
  last4: string;
  holderName: string;
  expiry: string;
  isDefault?: boolean;
};

export type CustomerOrder = {
  id: string;
  date: string;
  deliveryAddress: DeliveryAddress;
  paymentCardLast4?: string;
  status: "Confirmed" | "Preparing" | "Out for Delivery" | "Delivered" | "Cancelled";
  type: "One Off";
  total: number;
  items: CartItem[];
  paymentMethod: "Wallet" | "Card";
};

type CustomerState = {
  addresses: DeliveryAddress[];
  cards: SavedCard[];
  dietaryPreferences: string[];
  error?: string;
  allergies: string;
  isSyncing: boolean;
  orders: CustomerOrder[];
  paymentHistory: PaymentHistoryItem[];
  addAddress: (address: Omit<DeliveryAddress, "id">) => DeliveryAddress;
  addCard: (card: Omit<SavedCard, "id" | "brand" | "last4"> & { number: string }) => SavedCard;
  addOrder: (order: Omit<CustomerOrder, "id" | "date" | "status">) => CustomerOrder;
  chargeOrder: (input: {
    deliveryFee: number;
    items: CartItem[];
    paymentMethodId: string;
    total: number;
  }) => Promise<PaymentHistoryItem>;
  createAddress: (address: Omit<DeliveryAddress, "id">) => Promise<DeliveryAddress>;
  createCard: (card: Omit<SavedCard, "id" | "brand" | "last4"> & { number: string }) => Promise<SavedCard>;
  loadAddresses: () => Promise<void>;
  loadCards: () => Promise<void>;
  loadPaymentHistory: () => Promise<void>;
  removeAddress: (addressId: string) => void;
  removeAddressRemote: (addressId: string) => Promise<void>;
  removeCard: (cardId: string) => void;
  removeCardRemote: (cardId: string) => Promise<void>;
  saveDietaryPreferences: (preferences: string[], allergies: string) => void;
  updateOrderStatus: (orderId: string, status: CustomerOrder["status"]) => void;
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
  error: undefined,
  isSyncing: false,
  orders: [],
  paymentHistory: [],
  addAddress: (address) => {
    const newAddress = { ...address, id: `addr-${Date.now()}` };
    set((state) => ({
      addresses: [
        ...state.addresses.map((item) => ({ ...item, isDefault: false })),
        newAddress,
      ],
    }));
    return newAddress;
  },
  addCard: (card) => {
    const newCard: SavedCard = {
      brand: "Mastercard",
      expiry: card.expiry,
      holderName: card.holderName,
      id: `card-${Date.now()}`,
      last4: card.number.replace(/\s/g, "").slice(-4),
    };
    set((state) => ({
      cards: [...state.cards, newCard],
    }));
    return newCard;
  },
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
  chargeOrder: async ({ deliveryFee, items, paymentMethodId, total }) => {
    set({ error: undefined, isSyncing: true });
    try {
      const transaction = await paymentsService.charge({
        amount: total,
        deliveryFee,
        description: "One Off",
        metadata: {
          itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
          items: items.map((item) => ({
            id: item.meal.id,
            name: item.meal.name,
            price: item.meal.price,
            quantity: item.quantity,
          })),
        },
        paymentMethodId,
      });
      set((state) => ({
        isSyncing: false,
        paymentHistory: [transaction, ...state.paymentHistory.filter((item) => item.id !== transaction.id)],
      }));
      return transaction;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to complete payment.";
      set({ error: message, isSyncing: false });
      throw error;
    }
  },
  createAddress: async (address) => {
    set({ error: undefined, isSyncing: true });
    try {
      const savedAddress = await profileService.createAddress(address);
      set((state) => ({
        addresses: [
          ...state.addresses
            .filter((item) => item.id !== savedAddress.id)
            .map((item) => ({ ...item, isDefault: savedAddress.isDefault ? false : item.isDefault })),
          savedAddress,
        ],
        isSyncing: false,
      }));
      return savedAddress;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save address.";
      set({ error: message, isSyncing: false });
      throw error;
    }
  },
  createCard: async (card) => {
    set({ error: undefined, isSyncing: true });
    try {
      const savedCard = await paymentsService.addMethod(card);
      set((state) => ({
        cards: [...state.cards.filter((item) => item.id !== savedCard.id), savedCard],
        isSyncing: false,
      }));
      return savedCard;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save payment method.";
      set({ error: message, isSyncing: false });
      throw error;
    }
  },
  loadAddresses: async () => {
    set({ error: undefined, isSyncing: true });
    try {
      const addresses = await profileService.listAddresses();
      set({ addresses, isSyncing: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load addresses.";
      set({ error: message, isSyncing: false });
    }
  },
  loadCards: async () => {
    set({ error: undefined, isSyncing: true });
    try {
      const cards = await paymentsService.listMethods();
      set({ cards, isSyncing: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load payment methods.";
      set({ error: message, isSyncing: false });
    }
  },
  loadPaymentHistory: async () => {
    set({ error: undefined, isSyncing: true });
    try {
      const paymentHistory = await paymentsService.listHistory();
      set({ isSyncing: false, paymentHistory });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load payment history.";
      set({ error: message, isSyncing: false });
    }
  },
  removeAddress: (addressId) =>
    set((state) => ({ addresses: state.addresses.filter((item) => item.id !== addressId) })),
  removeAddressRemote: async (addressId) => {
    set({ error: undefined, isSyncing: true });
    try {
      await profileService.deleteAddress(addressId);
      set((state) => ({
        addresses: state.addresses.filter((item) => item.id !== addressId),
        isSyncing: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to remove address.";
      set({ error: message, isSyncing: false });
      throw error;
    }
  },
  removeCard: (cardId) =>
    set((state) => ({ cards: state.cards.filter((item) => item.id !== cardId) })),
  removeCardRemote: async (cardId) => {
    set({ error: undefined, isSyncing: true });
    try {
      await paymentsService.deleteMethod(cardId);
      set((state) => ({
        cards: state.cards.filter((item) => item.id !== cardId),
        isSyncing: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to remove payment method.";
      set({ error: message, isSyncing: false });
      throw error;
    }
  },
  saveDietaryPreferences: (preferences, allergies) =>
    set({ allergies, dietaryPreferences: preferences }),
  updateOrderStatus: (orderId, status) =>
    set((state) => ({
      orders: state.orders.map((order) => (order.id === orderId ? { ...order, status } : order)),
    })),
}));
