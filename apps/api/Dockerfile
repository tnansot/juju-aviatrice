FROM node:22-slim AS base
RUN corepack enable
WORKDIR /app

# --- dev stage ---
FROM base AS dev
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api/package.json apps/api/
COPY packages/shared/package.json packages/shared/
RUN pnpm install --frozen-lockfile
COPY packages/shared/ packages/shared/
COPY tsconfig.json ./
COPY apps/api/tsconfig.json apps/api/
CMD ["sh", "-c", "pnpm --filter @juju-aviatrice/api exec tsx src/migrate.ts && pnpm --filter @juju-aviatrice/api dev"]

# --- build stage ---
FROM base AS build
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api/package.json apps/api/
COPY packages/shared/package.json packages/shared/
RUN pnpm install --frozen-lockfile
COPY apps/api/ apps/api/
COPY packages/shared/ packages/shared/
COPY tsconfig.json ./
RUN cd apps/api && pnpm build

# --- prod stage ---
FROM base AS prod
ARG GIT_SHA=dev
ARG BUILD_DATE=unknown
RUN apt-get update && apt-get install -y sqlite3 && rm -rf /var/lib/apt/lists/*
ENV NODE_ENV=production
ENV GIT_SHA=$GIT_SHA
ENV BUILD_DATE=$BUILD_DATE
COPY --from=build /app/pnpm-lock.yaml /app/pnpm-workspace.yaml /app/package.json ./
COPY --from=build /app/apps/api/package.json apps/api/
COPY --from=build /app/packages/shared/package.json packages/shared/
RUN pnpm install --frozen-lockfile --prod
COPY --from=build /app/apps/api/dist apps/api/dist/
COPY --from=build /app/apps/api/drizzle apps/api/drizzle/
EXPOSE 3000
CMD ["sh", "-c", "node apps/api/dist/migrate.js && node apps/api/dist/index.js"]
