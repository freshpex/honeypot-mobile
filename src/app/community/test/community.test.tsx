import { describe, expect, it } from "@jest/globals";
import { communityModule } from "../index";

describe("community module scaffold", () => {
  it("declares its module name", () => {
    expect(communityModule.name).toBe("community");
  });
});

