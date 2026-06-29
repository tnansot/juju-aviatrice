// bc-onboarding — tests FO-10 Psy Bienvenue (F6 S1)
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PsyBienvenueScreen } from "./PsyBienvenueScreen.js";

const CHAPITRES = [
  { id: "psy-calcul-mental", nom: "Calcul mental", matiere: "calcul_mental" },
  { id: "psy-logique", nom: "Logique", matiere: "logique" },
];

const noop = () => {};

describe("PsyBienvenueScreen (FO-10)", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("affiche le titre, l'intro et les deux types", () => {
    render(
      <PsyBienvenueScreen
        chapitres={CHAPITRES}
        onChoisirType={noop}
        onRetour={noop}
      />,
    );

    expect(screen.getByText("Bienvenue dans la zone Psy")).toBeTruthy();
    expect(screen.getByText("Logique")).toBeTruthy();
    expect(screen.getByText("Calcul mental")).toBeTruthy();
  });

  it("affiche le badge « Recommandé en 1er » sur la logique uniquement", () => {
    render(
      <PsyBienvenueScreen
        chapitres={CHAPITRES}
        onChoisirType={noop}
        onRetour={noop}
      />,
    );

    const badges = screen.getAllByText("Recommandé en 1er");
    expect(badges).toHaveLength(1);
  });

  it("place la logique en premier malgré l'ordre des chapitres reçus", () => {
    render(
      <PsyBienvenueScreen
        chapitres={CHAPITRES}
        onChoisirType={noop}
        onRetour={noop}
      />,
    );

    const noms = screen
      .getAllByText(/Logique|Calcul mental/)
      .map((el) => el.textContent);
    expect(noms[0]).toBe("Logique");
  });

  it("appelle onChoisirType avec le type choisi", () => {
    const onChoisirType = vi.fn();
    render(
      <PsyBienvenueScreen
        chapitres={CHAPITRES}
        onChoisirType={onChoisirType}
        onRetour={noop}
      />,
    );

    fireEvent.click(screen.getByText("Logique"));

    expect(onChoisirType).toHaveBeenCalledWith("psy-logique", "Logique");
  });

  it("appelle onRetour au tap sur « Retour à l'accueil »", () => {
    const onRetour = vi.fn();
    render(
      <PsyBienvenueScreen
        chapitres={CHAPITRES}
        onChoisirType={noop}
        onRetour={onRetour}
      />,
    );

    fireEvent.click(screen.getByText("Retour à l'accueil"));

    expect(onRetour).toHaveBeenCalled();
  });
});
