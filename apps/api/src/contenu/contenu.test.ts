// bc-contenu — tests d'intégration des procédures catalogue (ADR-010)
import { describe, expect, it } from "vitest";
import { devices } from "../shared/db/schema.js";
import { createTestDb } from "../shared/db/test-client.js";
import { createCallerFactory, router } from "../trpc/trpc.js";
import { createContenuRouter } from "./contenu.router.js";

const DEVICE_ID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";

function setup() {
  const db = createTestDb();
  const contenu = createContenuRouter(db);
  const appRouter = router({ contenu });
  const caller = createCallerFactory(appRouter)({
    req: new Request("http://localhost/trpc", {
      headers: { "X-Device-Id": DEVICE_ID },
    }),
  });
  db.insert(devices)
    .values({
      id: DEVICE_ID,
      dateCreation: new Date(),
      derniereActivite: new Date(),
    })
    .run();
  return { caller };
}

describe("contenu.listerPiliers", () => {
  it("retourne les 2 piliers avec le pilier Sciences et ses 6 chapitres", async () => {
    const { caller } = setup();

    const piliers = await caller.contenu.listerPiliers();

    expect(piliers.map((p) => p.id)).toEqual(["sciences", "psychotechniques"]);
    const sciences = piliers.find((p) => p.id === "sciences");
    expect(sciences?.chapitres).toHaveLength(6);
  });

  it("expose matiere et formatsDisponibles pour chaque chapitre, triés par ordre", async () => {
    const { caller } = setup();

    const piliers = await caller.contenu.listerPiliers();
    const sciences = piliers.find((p) => p.id === "sciences");
    const ordres = sciences?.chapitres.map((c) => c.ordre) ?? [];

    expect([...ordres]).toEqual([...ordres].sort((a, b) => a - b));
    for (const chapitre of sciences?.chapitres ?? []) {
      expect(chapitre.matiere).toMatch(/maths|physique_chimie/);
      expect(chapitre.formatsDisponibles.length).toBeGreaterThan(0);
    }
  });
});

describe("contenu.obtenirChapitre", () => {
  it("retourne les métadonnées et le nombre d'exercices par format", async () => {
    const { caller } = setup();

    const chapitre = await caller.contenu.obtenirChapitre({
      chapitreId: "maths-geometrie",
    });

    expect(chapitre).toMatchObject({
      id: "maths-geometrie",
      pilierId: "sciences",
      nom: "Géométrie",
      matiere: "maths",
      formatsDisponibles: ["flashcard", "qcm"],
      ficheMethodeDisponible: false,
    });
    expect(chapitre.referenceBo).toContain("Spé maths");
    expect(chapitre.nombreExercicesParFormat).toEqual({ flashcard: 5, qcm: 5 });
  });

  it("rejette un chapitre inexistant avec NON_TROUVE", async () => {
    const { caller } = setup();

    await expect(
      caller.contenu.obtenirChapitre({ chapitreId: "chapitre-fantome" }),
    ).rejects.toThrow("NON_TROUVE");
  });
});

describe("contenu.chargerExercices", () => {
  it("retourne le nombre demandé de flashcards avec leurs deux faces", async () => {
    const { caller } = setup();

    const exercices = await caller.contenu.chargerExercices({
      chapitreId: "maths-geometrie",
      format: "flashcard",
      nombre: 4,
    });

    expect(exercices).toHaveLength(4);
    for (const ex of exercices) {
      expect(ex.format).toBe("flashcard");
      expect(ex.enonce).toHaveProperty("faceQuestion");
      expect(ex.enonce).toHaveProperty("faceReponse");
    }
  });

  it("ne transmet jamais la bonne réponse ni la correction d'un QCM", async () => {
    const { caller } = setup();

    const exercices = await caller.contenu.chargerExercices({
      chapitreId: "maths-geometrie",
      format: "qcm",
      nombre: 5,
    });

    for (const ex of exercices) {
      expect(ex.enonce).toHaveProperty("question");
      expect(ex.enonce).toHaveProperty("choix");
      expect(ex.enonce).not.toHaveProperty("bonneReponseId");
      expect(ex.enonce).not.toHaveProperty("correction");
      if ("choix" in ex.enonce) {
        for (const choix of ex.enonce.choix) {
          expect(choix).not.toHaveProperty("est_correct");
        }
      }
      expect(ex).not.toHaveProperty("correction");
    }
  });

  it("borne le nombre d'exercices entre 3 et 5", async () => {
    const { caller } = setup();

    const trop = await caller.contenu.chargerExercices({
      chapitreId: "maths-geometrie",
      format: "qcm",
      nombre: 5,
    });

    expect(trop.length).toBeLessThanOrEqual(5);
    expect(trop.length).toBeGreaterThanOrEqual(3);
  });
});
