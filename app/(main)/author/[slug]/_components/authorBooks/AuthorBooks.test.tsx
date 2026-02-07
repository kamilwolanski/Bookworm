import { AuthorBooksResponse, getAuthorsBooksCached } from "@/lib/author";
import { AuthorBooksProps } from "./AuthorBooks";
import { render, screen } from "@testing-library/react";
import AuthorBooks from "./AuthorBooks";
import { BookCardDTO } from "@/lib/books";

const mockAuthorBooksProps: AuthorBooksProps = {
  authorSlug: "/mickiewicz",
};

const exampleBookCard: BookCardDTO = {
  book: {
    id: "book_123",
    title: "Władca Pierścieni",
    slug: "wladca-pierscieni",
    authors: [
      {
        id: "author_1",
        name: "J.R.R. Tolkien",
      },
    ],
    editions: [
      {
        id: "edition_1",
        language: "pl",
        publicationDate: new Date("2001-05-15"),
        title: "Drużyna Pierścienia",
        subtitle: "Część pierwsza",
        coverUrl: "https://example.com/covers/druzyna.jpg",
        publishers: [
          {
            editionId: "edition_1",
            order: 1,
            publisherId: "publisher_1",
            publisher: {
              id: "publisher_1",
              name: "Zysk i S-ka",
              slug: "zysk-i-ska",
              createdAt: new Date("2010-01-01T10:00:00Z"),
              updatedAt: new Date("2020-01-01T10:00:00Z"),
            },
          },
        ],
      },
      {
        id: "edition_2",
        language: "en",
        publicationDate: new Date("1954-07-29"),
        title: "The Fellowship of the Ring",
        subtitle: null,
        coverUrl: "https://example.com/covers/fellowship.jpg",
        publishers: [
          {
            editionId: "edition_2",
            order: 1,
            publisherId: "publisher_2",
            publisher: {
              id: "publisher_2",
              name: "George Allen & Unwin",
              slug: "george-allen-unwin",
              createdAt: new Date("1935-01-01T00:00:00Z"),
              updatedAt: new Date("1990-01-01T00:00:00Z"),
            },
          },
        ],
      },
    ],
  },
  representativeEdition: {
    id: "edition_1",
    title: "Drużyna Pierścienia",
    subtitle: "Część pierwsza",
    coverUrl: "https://example.com/covers/druzyna.jpg",
  },
  ratings: {
    bookAverage: 4.7,
    bookRatingCount: 12543,
  },
};

const mockAuthorBooksResponse: AuthorBooksResponse = {
  authorbooks: [exampleBookCard],
  totalCount: 1,
};

vi.mock("@/lib/author", () => ({
  getAuthorsBooksCached: vi.fn(),
}));

const mockedGetAuthorsBooksCached = vi.mocked(getAuthorsBooksCached);

vi.mock("@/components/homepage/BookList", () => ({
  default: ({ books }: { books: BookCardDTO[] }) => (
    <div data-testid="book-list">
      {books.map((b) => (
        <div key={b.book.id}>{b.book.title}</div>
      ))}
    </div>
  ),
}));

describe("AuthorBooks", () => {
  it("renders section title", async () => {
    mockedGetAuthorsBooksCached.mockResolvedValueOnce({
      authorbooks: [],
      totalCount: 0,
    });
    render(await AuthorBooks(mockAuthorBooksProps));
  });
  it("calls getAuthorsBooksCached with correct slug", async () => {
    mockedGetAuthorsBooksCached.mockResolvedValueOnce({
      authorbooks: [],
      totalCount: 0,
    });

    await AuthorBooks({
      authorSlug: "tolkien",
    });

    expect(mockedGetAuthorsBooksCached).toHaveBeenCalledWith("tolkien");
  });

  it("renders BookList", async () => {
    mockedGetAuthorsBooksCached.mockResolvedValue(mockAuthorBooksResponse);

    const Component = await AuthorBooks({
      authorSlug: "test-author",
    });

    render(Component);

    expect(screen.getByTestId("book-list")).toBeInTheDocument();
  });

  it("renders empty list when no books", async () => {
    mockedGetAuthorsBooksCached.mockResolvedValue({
      authorbooks: [],
      totalCount: 0,
    });

    const Component = await AuthorBooks({
      authorSlug: "empty-author",
    });

    render(Component);

    const list = screen.getByTestId("book-list");
    expect(list).toBeInTheDocument();
    expect(list.children.length).toBe(0);
  });
});
