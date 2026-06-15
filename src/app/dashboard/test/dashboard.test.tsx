import { describe, expect, it } from "@jest/globals";
import { dashboardModule } from "../index";

describe("dashboard module scaffold", () => {
  it("declares its module name", () => {
    expect(dashboardModule.name).toBe("dashboard");
  });
});

