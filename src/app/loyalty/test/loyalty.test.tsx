import { describe, expect, it } from "@jest/globals";
import { loyaltyModule } from "../index";

describe("loyalty module scaffold", () => {
  it("declares its module name", () => {
    expect(loyaltyModule.name).toBe("loyalty");
  });
});

