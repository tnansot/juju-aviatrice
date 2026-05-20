import { TRPCError, initTRPC } from "@trpc/server";
import { eq } from "drizzle-orm";
import superjson from "superjson";
import type { Db } from "../shared/db/client.js";
import { db as prodDb } from "../shared/db/client.js";
import { devices } from "../shared/db/schema.js";
import type { Context } from "./context.js";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

function createAuthMiddleware(db: Db) {
  return t.middleware(async ({ ctx, next }) => {
    const deviceId = ctx.req?.headers.get("X-Device-Id");
    if (!deviceId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "DEVICE_INCONNU",
      });
    }

    const device = db
      .select({ id: devices.id })
      .from(devices)
      .where(eq(devices.id, deviceId))
      .get();

    if (!device) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "DEVICE_INCONNU",
      });
    }

    return next({ ctx: { ...ctx, deviceId } });
  });
}

export const protectedProcedure = t.procedure.use(createAuthMiddleware(prodDb));

export function createProtectedProcedure(db: Db) {
  return t.procedure.use(createAuthMiddleware(db));
}
