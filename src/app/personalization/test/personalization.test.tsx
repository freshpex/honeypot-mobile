import { describe, expect, it } from "@jest/globals";
import { personalizationModule } from "../index";

describe("personalization module scaffold", () => {
  it("declares its module name", () => {
    expect(personalizationModule.name).toBe("personalization");
  });
});

