import { test as setup, expect } from "@playwright/test";

setup("login via google", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: /zaloguj się/i }).click();

  await page.getByRole("button", { name: /Kontynuuj z Google/i }).click();


  await page.waitForURL("http://localhost:3000/");

  await page.getByRole("button", { name: "Menu użytkownika" }).first().click();
  await expect(page.getByRole("menuitem", { name: /wyloguj się/i })).toBeVisible();

  // zapisz sesję
  await page.context().storageState({
    path: "playwright/.auth/user.json",
  });
});
