// bc-entrainement — tests FO-13 Récap Séquence Psy (F6 S5)
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RecapPsyScreen } from "./RecapPsyScreen.js";

const { terminerMutate, useObtenirBilan } = vi.hoisted(() => ({
  terminerMutate: vi.fn(),
  useObtenirBilan: vi.fn(),
}));

vi.mock("../trpc.js", () => ({
  trpc: {
    entrainement: {
      terminerMiniSession: {
        useMutation: () => ({ mutate: terminerMutate, isSuccess: true }),
      },
      obtenirBilan: { useQuery: useObtenirBilan },
    },
  },
}));

const BILAN = {
  data: { nombreExercicesFaits: 4, dureeMinutes: 3, messageBilan: "Bravo" },
};

const noop = () => {};

describe("RecapPsyScreen (FO-13)", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("clôture la mini-session au montage", () => {
    useObtenirBilan.mockReturnValue(BILAN);
    render(
      <RecapPsyScreen
        miniSessionId="ms-1"
        chapitreNom="Logique"
        autreTypeLabel="le calcul mental"
        onAutreType={noop}
        onAccueil={noop}
      />,
    );

    expect(terminerMutate).toHaveBeenCalledWith({ miniSessionId: "ms-1" });
  });

  it("affiche la checklist factuelle (fiche lue + N exercices, sans note /N)", () => {
    useObtenirBilan.mockReturnValue(BILAN);
    render(
      <RecapPsyScreen
        miniSessionId="ms-1"
        chapitreNom="Logique"
        autreTypeLabel="le calcul mental"
        onAutreType={noop}
        onAccueil={noop}
      />,
    );

    expect(screen.getByText("Premier passage Logique terminé")).toBeTruthy();
    expect(screen.getByText("Fiche méthode lue")).toBeTruthy();
    expect(screen.getByText("4 exercices sans chrono")).toBeTruthy();
    expect(document.body.textContent ?? "").not.toMatch(/\/\s*\d|sur \d/i);
  });

  it("propose l'autre type psy et le retour accueil", () => {
    useObtenirBilan.mockReturnValue(BILAN);
    const onAutreType = vi.fn();
    const onAccueil = vi.fn();
    render(
      <RecapPsyScreen
        miniSessionId="ms-1"
        chapitreNom="Logique"
        autreTypeLabel="le calcul mental"
        onAutreType={onAutreType}
        onAccueil={onAccueil}
      />,
    );

    fireEvent.click(screen.getByText("Essayer le calcul mental"));
    fireEvent.click(screen.getByText("Retour à l'accueil"));

    expect(onAutreType).toHaveBeenCalled();
    expect(onAccueil).toHaveBeenCalled();
  });

  it("masque le bouton « autre type » si aucun autre type n'est disponible", () => {
    useObtenirBilan.mockReturnValue(BILAN);
    render(
      <RecapPsyScreen
        miniSessionId="ms-1"
        chapitreNom="Logique"
        autreTypeLabel={null}
        onAutreType={noop}
        onAccueil={noop}
      />,
    );

    expect(screen.queryByText(/^Essayer/)).toBeNull();
    expect(screen.getByText("Retour à l'accueil")).toBeTruthy();
  });

  it("ne rend rien tant que le bilan n'est pas chargé", () => {
    useObtenirBilan.mockReturnValue({ data: undefined });
    const { container } = render(
      <RecapPsyScreen
        miniSessionId="ms-1"
        chapitreNom="Logique"
        autreTypeLabel={null}
        onAutreType={noop}
        onAccueil={noop}
      />,
    );

    expect(container.firstChild).toBeNull();
  });
});
