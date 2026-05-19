FROM node:22-slim AS dev
RUN corepack enable
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/web/package.json apps/web/
COPY apps/api/package.json apps/api/
COPY packages/shared/package.json packages/shared/
RUN pnpm install --frozen-lockfile
COPY packages/shared/ packages/shared/
COPY apps/api/src/trpc/ apps/api/src/trpc/
COPY apps/api/src/index.ts apps/api/src/index.ts
COPY tsconfig.json ./
COPY apps/web/tsconfig.json apps/web/
COPY apps/web/vite.config.ts apps/web/
COPY apps/web/index.html apps/web/
CMD ["pnpm", "--filter", "@juju-aviatrice/web", "dev"]
