// bc-identite — client tRPC avec header X-Device-Id (ADR-005)
import type { AppRouter } from "@juju-aviatrice/api/trpc";
import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import superjson from "superjson";
import { getDeviceId } from "./identite/use-device-id.js";

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${import.meta.env.VITE_API_URL ?? ""}/trpc`,
      transformer: superjson,
      headers() {
        return { "X-Device-Id": getDeviceId() };
      },
    }),
  ],
});
