import type { DeliveryAddress } from "@/shared/state";

export type OrdersModuleName = "orders";

export type OrderStatusLabel =
  | "Confirmed"
  | "Preparing"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

export type OrderItem = {
  id: string;
  mealId: string;
  name: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type CustomerOrder = {
  id: string;
  reference: string;
  date: string;
  deliveryAddress?: DeliveryAddress;
  paymentCardLast4?: string;
  paymentMethod: "Wallet" | "Card";
  status: OrderStatusLabel;
  statusCode: "CONFIRMED" | "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";
  type: "One Off" | "Subscription";
  subtotal: number;
  deliveryFee: number;
  total: number;
  items: OrderItem[];
};

export type OrderListResponse = {
  orders: CustomerOrder[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type CheckoutPayload = {
  deliveryAddressId: string;
  deliveryFee: number;
  items: Array<{ mealId: string; quantity: number }>;
  paymentMethodId: string;
};

export type TrackingResponse = {
  order: CustomerOrder;
  map: {
    provider: "openstreetmap";
    tileUrlTemplate: string;
    route: Array<{ latitude: number; longitude: number }>;
  };
  events: Array<{
    id: string;
    status: OrderStatusLabel;
    title: string;
    description: string;
    latitude?: number;
    longitude?: number;
    happenedAt: string;
  }>;
};

