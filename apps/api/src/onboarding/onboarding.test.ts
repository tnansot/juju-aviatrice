// bc-onboarding — tests d'intégration (ADR-010, SQLite in-memory)
import { describe, expect, it } from "vitest";
import { devices } from "../shared/db/schema.js";
import { createTestDb } from "../shared/db/test-client.js";
import { createCallerFactory, router } from "../trpc/trpc.js";
import { createOnboardingRouter } from "./onboarding.router.js";

const DEVICE_ID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";

function setup() {
  const db = createTestDb();
  const onboarding = createOnboardingRouter(db);
  const appRouter = router({ onboarding });
  const caller = createCallerFactory(appRouter)({
    req: new Request("http://localhost/trpc", {
      headers: { "X-Device-Id": DEVICE_ID },
    }),
  });
  return { db, caller };
}

function seedDevice(db: ReturnType<typeof createTestDb>) {
  db.insert(devices)
    .values({
      id: DEVICE_ID,
      dateCreation: new Date(),
      derniereActivite: new Date(),
    })
    .run();
}

describe("onboarding.obtenirEtat", () => {
  it("retourne non_demarre si aucun enregistrement onboarding", async () => {
    const { db, caller } = setup();
    seedDevice(db);

    const result = await caller.onboarding.obtenirEtat();

    expect(result).toEqual({
      etat: "non_demarre",
      etapeCourante: null,
      premierAccesPsyFait: false,
    });
  });

  it("retourne l'état courant après avancement", async () => {
    const { db, caller } = setup();
    seedDevice(db);

    await caller.onboarding.avancerEtape({ etapeCompletee: 1 });
    const result = await caller.onboarding.obtenirEtat();

    expect(result).toEqual({
      etat: "en_cours",
      etapeCourante: 2,
      premierAccesPsyFait: false,
    });
  });
});

describe("onboarding.avancerEtape", () => {
  it("passe de non_demarre à en_cours après étape 1", async () => {
    const { db, caller } = setup();
    seedDevice(db);

    const result = await caller.onboarding.avancerEtape({ etapeCompletee: 1 });

    expect(result).toEqual({ etat: "en_cours", etapeSuivante: 2 });
  });

  it("avance à l'étape 3 après complétion de l'étape 2", async () => {
    const { db, caller } = setup();
    seedDevice(db);

    await caller.onboarding.avancerEtape({ etapeCompletee: 1 });
    const result = await caller.onboarding.avancerEtape({ etapeCompletee: 2 });

    expect(result).toEqual({ etat: "en_cours", etapeSuivante: 3 });
  });

  it("complète l'onboarding après étape 3", async () => {
    const { db, caller } = setup();
    seedDevice(db);

    await caller.onboarding.avancerEtape({ etapeCompletee: 1 });
    await caller.onboarding.avancerEtape({ etapeCompletee: 2 });
    const result = await caller.onboarding.avancerEtape({ etapeCompletee: 3 });

    expect(result).toEqual({ etat: "complete", etapeSuivante: null });
  });

  it("est idempotent si déjà complété", async () => {
    const { db, caller } = setup();
    seedDevice(db);

    await caller.onboarding.avancerEtape({ etapeCompletee: 1 });
    await caller.onboarding.avancerEtape({ etapeCompletee: 2 });
    await caller.onboarding.avancerEtape({ etapeCompletee: 3 });

    const result = await caller.onboarding.avancerEtape({ etapeCompletee: 1 });

    expect(result).toEqual({ etat: "complete", etapeSuivante: null });
  });
});

describe("onboarding.sauter", () => {
  it("marque l'onboarding comme sauté depuis non_demarre", async () => {
    const { db, caller } = setup();
    seedDevice(db);

    const result = await caller.onboarding.sauter();

    expect(result).toEqual({ etat: "saute" });
  });

  it("marque l'onboarding comme sauté depuis en_cours", async () => {
    const { db, caller } = setup();
    seedDevice(db);

    await caller.onboarding.avancerEtape({ etapeCompletee: 1 });
    const result = await caller.onboarding.sauter();

    expect(result).toEqual({ etat: "saute" });
  });

  it("est idempotent si déjà sauté", async () => {
    const { db, caller } = setup();
    seedDevice(db);

    await caller.onboarding.sauter();
    const result = await caller.onboarding.sauter();

    expect(result).toEqual({ etat: "saute" });
  });

  it("est idempotent si déjà complété", async () => {
    const { db, caller } = setup();
    seedDevice(db);

    await caller.onboarding.avancerEtape({ etapeCompletee: 1 });
    await caller.onboarding.avancerEtape({ etapeCompletee: 2 });
    await caller.onboarding.avancerEtape({ etapeCompletee: 3 });

    const result = await caller.onboarding.sauter();

    expect(result).toEqual({ etat: "saute" });
  });

  it("l'état est bien saute quand on relit après saut", async () => {
    const { db, caller } = setup();
    seedDevice(db);

    await caller.onboarding.sauter();
    const etat = await caller.onboarding.obtenirEtat();

    expect(etat.etat).toBe("saute");
    expect(etat.etapeCourante).toBeNull();
  });
});

describe("onboarding.marquerPremierAccesPsy", () => {
  it("marque le premier accès psy et retourne le message d'accueil", async () => {
    const { db, caller } = setup();
    seedDevice(db);
    await caller.onboarding.avancerEtape({ etapeCompletee: 1 });

    const result = await caller.onboarding.marquerPremierAccesPsy();

    expect(result.premierAccesPsyFait).toBe(true);
    expect(result.messageAccueil.length).toBeGreaterThan(0);
  });

  it("persiste le flag premierAccesPsyFait pour les accès suivants", async () => {
    const { db, caller } = setup();
    seedDevice(db);

    await caller.onboarding.marquerPremierAccesPsy();
    const etat = await caller.onboarding.obtenirEtat();

    expect(etat.premierAccesPsyFait).toBe(true);
  });

  it("est idempotent si le premier accès psy est déjà marqué", async () => {
    const { db, caller } = setup();
    seedDevice(db);

    await caller.onboarding.marquerPremierAccesPsy();
    const result = await caller.onboarding.marquerPremierAccesPsy();

    expect(result.premierAccesPsyFait).toBe(true);
  });

  it("ne perturbe pas un onboarding déjà complété", async () => {
    const { db, caller } = setup();
    seedDevice(db);
    await caller.onboarding.avancerEtape({ etapeCompletee: 1 });
    await caller.onboarding.avancerEtape({ etapeCompletee: 2 });
    await caller.onboarding.avancerEtape({ etapeCompletee: 3 });

    await caller.onboarding.marquerPremierAccesPsy();
    const etat = await caller.onboarding.obtenirEtat();

    expect(etat.etat).toBe("complete");
    expect(etat.premierAccesPsyFait).toBe(true);
  });
});

describe("interruption et réouverture", () => {
  it("onboarding en_cours → réouverture = état conservé", async () => {
    const { db, caller } = setup();
    seedDevice(db);

    await caller.onboarding.avancerEtape({ etapeCompletee: 1 });

    const etat = await caller.onboarding.obtenirEtat();
    expect(etat.etat).toBe("en_cours");
    expect(etat.etapeCourante).toBe(2);
  });
});
