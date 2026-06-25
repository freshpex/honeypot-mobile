import { describe, expect, it } from "@jest/globals";
import { authModule } from "../index";
import { googleAuthErrorMessage } from "../hooks/useAuth";

describe("auth module scaffold", () => {
  it("declares its module name", () => {
    expect(authModule.name).toBe("auth");
  });

  it("explains a native developer configuration error", () => {
    expect(googleAuthErrorMessage({ code: "DEVELOPER_ERROR" })).toContain(
      "new native build",
    );
  });

  it("handles an in-progress sign-in without exposing a raw native error", () => {
    expect(googleAuthErrorMessage({ code: "IN_PROGRESS" })).toBe(
      "Google sign-in is already in progress.",
    );
  });
});

