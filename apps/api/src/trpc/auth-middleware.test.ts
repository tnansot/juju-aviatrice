// bc-identite — tests middleware auth device (ADR-005, ADR-006)
import { eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { devices, inviteTokens } from "../shared/db/schema.js";
import { createTestDb } from "../shared/db/test-client.js";
import {
  createCallerFactory,
  createProtectedProcedure,
  router,
} from "./trpc.js";

const DEVICE_ID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";

function setup() {
  const db = createTestDb();
  const protectedProc = createProtectedProcedure(db);

  const testRouter = router({
    protectedRoute: protectedProc.query(({ ctx }) => {
      return { deviceId: (ctx as { deviceId: string }).deviceId };
    }),
  });

  return {
    db,
    createCaller: (headers: Record<string, string> = {}) =>
      createCallerFactory(testRouter)({
        req: new Request("http://localhost/trpc", { headers }),
      }),
  };
}

function seedDevice(db: ReturnType<typeof createTestDb>, deviceId: string) {
  const now = new Date();
  db.insert(devices)
    .values({ id: deviceId, createdAt: now, lastSeenAt: now })
    .run();
}

describe("middleware authDevice", () => {
  it("autorise une requête avec un device ID valide", async () => {
    const { db, createCaller } = setup();
    seedDevice(db, DEVICE_ID);

    const caller = createCaller({ "X-Device-Id": DEVICE_ID });
    const result = await caller.protectedRoute();

    expect(result.deviceId).toBe(DEVICE_ID);
  });

  it("rejette une requête sans header X-Device-Id", async () => {
    const { createCaller } = setup();
    const caller = createCaller();

    await expect(caller.protectedRoute()).rejects.toThrow("DEVICE_INCONNU");
  });

  it("rejette une requête avec un device ID inconnu", async () => {
    const { createCaller } = setup();
    const caller = createCaller({
      "X-Device-Id": "99999999-aaaa-bbbb-cccc-dddddddddddd",
    });

    await expect(caller.protectedRoute()).rejects.toThrow("DEVICE_INCONNU");
  });

  it("injecte le deviceId dans le contexte tRPC", async () => {
    const { db, createCaller } = setup();
    seedDevice(db, DEVICE_ID);

    const caller = createCaller({ "X-Device-Id": DEVICE_ID });
    const result = await caller.protectedRoute();

    expect(result).toEqual({ deviceId: DEVICE_ID });
  });
});
