import { describe, expect, it } from "@jest/globals";
import { deliveriesModule } from "../index";

describe("deliveries module scaffold", () => {
  it("declares its module name", () => {
    expect(deliveriesModule.name).toBe("deliveries");
  });
});

