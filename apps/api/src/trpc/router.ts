import { publicProcedure, router } from "./trpc.js";

export const appRouter = router({
  hello: publicProcedure.query(() => {
    return { message: "Bienvenue sur l'application juju-aviatrice !" };
  }),
});

export type AppRouter = typeof appRouter;
