import { test, expect } from "@playwright/test";

/**
 * E2E #3 — Login con credenciales inválidas.
 * Requiere el backend corriendo (responde 401). Debe mostrar un mensaje de
 * error (toast) y permanecer en /login sin autenticar.
 */
test("login con contraseña incorrecta muestra error y no autentica", async ({
  page,
}) => {
  await page.goto("/login");

  await page.getByPlaceholder("tu@email.com").fill("owner@demo.com");
  await page.locator('input[type="password"]').fill("clave-incorrecta");
  await page.getByRole("button", { name: "Iniciar sesión" }).click();

  // Aparece el toast de error de Sonner (rol status/alert) con el mensaje del backend.
  await expect(page.getByText(/Invalid email or password/i)).toBeVisible({
    timeout: 15_000,
  });

  // Sigue en la pantalla de login.
  await expect(page).toHaveURL(/\/login$/);
});
