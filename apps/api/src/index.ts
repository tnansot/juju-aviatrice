import { serve } from "@hono/node-server";
import { trpcServer } from "@hono/trpc-server";
import { sql } from "drizzle-orm";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { db } from "./shared/db/client.js";
import { createContext } from "./trpc/context.js";
import { appRouter } from "./trpc/router.js";

const app = new Hono();

const allowedOrigins = process.env.CORS_ORIGIN?.split(",") ?? [
  "http://localhost:5173",
];

app.use(
  "/*",
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.get("/health", (c) => {
  try {
    db.run(sql`SELECT 1`);
    return c.json({ status: "ok" });
  } catch {
    return c.json({ status: "error" }, 503);
  }
});

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext,
  }),
);

const port = Number(process.env.PORT) || 3000;

async function start() {
  if (process.env.NODE_ENV === "development") {
    const { renderTrpcPanel } = await import("trpc-panel");
    app.get("/panel", (c) =>
      c.html(
        renderTrpcPanel(appRouter, {
          url: `http://localhost:${port}/trpc`,
        }),
      ),
    );
  }

  serve({ fetch: app.fetch, port }, (info) => {
    console.log(`API démarrée sur http://localhost:${info.port}`);
  });
}

start();

export { appRouter, type AppRouter } from "./trpc/router.js";
