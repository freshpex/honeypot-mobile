import { describe, expect, it } from "@jest/globals";
import { ordersModule } from "../index";

describe("orders module scaffold", () => {
  it("declares its module name", () => {
    expect(ordersModule.name).toBe("orders");
  });
});

