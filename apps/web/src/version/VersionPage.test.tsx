import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { VersionPage } from "./VersionPage.js";

describe("VersionPage", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("affiche les infos front et les infos API après chargement", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: () =>
        Promise.resolve({
          status: "ok",
          version: { gitSha: "abc1234", buildDate: "2026-05-20T12:00:00Z" },
          db: { lastMigration: "0002_rename_columns_french" },
        }),
    } as Response);

    render(<VersionPage />);

    expect(screen.getByText("Frontend")).toBeTruthy();
    expect(screen.getByText("dev")).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByText("abc1234")).toBeTruthy();
      expect(screen.getByText("0002_rename_columns_french")).toBeTruthy();
    });
  });

  it("affiche un message d'erreur si l'API est indisponible", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Network Error"));

    render(<VersionPage />);

    await waitFor(() => {
      expect(screen.getByText(/Indisponible : Network Error/)).toBeTruthy();
    });
  });
});
