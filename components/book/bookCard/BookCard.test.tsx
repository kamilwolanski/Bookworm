import { render, screen } from "@testing-library/react";
import { BookCard } from "./BookCard";
import { BookCardDTO } from "@/lib/books";

vi.mock("../UserBookOverlay", () => ({
  UserBookOverlay: () => <div data-testid="user-overlay" />,
}));
vi.mock("@/app/(main)/_components/UserEditionRating", () => ({
  default: () => <div data-testid="user-rating" />,
}));
vi.mock("@/app/(main)/_components/averageRating/AverageRating", () => ({
  default: () => <div data-testid="avg-rating" />,
}));
vi.mock(
  "@/app/(main)/books/[slug]/[editionId]/_components/BookCover.client",
  () => ({
    default: () => <div data-testid="cover-image" />,
  })
);
describe("BookCard", () => {
  const fakeBookItem: BookCardDTO = {
    book: {
      id: "1",
      slug: "example-book",
      authors: [
        {
          name: "Author One",
          id: "1",
        },
        {
          name: "Author Two",
          id: "2",
        },
      ],
      title: "",
      editions: [],
    },
    representativeEdition: {
      title: "Example Book Title",
      coverUrl: null,
      id: "1",
      subtitle: null,
    },
    ratings: {
      bookAverage: null,
      bookRatingCount: null,
    },
  };
  it("renders title, authors, cover fallback and correct link", () => {
    render(<BookCard bookItem={fakeBookItem} />);

    //title
    expect(
      screen.getByRole("heading", { name: /Example Book Title/i })
    ).toBeInTheDocument();

    //authors
    expect(
      screen.getByText(/Author One, Author Two/i)
    ).toBeInTheDocument();

    //cover fallback
    expect(screen.getByText(/Brak okładki/i)).toBeInTheDocument();
  });
});
