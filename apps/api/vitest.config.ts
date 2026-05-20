import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    env: {
      DATABASE_URL: ":memory:",
    },
  },
});
