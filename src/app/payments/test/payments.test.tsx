import { describe, expect, it } from "@jest/globals";
import { paymentsModule } from "../index";

describe("payments module scaffold", () => {
  it("declares its module name", () => {
    expect(paymentsModule.name).toBe("payments");
  });
});

