import { test, expect } from "@playwright/test";

/**
 * E2E #1 — La landing carga y permite navegar al login.
 * No depende del backend; valida el arranque del frontend y el ruteo.
 */
test("la landing carga y navega a iniciar sesión", async ({ page }) => {
  await page.goto("/");

  // La marca está presente.
  await expect(page.getByText("Mi Punto").first()).toBeVisible();

  // Navegar a Iniciar sesión.
  await page.getByRole("link", { name: "Iniciar sesión" }).first().click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(
    page.getByRole("heading", { name: "Iniciar sesión" }),
  ).toBeVisible();
});
