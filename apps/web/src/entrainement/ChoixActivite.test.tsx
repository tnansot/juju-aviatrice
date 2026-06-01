// bc-entrainement — tests FO-09 choix activité (S1)
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ChoixActivite } from "./ChoixActivite.js";

const { useListerPiliers } = vi.hoisted(() => ({
  useListerPiliers: vi.fn(),
}));

vi.mock("../trpc.js", () => ({
  trpc: {
    contenu: { listerPiliers: { useQuery: useListerPiliers } },
  },
}));

const PILIERS = [
  {
    id: "sciences",
    nom: "Sciences",
    description: "desc",
    chapitres: [
      { id: "maths-geometrie", nom: "Géométrie", ordre: 1 },
      { id: "maths-algebre", nom: "Algèbre", ordre: 2 },
    ],
  },
  {
    id: "psychotechniques",
    nom: "Psychotechniques",
    description: "desc",
    chapitres: [{ id: "psy-logique", nom: "Logique", ordre: 1 }],
  },
];

describe("ChoixActivite (FO-09)", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("affiche les deux piliers en phase 1", () => {
    useListerPiliers.mockReturnValue({ data: PILIERS, isLoading: false });
    render(<ChoixActivite onChoisir={() => {}} onRetour={() => {}} />);

    expect(screen.getByText("Choisis ton terrain")).toBeTruthy();
    expect(screen.getByText("Sciences")).toBeTruthy();
    expect(screen.getByText("Psychotechniques")).toBeTruthy();
  });

  it("affiche les chapitres après choix d'un pilier (2 taps max)", () => {
    useListerPiliers.mockReturnValue({ data: PILIERS, isLoading: false });
    render(<ChoixActivite onChoisir={() => {}} onRetour={() => {}} />);

    fireEvent.click(screen.getByText("Sciences"));

    expect(screen.getByText("Géométrie")).toBeTruthy();
    expect(screen.getByText("Algèbre")).toBeTruthy();
  });

  it("appelle onChoisir avec chapitre + format au tap sur un chapitre", () => {
    useListerPiliers.mockReturnValue({ data: PILIERS, isLoading: false });
    const onChoisir = vi.fn();
    render(<ChoixActivite onChoisir={onChoisir} onRetour={() => {}} />);

    fireEvent.click(screen.getByText("Sciences"));
    fireEvent.click(screen.getByText("Géométrie"));

    expect(onChoisir).toHaveBeenCalledWith(
      "maths-geometrie",
      "Géométrie",
      "flashcard",
    );
  });

  it("propose le format QCM pour le pilier psychotechniques", () => {
    useListerPiliers.mockReturnValue({ data: PILIERS, isLoading: false });
    const onChoisir = vi.fn();
    render(<ChoixActivite onChoisir={onChoisir} onRetour={() => {}} />);

    fireEvent.click(screen.getByText("Psychotechniques"));
    fireEvent.click(screen.getByText("Logique"));

    expect(onChoisir).toHaveBeenCalledWith("psy-logique", "Logique", "qcm");
  });
});
