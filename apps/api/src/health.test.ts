import { Hono } from "hono";
import { describe, expect, it } from "vitest";

describe("GET /health", () => {
  it("retourne 200 avec { status: ok }", async () => {
    const app = new Hono();
    app.get("/health", (c) => c.json({ status: "ok" }));

    const res = await app.request("/health");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok" });
  });
});
