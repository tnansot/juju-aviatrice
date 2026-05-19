import { appRouter } from "./router.js";
import { createCallerFactory } from "./trpc.js";

const createCallerFn = createCallerFactory(appRouter);

export function createCaller() {
  return createCallerFn({});
}
