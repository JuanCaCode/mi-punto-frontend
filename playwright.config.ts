import { defineConfig, devices } from "@playwright/test";

/**
 * Configuracion de pruebas End-to-End (E2E).
 *
 * baseURL apunta al frontend servido localmente (vite preview en :4173).
 * El backend debe estar corriendo en VITE_API_URL (lo levanta el pipeline de CI
 * o, en local, `uvicorn app.main:app`). Se puede sobreescribir con E2E_BASE_URL.
 */
const baseURL = process.env.E2E_BASE_URL || "http://localhost:4173";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["html", { open: "never" }], ["list"]] : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // Levanta el frontend (build + preview). Si ya hay uno corriendo, lo reutiliza.
  webServer: {
    command: "npm run build && npm run preview -- --port 4173 --strictPort",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
