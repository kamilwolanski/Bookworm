import { render, screen } from "@testing-library/react";
import UserBookOverlayClient, {
  UserBookOverlayClientProps,
} from "./UserBookOverlayClient";

vi.mock("@/components/book/addBookStepper/AddBookStepperDialog", () => ({
  default: () => <div data-testid="add-book-stepper-dialog" />,
}));

vi.mock("../bookContextMenu/BookContextMenu", () => ({
  default: () => <div data-testid="book-context-menu" />,
}));

describe("UserBookOverlayClient", () => {
  const fakeUserBookOverlayClientProps: UserBookOverlayClientProps = {
    editionUserResponseFromServer: {
      id: "1",
      bookId: "1",
      userState: {
        userEditions: [

        ],
      },
    },
    representativeEditionId: "1",
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
    representativeEditionTitle: "Example Edition 1",
  };

  it("renders correctly when the book is not on the shelf", () => {
    render(<UserBookOverlayClient {...fakeUserBookOverlayClientProps} />);
    expect(screen.queryByText(/Na półce/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Masz inne wydanie/i)).not.toBeInTheDocument();
  });

  it("renders correctly when the book is on the shelf with the same edition", () => {
    const propsWithSameEdition = {
      ...fakeUserBookOverlayClientProps,
      editionUserResponseFromServer: {
        ...fakeUserBookOverlayClientProps.editionUserResponseFromServer,
        userState: {
          userEditions: [
            {
              editionId: "1",
            },
          ],
        },
      },
    };
    render(<UserBookOverlayClient {...propsWithSameEdition} />);
    expect(screen.getByText(/Na półce/i)).toBeInTheDocument();
    expect(screen.queryByText(/Masz inne wydanie/i)).not.toBeInTheDocument();
  });

  it("renders correctly when the book is on the shelf with a different edition", () => {
    const propsWithOtherEdition = {
      ...fakeUserBookOverlayClientProps,
      editionUserResponseFromServer: {
        ...fakeUserBookOverlayClientProps.editionUserResponseFromServer,
        userState: {
          userEditions: [
            {
              editionId: "2",
            },
          ],
        },
      },
    };
    render(<UserBookOverlayClient {...propsWithOtherEdition} />);
    expect(screen.getByText(/Masz inne wydanie/i)).toBeInTheDocument();
    expect(screen.queryByText(/Na półce/i)).not.toBeInTheDocument();
  });

  it("includes AddBookStepperDialog and BookContextMenu components", () => {
    render(<UserBookOverlayClient {...fakeUserBookOverlayClientProps} />);
    expect(
      screen.getByTestId("add-book-stepper-dialog"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("book-context-menu")).toBeInTheDocument();
  });
});
