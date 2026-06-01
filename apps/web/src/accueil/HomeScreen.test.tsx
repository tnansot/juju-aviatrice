// bc-onboarding, bc-entrainement — tests FO-04 accueil récurrent
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HomeScreen } from "./HomeScreen.js";

describe("HomeScreen (FO-04)", () => {
  afterEach(cleanup);

  it("affiche l'avatar au stade 1, une suggestion en 1 ligne et un bouton Go", () => {
    render(<HomeScreen onGo={() => {}} onChanger={() => {}} />);

    expect(screen.getByText("Avatar stade 1")).toBeTruthy();
    expect(screen.getByText("Stade 1 — Débutante")).toBeTruthy();
    expect(
      screen.getByText("Lance ta première session : 4 flashcards maths"),
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "Go" })).toBeTruthy();
  });

  it("déclenche onGo au tap sur Go (démarrage en 1 tap)", () => {
    const onGo = vi.fn();
    render(<HomeScreen onGo={onGo} onChanger={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: "Go" }));

    expect(onGo).toHaveBeenCalledOnce();
  });

  it("déclenche onChanger au tap sur Changer d'activité", () => {
    const onChanger = vi.fn();
    render(<HomeScreen onGo={() => {}} onChanger={onChanger} />);

    fireEvent.click(screen.getByRole("button", { name: "Changer d'activité" }));

    expect(onChanger).toHaveBeenCalledOnce();
  });
});
