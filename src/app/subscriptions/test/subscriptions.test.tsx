import { describe, expect, it } from "@jest/globals";
import { subscriptionsModule } from "../index";

describe("subscriptions module scaffold", () => {
  it("declares its module name", () => {
    expect(subscriptionsModule.name).toBe("subscriptions");
  });
});

