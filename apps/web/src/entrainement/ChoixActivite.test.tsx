// bc-entrainement — tests FO-09 choix activité + gate FO-10 premier accès psy (S1)
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ChoixActivite } from "./ChoixActivite.js";

const { useListerPiliers, useObtenirEtat, marquerMutate } = vi.hoisted(() => ({
  useListerPiliers: vi.fn(),
  useObtenirEtat: vi.fn(),
  marquerMutate: vi.fn(),
}));

vi.mock("../trpc.js", () => ({
  trpc: {
    contenu: { listerPiliers: { useQuery: useListerPiliers } },
    onboarding: {
      obtenirEtat: { useQuery: useObtenirEtat },
      marquerPremierAccesPsy: {
        useMutation: () => ({ mutate: marquerMutate }),
      },
    },
    useUtils: () => ({
      onboarding: { obtenirEtat: { invalidate: vi.fn() } },
    }),
  },
}));

const PILIERS = [
  {
    id: "sciences",
    nom: "Sciences",
    description: "desc",
    chapitres: [
      { id: "maths-geometrie", nom: "Géométrie", matiere: "maths", ordre: 1 },
      { id: "maths-algebre", nom: "Algèbre", matiere: "maths", ordre: 2 },
    ],
  },
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

function mockEtat(premierAccesPsyFait: boolean) {
  useObtenirEtat.mockReturnValue({
    data: { etat: "complete", etapeCourante: null, premierAccesPsyFait },
    isLoading: false,
  });
}

const noop = () => {};

describe("ChoixActivite (FO-09)", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("affiche les deux piliers en phase 1", () => {
    useListerPiliers.mockReturnValue({ data: PILIERS, isLoading: false });
    mockEtat(true);
    render(
      <ChoixActivite onChoisir={noop} onChoisirPsy={noop} onRetour={noop} />,
    );

    expect(screen.getByText("Choisis ton terrain")).toBeTruthy();
    expect(screen.getByText("Sciences")).toBeTruthy();
    expect(screen.getByText("Psychotechniques")).toBeTruthy();
  });

  it("affiche les chapitres après choix du pilier Sciences", () => {
    useListerPiliers.mockReturnValue({ data: PILIERS, isLoading: false });
    mockEtat(true);
    render(
      <ChoixActivite onChoisir={noop} onChoisirPsy={noop} onRetour={noop} />,
    );

    fireEvent.click(screen.getByText("Sciences"));

    expect(screen.getByText("Géométrie")).toBeTruthy();
    expect(screen.getByText("Algèbre")).toBeTruthy();
  });

  it("appelle onChoisir avec chapitre + format au tap sur un chapitre sciences", () => {
    useListerPiliers.mockReturnValue({ data: PILIERS, isLoading: false });
    mockEtat(true);
    const onChoisir = vi.fn();
    render(
      <ChoixActivite
        onChoisir={onChoisir}
        onChoisirPsy={noop}
        onRetour={noop}
      />,
    );

    fireEvent.click(screen.getByText("Sciences"));
    fireEvent.click(screen.getByText("Géométrie"));

    expect(onChoisir).toHaveBeenCalledWith(
      "maths-geometrie",
      "Géométrie",
      "flashcard",
    );
  });

  it("affiche l'écran de bienvenue psy FO-10 au premier accès", () => {
    useListerPiliers.mockReturnValue({ data: PILIERS, isLoading: false });
    mockEtat(false);
    render(
      <ChoixActivite onChoisir={noop} onChoisirPsy={noop} onRetour={noop} />,
    );

    fireEvent.click(screen.getByText("Psychotechniques"));

    expect(screen.getByText("Bienvenue dans la zone Psy")).toBeTruthy();
    expect(screen.getByText("Recommandé en 1er")).toBeTruthy();
  });

  it("marque le premier accès et entre en flow psy au choix d'un type", () => {
    useListerPiliers.mockReturnValue({ data: PILIERS, isLoading: false });
    mockEtat(false);
    const onChoisirPsy = vi.fn();
    render(
      <ChoixActivite
        onChoisir={noop}
        onChoisirPsy={onChoisirPsy}
        onRetour={noop}
      />,
    );

    fireEvent.click(screen.getByText("Psychotechniques"));
    fireEvent.click(screen.getByText("Logique"));

    expect(marquerMutate).toHaveBeenCalled();
    expect(onChoisirPsy).toHaveBeenCalledWith("psy-logique", "Logique");
  });

  it("ne réaffiche pas FO-10 et entre directement en flow psy aux accès suivants", () => {
    useListerPiliers.mockReturnValue({ data: PILIERS, isLoading: false });
    mockEtat(true);
    const onChoisirPsy = vi.fn();
    render(
      <ChoixActivite
        onChoisir={noop}
        onChoisirPsy={onChoisirPsy}
        onRetour={noop}
      />,
    );

    fireEvent.click(screen.getByText("Psychotechniques"));
    expect(screen.queryByText("Bienvenue dans la zone Psy")).toBeNull();

    fireEvent.click(screen.getByText("Logique"));
    expect(onChoisirPsy).toHaveBeenCalledWith("psy-logique", "Logique");
    expect(marquerMutate).not.toHaveBeenCalled();
  });
});
