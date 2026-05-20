import { identiteRouter } from "../identite/identite.router.js";
import { router } from "./trpc.js";

export const appRouter = router({
  identite: identiteRouter,
});

export type AppRouter = typeof appRouter;
