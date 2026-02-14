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

test("A user can search for a book and open its details.", async ({ page }) => {
  await page.goto("/");

  await page.getByPlaceholder(
    "Wpisz tytuł książki, autora lub wydawnictwo...",
  ).fill("tolkien");

  await page.getByRole("button", { name: "Szukaj" }).click();

  await expect(page).toHaveURL(/\/books\?search=tolkien/);

  const booksList = page.getByTestId("books-list");
  await expect(booksList).toBeVisible();

  const cards = booksList.getByTestId("book-card");

  await expect(cards.first()).toBeVisible();

  const firstCard = cards.first();
  const title = await firstCard.locator("h3").textContent();

  expect(title).not.toBeNull();

  await firstCard.getByRole("link").click();

  await expect(page).toHaveURL(/\/books\/.+\/.+/);

  await expect(
    page.getByRole("heading", { name: title!.trim() }),
  ).toBeVisible();
});

