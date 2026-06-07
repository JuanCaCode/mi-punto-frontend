import { test, expect } from "@playwright/test";

/**
 * E2E #2 — Login exitoso con la cuenta demo de owner.
 * Requiere el backend corriendo y los datos demo cargados (seed.py):
 * owner@demo.com / owner1234 → debe redirigir al panel /owner.
 */
test("un owner inicia sesión y llega a su panel", async ({ page }) => {
  await page.goto("/login");

  await page.getByPlaceholder("tu@email.com").fill("owner@demo.com");
  await page.locator('input[type="password"]').fill("owner1234");
  await page.getByRole("button", { name: "Iniciar sesión" }).click();

  // Tras autenticarse, la app navega a la ruta del owner.
  await expect(page).toHaveURL(/\/owner/, { timeout: 15_000 });
});
