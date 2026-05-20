// bc-identite — tests d'intégration (ADR-010, SQLite in-memory)
import { eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { devices, inviteTokens } from "../shared/db/schema.js";
import { createTestDb } from "../shared/db/test-client.js";
import { createCallerFactory, router } from "../trpc/trpc.js";
import { createIdentiteRouter } from "./identite.router.js";

const VALID_TOKEN = "test-invite-token";
const DEVICE_ID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";
const DEVICE_ID_2 = "b2c3d4e5-f6a7-8901-bcde-f12345678901";

function setup() {
  const db = createTestDb();
  const identite = createIdentiteRouter(db);
  const appRouter = router({ identite });
  const caller = createCallerFactory(appRouter)({
    req: null as unknown as Request,
  });
  return { db, caller };
}

function seedToken(
  db: ReturnType<typeof createTestDb>,
  token: string,
  maxUtilisations: number,
  utilisations = 0,
) {
  db.insert(inviteTokens)
    .values({ token, maxUtilisations, utilisations })
    .run();
}

describe("identite.enregistrerDevice", () => {
  it("crée un device avec un jeton valide", async () => {
    const { db, caller } = setup();
    seedToken(db, VALID_TOKEN, 3);

    const result = await caller.identite.enregistrerDevice({
      deviceId: DEVICE_ID,
      jetonInvitation: VALID_TOKEN,
    });

    expect(result).toEqual({ enregistre: true, premierAcces: true });
  });

  it("incrémente le compteur du jeton après création", async () => {
    const { db, caller } = setup();
    seedToken(db, VALID_TOKEN, 3);

    await caller.identite.enregistrerDevice({
      deviceId: DEVICE_ID,
      jetonInvitation: VALID_TOKEN,
    });

    const token = db
      .select()
      .from(inviteTokens)
      .where(eq(inviteTokens.token, VALID_TOKEN))
      .get();
    expect(token?.utilisations).toBe(1);
  });

  it("retourne premierAcces: false si le device existe déjà", async () => {
    const { db, caller } = setup();
    seedToken(db, VALID_TOKEN, 3);

    await caller.identite.enregistrerDevice({
      deviceId: DEVICE_ID,
      jetonInvitation: VALID_TOKEN,
    });

    const result = await caller.identite.enregistrerDevice({
      deviceId: DEVICE_ID,
      jetonInvitation: VALID_TOKEN,
    });

    expect(result).toEqual({ enregistre: true, premierAcces: false });
  });

  it("n'incrémente pas le compteur si le device existe déjà", async () => {
    const { db, caller } = setup();
    seedToken(db, VALID_TOKEN, 3);

    await caller.identite.enregistrerDevice({
      deviceId: DEVICE_ID,
      jetonInvitation: VALID_TOKEN,
    });
    await caller.identite.enregistrerDevice({
      deviceId: DEVICE_ID,
      jetonInvitation: VALID_TOKEN,
    });

    const token = db
      .select()
      .from(inviteTokens)
      .where(eq(inviteTokens.token, VALID_TOKEN))
      .get();
    expect(token?.utilisations).toBe(1);
  });

  it("rejette un jeton inexistant", async () => {
    const { caller } = setup();

    await expect(
      caller.identite.enregistrerDevice({
        deviceId: DEVICE_ID,
        jetonInvitation: "token-inexistant",
      }),
    ).rejects.toThrow("INVITE_INVALIDE");
  });

  it("rejette un jeton épuisé (max utilisations atteint)", async () => {
    const { db, caller } = setup();
    seedToken(db, VALID_TOKEN, 1, 1);

    await expect(
      caller.identite.enregistrerDevice({
        deviceId: DEVICE_ID,
        jetonInvitation: VALID_TOKEN,
      }),
    ).rejects.toThrow("INVITE_INVALIDE");
  });

  it("permet plusieurs devices avec le même jeton", async () => {
    const { db, caller } = setup();
    seedToken(db, VALID_TOKEN, 3);

    const r1 = await caller.identite.enregistrerDevice({
      deviceId: DEVICE_ID,
      jetonInvitation: VALID_TOKEN,
    });
    const r2 = await caller.identite.enregistrerDevice({
      deviceId: DEVICE_ID_2,
      jetonInvitation: VALID_TOKEN,
    });

    expect(r1.premierAcces).toBe(true);
    expect(r2.premierAcces).toBe(true);

    const token = db
      .select()
      .from(inviteTokens)
      .where(eq(inviteTokens.token, VALID_TOKEN))
      .get();
    expect(token?.utilisations).toBe(2);
  });
});

describe("identite.verifierDevice", () => {
  it("retourne valide: true pour un device enregistré", async () => {
    const { db, caller } = setup();
    seedToken(db, VALID_TOKEN, 3);

    await caller.identite.enregistrerDevice({
      deviceId: DEVICE_ID,
      jetonInvitation: VALID_TOKEN,
    });

    const result = await caller.identite.verifierDevice({
      deviceId: DEVICE_ID,
    });

    expect(result.valide).toBe(true);
    expect(result.etatOnboarding).toBe("non_demarre");
  });

  it("retourne valide: false pour un device inconnu", async () => {
    const { caller } = setup();

    const result = await caller.identite.verifierDevice({
      deviceId: DEVICE_ID,
    });

    expect(result).toEqual({ valide: false });
  });

  it("met à jour derniere_activite lors de la vérification", async () => {
    const { db, caller } = setup();
    seedToken(db, VALID_TOKEN, 3);

    await caller.identite.enregistrerDevice({
      deviceId: DEVICE_ID,
      jetonInvitation: VALID_TOKEN,
    });

    const before = db
      .select()
      .from(devices)
      .where(eq(devices.id, DEVICE_ID))
      .get();

    await caller.identite.verifierDevice({ deviceId: DEVICE_ID });

    const after = db
      .select()
      .from(devices)
      .where(eq(devices.id, DEVICE_ID))
      .get();

    expect(after?.lastSeenAt.getTime()).toBeGreaterThanOrEqual(
      before?.lastSeenAt.getTime() ?? 0,
    );
  });

  it("rejette un UUID invalide (validation Zod)", async () => {
    const { caller } = setup();

    await expect(
      caller.identite.verifierDevice({ deviceId: "pas-un-uuid" }),
    ).rejects.toThrow();
  });
});
