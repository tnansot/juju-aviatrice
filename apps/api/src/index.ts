import path from "node:path";
import { fileURLToPath } from "node:url";
import { serve } from "@hono/node-server";
import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { healthHandler, loadJournalEntries } from "./health.js";
import { db } from "./shared/db/client.js";
import { createContext } from "./trpc/context.js";
import { appRouter } from "./trpc/router.js";

const app = new Hono();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Même chemin que migrate.ts : le dossier drizzle/ est livré à côté de dist/.
const journalEntries = loadJournalEntries(
  path.resolve(__dirname, "../drizzle"),
);

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

const apiVersion = {
  gitSha: process.env.GIT_SHA || "dev",
  buildDate: process.env.BUILD_DATE || "unknown",
};

app.get("/health", healthHandler({ db, journalEntries, version: apiVersion }));

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
