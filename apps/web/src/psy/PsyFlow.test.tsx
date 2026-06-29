// bc-contenu, bc-entrainement — tests orchestrateur PsyFlow (F6 S2)
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PsyFlow } from "./PsyFlow.js";

const { sessionParams } = vi.hoisted(() => ({ sessionParams: vi.fn() }));

vi.mock("./FicheMethodeScreen.js", () => ({
  FicheMethodeScreen: ({
    onSentrainer,
    onPlusTard,
  }: {
    onSentrainer: () => void;
    onPlusTard: () => void;
  }) => (
    <div>
      <span>FICHE</span>
      <button type="button" onClick={onSentrainer}>
        S'entraîner
      </button>
      <button type="button" onClick={onPlusTard}>
        Plus tard
      </button>
    </div>
  ),
}));

vi.mock("../entrainement/SessionFlow.js", () => ({
  SessionFlow: ({ params }: { params: unknown }) => {
    sessionParams(params);
    return <div>SESSION</div>;
  },
}));

describe("PsyFlow", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("affiche d'abord la fiche méthode", () => {
    render(
      <PsyFlow
        chapitreId="psy-logique"
        chapitreNom="Logique"
        onQuitter={() => {}}
      />,
    );

    expect(screen.getByText("FICHE")).toBeTruthy();
    expect(screen.queryByText("SESSION")).toBeNull();
  });

  it("passe à la session sans chrono au tap sur « S'entraîner »", () => {
    render(
      <PsyFlow
        chapitreId="psy-logique"
        chapitreNom="Logique"
        onQuitter={() => {}}
      />,
    );

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

  it("quitte au tap sur « Plus tard »", () => {
    const onQuitter = vi.fn();
    render(
      <PsyFlow
        chapitreId="psy-logique"
        chapitreNom="Logique"
        onQuitter={onQuitter}
      />,
    );

    fireEvent.click(screen.getByText("Plus tard"));

    expect(onQuitter).toHaveBeenCalled();
  });
});
