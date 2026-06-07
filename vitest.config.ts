import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    // jsdom: provee window, localStorage, navigator y fetch para las pruebas.
    environment: "jsdom",
    globals: true,
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      // Coverage sobre la CAPA DE LOGICA (no UI): api, helpers, validaciones y
      // servicios. Se excluyen componentes/paginas, hooks de React Query y tipos.
      include: [
        "src/lib/api.ts",
        "src/lib/geo.ts",
        "src/lib/utils.ts",
        "src/modules/auth/schemas.ts",
        "src/modules/auth/services.ts",
        "src/modules/businesses/services.ts",
        "src/modules/reviews/services.ts",
      ],
      thresholds: {
        statements: 85,
        branches: 85,
        functions: 85,
        lines: 85,
      },
    },
  },
});
