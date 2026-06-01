// bc-entrainement — tests FO-05 flashcard (S2)
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FlashcardScreen } from "./FlashcardScreen.js";
import type { Exercice } from "./types.js";

const { retournerMutate } = vi.hoisted(() => ({
  retournerMutate: vi.fn(),
}));

vi.mock("../trpc.js", () => ({
  trpc: {
    entrainement: {
      retournerFlashcard: {
        useMutation: () => ({ mutate: retournerMutate, isPending: false }),
      },
    },
  },
}));

const EXERCICE: Exercice = {
  id: "maths-geometrie-fc-001",
  exerciceEnCoursId: "eec-1",
  format: "flashcard",
  ordre: 1,
  enonce: {
    faceQuestion: "Quelle est la norme de u(a, b) ?",
    faceReponse: "√(a² + b²)",
    explication: "C'est Pythagore appliqué aux composantes.",
  },
};

function renderScreen(onSuivant = vi.fn()) {
  render(
    <FlashcardScreen
      exercice={EXERCICE}
      chapitreNom="Géométrie"
      position={{ courant: 2, total: 4 }}
      onSuivant={onSuivant}
    />,
  );
  return { onSuivant };
}

describe("FlashcardScreen (FO-05)", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("affiche question, progression et chapitre, pas la réponse avant flip", () => {
    renderScreen();

    expect(screen.getByText("Quelle est la norme de u(a, b) ?")).toBeTruthy();
    expect(screen.getByText("Géométrie")).toBeTruthy();
    expect(screen.getByText("2 / 4")).toBeTruthy();
    expect(screen.queryByText("√(a² + b²)")).toBeNull();
    expect(screen.queryByRole("button", { name: "Suivant" })).toBeNull();
  });

  it("retourne la carte : réponse + explication, et marque l'effort", () => {
    renderScreen();

    fireEvent.click(screen.getByRole("button", { name: /norme/ }));

    expect(screen.getByText("√(a² + b²)")).toBeTruthy();
    expect(screen.getByText("Explication")).toBeTruthy();
    expect(
      screen.getByText("C'est Pythagore appliqué aux composantes."),
    ).toBeTruthy();
    expect(retournerMutate).toHaveBeenCalledWith({
      exerciceEnCoursId: "eec-1",
    });
  });

  it("le bouton Suivant n'apparaît qu'après flip et déclenche onSuivant", () => {
    const { onSuivant } = renderScreen();

    fireEvent.click(screen.getByRole("button", { name: /norme/ }));
    fireEvent.click(screen.getByRole("button", { name: "Suivant" }));

    expect(onSuivant).toHaveBeenCalledOnce();
  });
});
