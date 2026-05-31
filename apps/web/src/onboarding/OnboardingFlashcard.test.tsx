// bc-onboarding — tests FO-03 flashcard (story S3)
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { OnboardingFlashcard } from "./OnboardingFlashcard.js";

const { avancerMutate, useFlashcard } = vi.hoisted(() => ({
  avancerMutate: vi.fn((_input, opts) => opts?.onSuccess?.()),
  useFlashcard: vi.fn(),
}));

vi.mock("../trpc.js", () => ({
  trpc: {
    contenu: { obtenirFlashcardEchantillon: { useQuery: useFlashcard } },
    onboarding: {
      avancerEtape: {
        useMutation: () => ({ mutate: avancerMutate, isPending: false }),
      },
    },
  },
}));

const CARD = {
  id: "onboarding-fc-001",
  faceQuestion: "Quelle est la dérivée de x² ?",
  faceReponse: "2x",
  correction: "La dérivée de xⁿ est nxⁿ⁻¹.",
};

describe("OnboardingFlashcard (FO-03)", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("affiche la question maths, pas la réponse avant retournement", () => {
    useFlashcard.mockReturnValue({ data: CARD, isLoading: false });
    render(<OnboardingFlashcard onComplete={() => {}} />);

    expect(screen.getByText("Quelle est la dérivée de x² ?")).toBeTruthy();
    expect(screen.queryByText("2x")).toBeNull();
  });

  it("retourne la carte et montre un feedback neutre (réponse, pas de verdict)", () => {
    useFlashcard.mockReturnValue({ data: CARD, isLoading: false });
    render(<OnboardingFlashcard onComplete={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /dérivée/ }));

    expect(screen.getByText("Réponse")).toBeTruthy();
    expect(screen.getByText("2x")).toBeTruthy();
    expect(screen.getByText("La dérivée de xⁿ est nxⁿ⁻¹.")).toBeTruthy();
  });

  it("Continuer complète l'étape 3 et déclenche la micro-progression avatar", () => {
    useFlashcard.mockReturnValue({ data: CARD, isLoading: false });
    render(<OnboardingFlashcard onComplete={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /dérivée/ }));
    fireEvent.click(screen.getByRole("button", { name: "Continuer" }));

    expect(avancerMutate).toHaveBeenCalledWith(
      { etapeCompletee: 3 },
      expect.anything(),
    );
    expect(screen.getByText("Ton avatar a fait un premier pas")).toBeTruthy();
  });

  it("C'est parti termine l'onboarding", () => {
    useFlashcard.mockReturnValue({ data: CARD, isLoading: false });
    const onComplete = vi.fn();
    render(<OnboardingFlashcard onComplete={onComplete} />);

    fireEvent.click(screen.getByRole("button", { name: /dérivée/ }));
    fireEvent.click(screen.getByRole("button", { name: "Continuer" }));
    fireEvent.click(screen.getByRole("button", { name: "C'est parti" }));

    expect(onComplete).toHaveBeenCalledOnce();
  });
});
