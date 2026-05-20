import { describe, expect, it } from "vitest";
import { createCaller } from "./test-helpers.js";

describe("appRouter", () => {
  it("hello retourne un message de bienvenue", async () => {
    const caller = createCaller();
    const result = await caller.hello();
    expect(result).toEqual({
      message: "Bienvenue sur l'application juju-aviatrice !",
    });
  });
});
