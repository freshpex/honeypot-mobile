import { create } from "zustand";
import { ordersService } from "@/app/orders/services";
import type { CustomerOrder } from "@/app/orders/types";
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
  latitude?: number;
  longitude?: number;
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

type CustomerState = {
  addresses: DeliveryAddress[];
  cards: SavedCard[];
  dietaryPreferences: string[];
  error?: string;
  allergies: string;
  isSyncing: boolean;
  orders: CustomerOrder[];
  paymentHistory: PaymentHistoryItem[];
  cancelAwaitingPayment: (orderId: string) => Promise<CustomerOrder>;
  checkoutOrder: (input: {
    deliveryAddressId: string;
    deliveryFee: number;
    items: CartItem[];
    paymentMethodId: string;
    paymentReference: string;
  }) => Promise<CustomerOrder>;
  confirmOrderPayment: (orderId: string) => Promise<CustomerOrder>;
  createAddress: (address: Omit<DeliveryAddress, "id">) => Promise<DeliveryAddress>;
  createCard: (card: Omit<SavedCard, "id" | "brand" | "last4"> & { number: string }) => Promise<SavedCard>;
  loadAddresses: () => Promise<void>;
  loadCards: () => Promise<void>;
  loadOrders: (status?: "active" | "delivered" | "cancelled" | "all") => Promise<void>;
  loadPaymentHistory: () => Promise<void>;
  removeAddress: (addressId: string) => void;
  removeAddressRemote: (addressId: string) => Promise<void>;
  removeCard: (cardId: string) => void;
  removeCardRemote: (cardId: string) => Promise<void>;
  retryOrderPayment: (orderId: string, callbackUrl?: string) => Promise<{ order: CustomerOrder; payment: Awaited<ReturnType<typeof ordersService.retryPayment>>["payment"] }>;
  saveDietaryPreferences: (preferences: string[], allergies: string) => void;
  updateOrderStatus: (orderId: string, status: CustomerOrder["status"]) => void;
};

export const useCustomerStore = create<CustomerState>((set) => ({
  addresses: [],
  allergies: "",
  cards: [],
  dietaryPreferences: [],
  error: undefined,
  isSyncing: false,
  orders: [],
  paymentHistory: [],
  cancelAwaitingPayment: async (orderId) => {
    set({ error: undefined, isSyncing: true });
    try {
      const order = await ordersService.cancelAwaitingPayment(orderId);
      set((state) => ({
        isSyncing: false,
        orders: state.orders.map((item) => (item.id === order.id ? order : item)),
      }));
      return order;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to cancel order.";
      set({ error: message, isSyncing: false });
      throw error;
    }
  },
  checkoutOrder: async ({ deliveryAddressId, deliveryFee, items, paymentMethodId, paymentReference }) => {
    set({ error: undefined, isSyncing: true });
    try {
      const order = await ordersService.checkout({
        deliveryAddressId,
        deliveryFee,
        items: items.map((item) => ({ mealId: item.meal.id, quantity: item.quantity })),
        paymentMethodId,
        paymentReference,
      });
      set((state) => ({
        isSyncing: false,
        orders: [order, ...state.orders.filter((item) => item.id !== order.id)],
      }));
      return order;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to place order.";
      set({ error: message, isSyncing: false });
      throw error;
    }
  },
  confirmOrderPayment: async (orderId) => {
    set({ error: undefined, isSyncing: true });
    try {
      const order = await ordersService.confirmPayment(orderId);
      set((state) => ({
        isSyncing: false,
        orders: [order, ...state.orders.filter((item) => item.id !== order.id)],
      }));
      return order;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to confirm payment.";
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
  loadOrders: async (status = "active") => {
    set({ error: undefined, isSyncing: true });
    try {
      const response = await ordersService.getOrders(status);
      set({ isSyncing: false, orders: response.orders });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load orders.";
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
  retryOrderPayment: async (orderId, callbackUrl) => {
    set({ error: undefined, isSyncing: true });
    try {
      const response = await ordersService.retryPayment(orderId, callbackUrl);
      set((state) => ({
        isSyncing: false,
        orders: [response.order, ...state.orders.filter((item) => item.id !== response.order.id)],
      }));
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to retry payment.";
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
