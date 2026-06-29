// bc-contenu — tests FO-11 Fiche Méthode (F6 S2)
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FicheMethodeScreen } from "./FicheMethodeScreen.js";

const { useFiche } = vi.hoisted(() => ({ useFiche: vi.fn() }));

vi.mock("../trpc.js", () => ({
  trpc: {
    contenu: { obtenirFicheMethode: { useQuery: useFiche } },
  },
}));

const FICHE = {
  id: "psy-logique-fiche",
  chapitreId: "psy-logique",
  typePsy: "logique",
  cestQuoi: "Un test de logique évalue ta capacité à trouver une règle.",
  ceQueCaEvalue: ["Raisonnement inductif", "Patterns", "Abstraction"],
  commentAborder: [
    "Cherche les écarts",
    "Teste les hypothèses",
    "Reviens plus tard",
  ],
};

const noop = () => {};

describe("FicheMethodeScreen (FO-11)", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("affiche les 3 sections avec leur contenu", () => {
    useFiche.mockReturnValue({ data: FICHE, isLoading: false });
    render(
      <FicheMethodeScreen
        chapitreId="psy-logique"
        chapitreNom="Logique"
        onSentrainer={noop}
        onPlusTard={noop}
      />,
    );

    expect(screen.getByText("Fiche méthode — Psychotechniques")).toBeTruthy();
    expect(screen.getByText("Logique")).toBeTruthy();
    expect(screen.getByText("C'est quoi ?")).toBeTruthy();
    expect(screen.getByText("Ce que ça évalue")).toBeTruthy();
    expect(screen.getByText("Comment l'aborder")).toBeTruthy();
    expect(screen.getByText(FICHE.cestQuoi)).toBeTruthy();
    expect(screen.getByText("Raisonnement inductif")).toBeTruthy();
    expect(screen.getByText("Cherche les écarts")).toBeTruthy();
  });

  it("ne rend rien pendant le chargement", () => {
    useFiche.mockReturnValue({ data: undefined, isLoading: true });
    const { container } = render(
      <FicheMethodeScreen
        chapitreId="psy-logique"
        chapitreNom="Logique"
        onSentrainer={noop}
        onPlusTard={noop}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("déclenche onSentrainer au tap sur « S'entraîner »", () => {
    useFiche.mockReturnValue({ data: FICHE, isLoading: false });
    const onSentrainer = vi.fn();
    render(
      <FicheMethodeScreen
        chapitreId="psy-logique"
        chapitreNom="Logique"
        onSentrainer={onSentrainer}
        onPlusTard={noop}
      />,
    );

    fireEvent.click(screen.getByText("S'entraîner"));

    expect(onSentrainer).toHaveBeenCalled();
  });

  it("déclenche onPlusTard au tap sur « Plus tard »", () => {
    useFiche.mockReturnValue({ data: FICHE, isLoading: false });
    const onPlusTard = vi.fn();
    render(
      <FicheMethodeScreen
        chapitreId="psy-logique"
        chapitreNom="Logique"
        onSentrainer={noop}
        onPlusTard={onPlusTard}
      />,
    );

    fireEvent.click(screen.getByText("Plus tard"));

    expect(onPlusTard).toHaveBeenCalled();
  });
});
