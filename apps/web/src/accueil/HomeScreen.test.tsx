// bc-onboarding — tests FO-04 accueil récurrent (story S5)
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { HomeScreen } from "./HomeScreen.js";

describe("HomeScreen (FO-04)", () => {
  afterEach(cleanup);

  it("affiche l'avatar au stade 1, une suggestion en 1 ligne et un bouton Go", () => {
    render(<HomeScreen />);

    expect(screen.getByText("Avatar stade 1")).toBeTruthy();
    expect(screen.getByText("Stade 1 — Débutante")).toBeTruthy();
    expect(
      screen.getByText("Lance ta première session : 4 flashcards maths"),
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "Go" })).toBeTruthy();
  });

  it("offre un accès au changement d'activité", () => {
    render(<HomeScreen />);
    expect(
      screen.getByRole("button", { name: "Changer d'activité" }),
    ).toBeTruthy();
  });
});
