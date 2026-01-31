import { render, screen } from "@testing-library/react";
import { BookContextMenu } from "./BookContextMenu";
import userEvent from "@testing-library/user-event";
import { BookCardDTO } from "@/lib/books";
import { UserEditionDto } from "@/lib/user";

vi.mock("../../auth/LoginDialog", () => ({
  default: () => <div data-testid="login-dialog" />,
}));

vi.mock("../ratebook/RateBookStepperDialog", () => ({
  default: () => <div data-testid="rate-book-dialog" />,
}));

vi.mock("../addBookStepper/AddBookStepperDialog", () => ({
  default: () => <div data-testid="add-book-dialog" />,
}));

describe("BookContextMenu", () => {
  const fakeBook: BookCardDTO["book"] = {
    id: "1",
    slug: "example-book",
    title: "Example Book Title",
    authors: [
      {
        id: "1",
        name: "Author One",
      },
    ],
    editions: [
      {
        id: "1",
        title: "Example Edition 1",
        coverUrl: null,
        subtitle: null,
        language: "en",
        publicationDate: new Date("2023-01-01"),
        publishers: [
          {
            publisher: {
              id: "1",
              name: "Example Publisher",
              slug: "example-publisher",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            editionId: "",
            order: null,
            publisherId: "",
          },
        ],
      },
    ],
  };

  const fakeUserEditions: UserEditionDto[] = [];
  const representativeEditionTitle = "Example Edition 1";

  it("renders only menu button", () => {
    render(
      <BookContextMenu
        logIn={false}
        book={fakeBook}
        onShelf={false}
        representativeEditionTitle={representativeEditionTitle}
        userEditions={fakeUserEditions}
      />,
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
  it("renders context menu when clicked", async () => {
    const user = userEvent.setup();

    render(
      <BookContextMenu
        logIn={false}
        book={fakeBook}
        onShelf={false}
        representativeEditionTitle={representativeEditionTitle}
        userEditions={fakeUserEditions}
      />,
    );
    const menuButton = screen.getByRole("button");
    await user.click(menuButton);

    expect(screen.getByText("Wszystkie wydania")).toBeInTheDocument();
    expect(screen.getByText("Oceń")).toBeInTheDocument();
  });
});
