import { appRouter } from "./router.js";
import { createCallerFactory } from "./trpc.js";

const createCallerFn = createCallerFactory(appRouter);

export function createCaller() {
  return createCallerFn({ req: null as unknown as Request });
}

export function createMockRequest(headers: Record<string, string> = {}) {
  return new Request("http://localhost/trpc", {
    headers,
  });
}
