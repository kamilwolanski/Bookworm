import { render, screen } from "@testing-library/react";
import { UserBookOverlay } from "./UserBookOverlay";
import * as session from "@/lib/session";

vi.mock("@/lib/user", () => ({
  getTheUserInformationForEdition: () =>
    Promise.resolve({
      id: "1",
      bookId: "1",
      userState: {
        userEditions: [],
      },
    }),
}));


vi.mock("../userBookOverlayClient/UserBookOverlayClient", () => ({
  default: () => <div data-testid="user-book-overlay-client" />,
}));

describe("UserBookOverlay", () => {
  it("renders login dialog when user is not logged in", async () => {
    vi.spyOn(session, "getUserSession").mockResolvedValue(null);
    render(
      await UserBookOverlay({
        editionId: "1",
        book: {
          id: "1",
          slug: "example-book",
          title: "Example Book Title",
          authors: [
            {
              id: "1",
              name: "Author One",
            },
          ],
          editions: [],
        },
        representativeEditionId: "1",
        representativeEditionTitle: "Example Edition 1",
      }),
    );

    expect(screen.getByRole("button", { name: /Dodaj/i })).toBeInTheDocument();
  });

  it("renders UserBookOverlayClient when user is logged in", async () => {
    vi.spyOn(session, "getUserSession").mockResolvedValue({
      user: {
        id: "123",
        email: "test@example.com",
        name: "Test User",
        image: "",
        role: "USER",
      },
      expires: "",
    });

    render(
      await UserBookOverlay({
        editionId: "1",
        book: {
          id: "1",
          slug: "example-book",
          title: "Example Book Title",
          authors: [
            {
              id: "1",
              name: "Author One",
            },
          ],
          editions: [],
        },
        representativeEditionId: "1",
        representativeEditionTitle: "Example Edition 1",
      }),
    );

    expect(
      screen.queryByRole("button", { name: /Dodaj/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("user-book-overlay-client")).toBeInTheDocument();
  });
});
