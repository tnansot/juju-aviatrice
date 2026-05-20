import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AccessRefused } from "./AccessRefused.js";

describe("AccessRefused (FO-14)", () => {
  afterEach(cleanup);

  it("affiche le titre 'Accès non disponible'", () => {
    render(<AccessRefused />);
    expect(screen.getByText("Accès non disponible")).toBeDefined();
  });

  it("affiche le message d'explication sans détail technique", () => {
    render(<AccessRefused />);
    expect(screen.getByText(/réservée à une utilisation privée/)).toBeDefined();
    expect(screen.getByText(/lien d'invitation suffit/)).toBeDefined();
  });

  it("n'expose aucun lien, bouton ou formulaire (cul-de-sac)", () => {
    const { container } = render(<AccessRefused />);
    expect(container.querySelectorAll("a")).toHaveLength(0);
    expect(container.querySelectorAll("button")).toHaveLength(0);
    expect(container.querySelectorAll("form")).toHaveLength(0);
    expect(container.querySelectorAll("input")).toHaveLength(0);
  });

  it("ne mentionne ni token, ni device, ni UUID", () => {
    const { container } = render(<AccessRefused />);
    const text = container.textContent?.toLowerCase() ?? "";
    expect(text).not.toContain("token");
    expect(text).not.toContain("device");
    expect(text).not.toContain("uuid");
    expect(text).not.toContain("unauthorized");
  });
});
