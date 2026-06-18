import { describe, expect, it, jest } from "@jest/globals";
import { adminModule } from "../index";
import { adminService } from "../services";
import { apiClient } from "@/shared/api/client";

jest.mock("@/shared/api/client", () => ({
  apiClient: {
    delete: jest.fn(),
    get: jest.fn(),
    patch: jest.fn(),
    post: jest.fn(),
  },
}));

const mockedApi = apiClient as jest.Mocked<typeof apiClient>;

describe("admin module", () => {
  it("declares its module name", () => {
    expect(adminModule.name).toBe("admin");
  });

  it("calls backend admin list endpoints with pagination", async () => {
    mockedApi.get.mockResolvedValue({ items: [], pagination: { limit: 100, page: 1, total: 0, totalPages: 1 } });

    await adminService.users();
    await adminService.meals(2, 50);
    await adminService.orders();
    await adminService.logs();

    expect(mockedApi.get).toHaveBeenCalledWith("/admin/users?page=1&limit=100");
    expect(mockedApi.get).toHaveBeenCalledWith("/admin/meals?page=2&limit=50");
    expect(mockedApi.get).toHaveBeenCalledWith("/admin/orders?page=1&limit=100");
    expect(mockedApi.get).toHaveBeenCalledWith("/admin/logs?page=1&limit=100");
  });

  it("converts admin labels to backend status codes", async () => {
    mockedApi.patch.mockResolvedValue({});

    await adminService.updateUserStatus("user-1", "Suspended");
    await adminService.updateOrderStatus("order-1", "Out for Delivery");
    await adminService.updateMeal("meal-1", { status: "Sold Out" });

    expect(mockedApi.patch).toHaveBeenCalledWith("/admin/users/user-1/status", {
      status: "SUSPENDED",
    });
    expect(mockedApi.patch).toHaveBeenCalledWith("/admin/orders/order-1/status", {
      status: "OUT_FOR_DELIVERY",
    });
    expect(mockedApi.patch).toHaveBeenCalledWith("/admin/meals/meal-1", {
      status: "SOLD_OUT",
    });
  });
});
