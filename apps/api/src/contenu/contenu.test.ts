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
