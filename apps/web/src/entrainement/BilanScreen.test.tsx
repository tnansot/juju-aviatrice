// bc-entrainement — tests FO-07 bilan (S4)
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BilanScreen } from "./BilanScreen.js";

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
  miniSessionId: "ms-1",
  chapitreNom: "Géométrie",
  format: "flashcard" as const,
  nombreExercicesFaits: 4,
  dureeMinutes: 6,
  modeChrono: false,
  messageBilan: "4 exercices faits — beau travail, ton avatar avance.",
};

describe("BilanScreen (FO-07)", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("clôture la mini-session au montage et affiche un bilan sobre (sans note /N)", () => {
    useObtenirBilan.mockReturnValue({ data: BILAN });
    render(
      <BilanScreen
        miniSessionId="ms-1"
        onEncore={() => {}}
        onArreter={() => {}}
      />,
    );

    expect(terminerMutate).toHaveBeenCalledWith({ miniSessionId: "ms-1" });
    expect(screen.getByText("Session terminée")).toBeTruthy();
    expect(screen.getByText("4")).toBeTruthy();
    expect(screen.getByText("6 min")).toBeTruthy();
    expect(screen.getByText("exercices")).toBeTruthy();
    expect(document.body.textContent ?? "").not.toMatch(/\/\s*\d|%/);
  });

  it("propose Encore une session et Bonne nuit, et déclenche les callbacks", () => {
    useObtenirBilan.mockReturnValue({ data: BILAN });
    const onEncore = vi.fn();
    const onArreter = vi.fn();
    render(
      <BilanScreen
        miniSessionId="ms-1"
        onEncore={onEncore}
        onArreter={onArreter}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Encore une session" }));
    fireEvent.click(screen.getByRole("button", { name: "Bonne nuit" }));

    expect(onEncore).toHaveBeenCalledOnce();
    expect(onArreter).toHaveBeenCalledOnce();
  });
});
