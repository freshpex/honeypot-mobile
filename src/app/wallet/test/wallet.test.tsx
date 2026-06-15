import { describe, expect, it } from "@jest/globals";
import { walletModule } from "../index";

describe("wallet module scaffold", () => {
  it("declares its module name", () => {
    expect(walletModule.name).toBe("wallet");
  });
});

