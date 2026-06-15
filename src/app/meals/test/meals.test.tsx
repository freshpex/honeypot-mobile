import { describe, expect, it } from "@jest/globals";
import { mealsModule } from "../index";

describe("meals module scaffold", () => {
  it("declares its module name", () => {
    expect(mealsModule.name).toBe("meals");
  });
});

