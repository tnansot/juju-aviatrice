import { afterEach, describe, expect, it, vi } from "vitest";
import { getDeviceId } from "./use-device-id.js";

describe("getDeviceId", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("génère un UUID v4 et le stocke en localStorage si absent", () => {
    const id = getDeviceId();

    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
    expect(localStorage.getItem("device-id")).toBe(id);
  });

  it("retourne le device ID existant du localStorage", () => {
    const existing = "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee";
    localStorage.setItem("device-id", existing);

    expect(getDeviceId()).toBe(existing);
  });

  it("appelle crypto.randomUUID() pour la génération", () => {
    const spy = vi.spyOn(crypto, "randomUUID");
    localStorage.clear();

    getDeviceId();

    expect(spy).toHaveBeenCalledOnce();
    spy.mockRestore();
  });

  it("ne régénère pas si le device ID existe déjà", () => {
    localStorage.setItem("device-id", "existing-id");
    const spy = vi.spyOn(crypto, "randomUUID");

    getDeviceId();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});
