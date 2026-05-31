// bc-onboarding — tests FO-02 piliers (story S2)
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PiliersScreen } from "./PiliersScreen.js";

const { avancerMutate, sauterMutate, useListerPiliers } = vi.hoisted(() => ({
  avancerMutate: vi.fn((_input, opts) => opts?.onSuccess?.()),
  sauterMutate: vi.fn((_input, opts) => opts?.onSuccess?.()),
  useListerPiliers: vi.fn(),
}));

vi.mock("../trpc.js", () => ({
  trpc: {
    contenu: { listerPiliers: { useQuery: useListerPiliers } },
    onboarding: {
      avancerEtape: {
        useMutation: () => ({ mutate: avancerMutate, isPending: false }),
      },
      sauter: {
        useMutation: () => ({ mutate: sauterMutate, isPending: false }),
      },
    },
  },
}));

const PILIERS = [
  {
    id: "sciences",
    nom: "Sciences",
    description: "Maths + physique-chimie de 1ère.",
    chapitres: [],
  },
  {
    id: "psychotechniques",
    nom: "Psychotechniques",
    description: "Logique et calcul mental.",
    chapitres: [],
  },
];

describe("PiliersScreen (FO-02)", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("présente les deux piliers issus de contenu.listerPiliers", () => {
    useListerPiliers.mockReturnValue({ data: PILIERS, isLoading: false });
    render(<PiliersScreen onContinue={() => {}} onSkip={() => {}} />);

    expect(screen.getByText("Deux terrains d'entraînement")).toBeTruthy();
    expect(screen.getByText("Sciences")).toBeTruthy();
    expect(screen.getByText("Psychotechniques")).toBeTruthy();
    expect(screen.getByText("Maths + physique-chimie de 1ère.")).toBeTruthy();
    expect(screen.getByText("Logique et calcul mental.")).toBeTruthy();
  });

  it("n'affiche rien tant que les piliers chargent", () => {
    useListerPiliers.mockReturnValue({ data: undefined, isLoading: true });
    const { container } = render(
      <PiliersScreen onContinue={() => {}} onSkip={() => {}} />,
    );
    expect(container.textContent).toBe("");
  });

  it("Continuer avance à l'étape 2 puis navigue", () => {
    useListerPiliers.mockReturnValue({ data: PILIERS, isLoading: false });
    const onContinue = vi.fn();
    render(<PiliersScreen onContinue={onContinue} onSkip={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: "Continuer" }));

    expect(avancerMutate).toHaveBeenCalledWith(
      { etapeCompletee: 2 },
      expect.anything(),
    );
    expect(onContinue).toHaveBeenCalledOnce();
  });

  it("Passer saute sans reproche puis navigue", () => {
    useListerPiliers.mockReturnValue({ data: PILIERS, isLoading: false });
    const onSkip = vi.fn();
    render(<PiliersScreen onContinue={() => {}} onSkip={onSkip} />);

    fireEvent.click(screen.getByRole("button", { name: "Passer" }));

    expect(sauterMutate).toHaveBeenCalledOnce();
    expect(onSkip).toHaveBeenCalledOnce();
  });
});
