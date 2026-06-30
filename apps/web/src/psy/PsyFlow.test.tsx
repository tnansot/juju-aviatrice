// bc-contenu, bc-entrainement — tests orchestrateur PsyFlow (F6 S2 + S5)
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PsyFlow } from "./PsyFlow.js";

const { sessionParams, useListerPiliers } = vi.hoisted(() => ({
  sessionParams: vi.fn(),
  useListerPiliers: vi.fn(),
}));

vi.mock("../trpc.js", () => ({
  trpc: { contenu: { listerPiliers: { useQuery: useListerPiliers } } },
}));

vi.mock("./FicheMethodeScreen.js", () => ({
  FicheMethodeScreen: ({
    chapitreNom,
    onSentrainer,
    onPlusTard,
  }: {
    chapitreNom: string;
    onSentrainer: () => void;
    onPlusTard: () => void;
  }) => (
    <div>
      <span>FICHE {chapitreNom}</span>
      <button type="button" onClick={onSentrainer}>
        S'entraîner
      </button>
      <button type="button" onClick={onPlusTard}>
        Plus tard
      </button>
    </div>
  ),
}));

// SessionFlow simulé : un bouton « finir » bascule sur l'écran de fin (renderFin).
vi.mock("../entrainement/SessionFlow.js", () => ({
  SessionFlow: ({
    params,
    renderFin,
  }: {
    params: unknown;
    renderFin?: (id: string) => React.ReactNode;
  }) => {
    sessionParams(params);
    const [fin, setFin] = useState(false);
    if (fin && renderFin) return <>{renderFin("ms-1")}</>;
    return (
      <div>
        <span>SESSION</span>
        <button type="button" onClick={() => setFin(true)}>
          finir
        </button>
      </div>
    );
  },
}));

vi.mock("./RecapPsyScreen.js", () => ({
  RecapPsyScreen: ({
    chapitreNom,
    autreTypeLabel,
    onAutreType,
    onAccueil,
  }: {
    chapitreNom: string;
    autreTypeLabel: string | null;
    onAutreType: () => void;
    onAccueil: () => void;
  }) => (
    <div>
      <span>RECAP {chapitreNom}</span>
      {autreTypeLabel ? (
        <button type="button" onClick={onAutreType}>
          Essayer {autreTypeLabel}
        </button>
      ) : null}
      <button type="button" onClick={onAccueil}>
        accueil
      </button>
    </div>
  ),
}));

const PILIERS = [
  {
    id: "psychotechniques",
    nom: "Psychotechniques",
    description: "desc",
    chapitres: [
      { id: "psy-logique", nom: "Logique", matiere: "logique", ordre: 1 },
      {
        id: "psy-calcul-mental",
        nom: "Calcul mental",
        matiere: "calcul_mental",
        ordre: 2,
      },
    ],
  },
];

function renderFlow(onQuitter = vi.fn()) {
  useListerPiliers.mockReturnValue({ data: PILIERS, isLoading: false });
  render(
    <PsyFlow
      chapitreId="psy-logique"
      chapitreNom="Logique"
      onQuitter={onQuitter}
    />,
  );
  return { onQuitter };
}

describe("PsyFlow", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("affiche d'abord la fiche méthode du type choisi", () => {
    renderFlow();

    expect(screen.getByText("FICHE Logique")).toBeTruthy();
    expect(screen.queryByText("SESSION")).toBeNull();
  });

  it("passe à la session sans chrono au tap sur « S'entraîner »", () => {
    renderFlow();

    fireEvent.click(screen.getByText("S'entraîner"));

    expect(screen.getByText("SESSION")).toBeTruthy();
    expect(sessionParams).toHaveBeenCalledWith(
      expect.objectContaining({
        chapitreId: "psy-logique",
        format: "qcm",
        modeChrono: false,
      }),
    );
  });

  it("affiche le récap en fin de session avec le bouton de l'autre type", () => {
    renderFlow();

    fireEvent.click(screen.getByText("S'entraîner"));
    fireEvent.click(screen.getByText("finir"));

    expect(screen.getByText("RECAP Logique")).toBeTruthy();
    expect(screen.getByText("Essayer le calcul mental")).toBeTruthy();
  });

  it("relance le parcours sur l'autre type depuis le récap", () => {
    renderFlow();

    fireEvent.click(screen.getByText("S'entraîner"));
    fireEvent.click(screen.getByText("finir"));
    fireEvent.click(screen.getByText("Essayer le calcul mental"));

    expect(screen.getByText("FICHE Calcul mental")).toBeTruthy();
  });

  it("quitte depuis le récap au tap sur « Retour à l'accueil »", () => {
    const { onQuitter } = renderFlow();

    fireEvent.click(screen.getByText("S'entraîner"));
    fireEvent.click(screen.getByText("finir"));
    fireEvent.click(screen.getByText("accueil"));

    expect(onQuitter).toHaveBeenCalled();
  });

  it("quitte depuis la fiche au tap sur « Plus tard »", () => {
    const { onQuitter } = renderFlow();

    fireEvent.click(screen.getByText("Plus tard"));

    expect(onQuitter).toHaveBeenCalled();
  });
});
