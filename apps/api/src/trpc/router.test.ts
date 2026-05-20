import { describe, expect, it } from "vitest";
import { createCaller } from "./test-helpers.js";

describe("appRouter", () => {
  it("le router identite est monté", () => {
    const caller = createCaller();
    expect(caller.identite).toBeDefined();
  });
});
