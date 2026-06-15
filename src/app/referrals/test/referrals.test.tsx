import { describe, expect, it } from "@jest/globals";
import { referralsModule } from "../index";

describe("referrals module scaffold", () => {
  it("declares its module name", () => {
    expect(referralsModule.name).toBe("referrals");
  });
});

