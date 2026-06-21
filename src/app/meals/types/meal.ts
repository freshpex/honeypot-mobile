export type MealTag = "vegetarian" | "weight loss" | "vegan" | "high protein" | "low carb";

export type Meal = {
  id: string;
  name: string;
  category: string;
  description: string;
  detailDescription: string;
  imageUrl: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  price: number;
  averageRating?: number;
  reviewCount?: number;
  tags: MealTag[];
};

export type MealReviewEntry = {
  id: string;
  body: string;
  createdAt: string;
  photoUrls: string[];
  rating: number;
  reviewerName: string;
  status: "Pending" | "Published" | "Rejected";
  title: string;
};

export type MealDetail = Meal & {
  reviews: MealReviewEntry[];
};

export type MealsStackParamList = {
  Menu: undefined;
  Cart: undefined;
  Checkout: undefined;
  PaymentResult: {
    message?: string;
    orderId?: string;
    orderReference?: string;
    status: "success" | "pending" | "failed" | "cancelled";
  };
};
