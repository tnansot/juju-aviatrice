import { contenuRouter } from "../contenu/contenu.router.js";
import { identiteRouter } from "../identite/identite.router.js";
import { onboardingRouter } from "../onboarding/onboarding.router.js";
import { router } from "./trpc.js";

export const appRouter = router({
  identite: identiteRouter,
  onboarding: onboardingRouter,
  contenu: contenuRouter,
});

export type AppRouter = typeof appRouter;
