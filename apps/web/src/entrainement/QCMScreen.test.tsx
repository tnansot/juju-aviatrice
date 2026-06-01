// bc-entrainement — tests FO-06 QCM (S3)
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { QCMScreen } from "./QCMScreen.js";
import type { Exercice } from "./types.js";

const { soumettreMutate } = vi.hoisted(() => ({
  // Simule la réponse backend : bonne réponse = "b", correction neutre.
  soumettreMutate: vi.fn((_input, opts) =>
    opts?.onSuccess?.({
      estCorrect: _input.choixId === "b",
      correction: "La norme vaut √(9+16)=5. Retiens la formule.",
      bonneReponseId: "b",
      exerciceSuivant: true,
    }),
  ),
}));

vi.mock("../trpc.js", () => ({
  trpc: {
    entrainement: {
      soumettreReponse: {
        useMutation: () => ({ mutate: soumettreMutate, isPending: false }),
      },
    },
  },
}));

const EXERCICE: Exercice = {
  id: "maths-geometrie-qcm-001",
  exerciceEnCoursId: "eec-1",
  format: "qcm",
  ordre: 1,
  enonce: {
    question: "Norme de (3, −4) ?",
    choix: [
      { id: "a", libelle: "7" },
      { id: "b", libelle: "5" },
      { id: "c", libelle: "1" },
    ],
  },
};

function renderScreen(onSuivant = vi.fn()) {
  render(
    <QCMScreen
      exercice={EXERCICE}
      chapitreNom="Géométrie"
      position={{ courant: 3, total: 4 }}
      modeChrono={false}
      dureeChrono={null}
      onSuivant={onSuivant}
    />,
  );
  return { onSuivant };
}

describe("QCMScreen (FO-06)", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("affiche l'énoncé, les choix et Valider désactivé tant qu'aucun choix", () => {
    renderScreen();

    expect(screen.getByText("Norme de (3, −4) ?")).toBeTruthy();
    expect(screen.getByText("7")).toBeTruthy();
    expect(
      (screen.getByRole("button", { name: "Valider" }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
  });

  it("active Valider après sélection puis affiche l'explication (pas de chrono hors mode)", () => {
    renderScreen();

    expect(screen.queryByText(/:/)).toBeNull(); // pas de chrono affiché
    fireEvent.click(screen.getByText("5"));
    fireEvent.click(screen.getByRole("button", { name: "Valider" }));

    expect(screen.getByText("Explication")).toBeTruthy();
    expect(
      screen.getByText("La norme vaut √(9+16)=5. Retiens la formule."),
    ).toBeTruthy();
  });

  it("n'emploie aucun vocabulaire négatif (faux / raté / mauvais)", () => {
    renderScreen();
    fireEvent.click(screen.getByText("1"));
    fireEvent.click(screen.getByRole("button", { name: "Valider" }));

    expect(document.body.textContent ?? "").not.toMatch(/faux|raté|mauvais/i);
  });

  it("Suivant apparaît après validation et déclenche onSuivant", () => {
    const { onSuivant } = renderScreen();

    fireEvent.click(screen.getByText("5"));
    fireEvent.click(screen.getByRole("button", { name: "Valider" }));
    fireEvent.click(screen.getByRole("button", { name: "Suivant" }));

    expect(onSuivant).toHaveBeenCalledOnce();
  });
});
