// bc-onboarding — tests FO-01 bienvenue (story S1)
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { WelcomeScreen } from "./WelcomeScreen.js";

const { avancerMutate, sauterMutate } = vi.hoisted(() => ({
  // mutate(input, opts) déclenche immédiatement onSuccess pour tester la navigation
  avancerMutate: vi.fn((_input, opts) => opts?.onSuccess?.()),
  sauterMutate: vi.fn((_input, opts) => opts?.onSuccess?.()),
}));

vi.mock("../trpc.js", () => ({
  trpc: {
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

describe("WelcomeScreen (FO-01)", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("accueille par le prénom avec l'avatar au stade 1, sans formulaire", () => {
    const { container } = render(
      <WelcomeScreen onContinue={() => {}} onSkip={() => {}} />,
    );
    expect(screen.getByText("Salut Juju")).toBeTruthy();
    expect(screen.getByText("Stade 1")).toBeTruthy();
    expect(container.querySelectorAll("input")).toHaveLength(0);
    expect(container.querySelectorAll("form")).toHaveLength(0);
  });

  it("Continuer avance à l'étape 1 puis navigue", () => {
    const onContinue = vi.fn();
    render(<WelcomeScreen onContinue={onContinue} onSkip={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: "Continuer" }));

    expect(avancerMutate).toHaveBeenCalledWith(
      { etapeCompletee: 1 },
      expect.anything(),
    );
    expect(onContinue).toHaveBeenCalledOnce();
  });

  it("Passer saute l'onboarding puis navigue vers l'accueil", () => {
    const onSkip = vi.fn();
    render(<WelcomeScreen onContinue={() => {}} onSkip={onSkip} />);

    fireEvent.click(screen.getByRole("button", { name: "Passer" }));

    expect(sauterMutate).toHaveBeenCalledOnce();
    expect(onSkip).toHaveBeenCalledOnce();
  });
});
