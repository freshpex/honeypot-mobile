import { describe, expect, it } from "@jest/globals";
import { profileModule } from "../index";

describe("profile module scaffold", () => {
  it("declares its module name", () => {
    expect(profileModule.name).toBe("profile");
  });
});

