import type { DeliveryAddress } from "@/shared/state";

export type OrdersModuleName = "orders";

export type OrderStatusLabel =
  | "Awaiting Payment"
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

export type CartMeal = {
  id: string;
  imageUrl: string;
  name: string;
  price: number;
};

export type CartResponse = {
  itemCount: number;
  items: {
    id: string;
    lineTotal: number;
    meal: CartMeal;
    quantity: number;
  }[];
  subtotal: number;
};

export type CustomerOrder = {
  id: string;
  reference: string;
  date: string;
  deliveryAddress?: DeliveryAddress;
  paymentCardLast4?: string;
  paymentAuthorizationUrl?: string;
  paymentMethod: "Wallet" | "Card";
  paymentReference?: string;
  paymentStatus?: "PAID" | "PENDING" | "FAILED" | "CANCELLED";
  status: OrderStatusLabel;
  statusCode: "AWAITING_PAYMENT" | "CONFIRMED" | "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";
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
  items: { mealId: string; quantity: number }[];
  paymentMethodId: string;
  paymentReference: string;
};

export type TrackingResponse = {
  order: CustomerOrder;
  map: {
    provider: "openstreetmap";
    tileUrlTemplate: string;
    route: { latitude: number; longitude: number }[];
  };
  rider?: {
    name: string;
    phone?: string;
    currentLocation: { latitude: number; longitude: number };
  };
  events: {
    id: string;
    status: OrderStatusLabel;
    title: string;
    description: string;
    latitude?: number;
    longitude?: number;
    happenedAt: string;
  }[];
};

