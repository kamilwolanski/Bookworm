import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("renders hero section", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        name: /Odkryj świat książek z BookWorm/i,
      }),
    ).toBeVisible();

    await expect(
      page.getByPlaceholder("Wpisz tytuł książki, autora lub wydawnictwo..."),
    ).toBeVisible();

    await expect(page.getByRole("button", { name: "Szukaj" })).toBeVisible();
  });
});
