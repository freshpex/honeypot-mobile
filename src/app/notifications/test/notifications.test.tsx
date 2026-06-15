import { describe, expect, it } from "@jest/globals";
import { notificationsModule } from "../index";

describe("notifications module scaffold", () => {
  it("declares its module name", () => {
    expect(notificationsModule.name).toBe("notifications");
  });
});

