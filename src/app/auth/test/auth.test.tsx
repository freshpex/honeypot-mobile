import { describe, expect, it } from "@jest/globals";
import { authModule } from "../index";

describe("auth module scaffold", () => {
  it("declares its module name", () => {
    expect(authModule.name).toBe("auth");
  });
});

