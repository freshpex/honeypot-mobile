import { describe, expect, it } from "@jest/globals";
import { supportModule } from "../index";

describe("support module scaffold", () => {
  it("declares its module name", () => {
    expect(supportModule.name).toBe("support");
  });
});

