import { AuthorDto } from "@/lib/author";
import { render, screen } from "@testing-library/react";
import AuthorDetails from "./AuthorDetails";
import { getAuthor } from "@/lib/author";

const baseAuthor: AuthorDto = {
  id: "1",
  name: "Adam Mickiewicz",
  bio: "Poeta romantyczny",
  imageUrl: "/avatar.jpg",
  birthDate: new Date("1798-12-24"),
  deathDate: new Date("1855-11-26"),
  nationality: "PL",
  authoredBooksCount: 3,
};

vi.mock("@/lib/author", () => ({
  getAuthor: vi.fn(),
}));

const mockedGetAuthor = vi.mocked(getAuthor);

vi.mock("../AuthorAvatar.client", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img data-testid="avatar" src={src} alt={alt} />
  ),
}));

vi.mock("@/components/ui/separator", () => ({
  Separator: () => <hr data-testid="separator" />,
}));

vi.mock("@/lib/constants/countries", () => ({
  COUNTRIES: [
    { value: "PL", label: "Polska", icon: "🇵🇱" },
    { value: "US", label: "USA", icon: "🇺🇸" },
  ],
}));

describe("AuthorDetails", () => {
  it("renders author name", async () => {
    mockedGetAuthor.mockResolvedValueOnce(baseAuthor);
    render(await AuthorDetails({ slug: "adam" }));
    expect(screen.getByText("Adam Mickiewicz")).toBeInTheDocument();
  });

  it("renders avatar when imageUrl exists", async () => {
    mockedGetAuthor.mockResolvedValue(baseAuthor);

    render(await AuthorDetails({ slug: "adam" }));

    expect(screen.getByTestId("avatar")).toHaveAttribute("src", "/avatar.jpg");
  });

  it("renders fallback when no avatar", async () => {
    mockedGetAuthor.mockResolvedValue({
      ...baseAuthor,
      imageUrl: null,
    });

    render(await AuthorDetails({ slug: "adam" }));

    expect(screen.getByText("Brak avatara")).toBeInTheDocument();
  });

  it("renders birth and death dates", async () => {
    mockedGetAuthor.mockResolvedValue(baseAuthor);

    render(await AuthorDetails({ slug: "adam" }));

    expect(screen.getByText(/1798/)).toBeInTheDocument();
    expect(screen.getByText(/1855/)).toBeInTheDocument();
  });

  it("shows 'obecnie' when no death date", async () => {
    mockedGetAuthor.mockResolvedValue({
      ...baseAuthor,
      deathDate: null,
    });

    render(await AuthorDetails({ slug: "adam" }));

    expect(screen.getByText(/obecnie/)).toBeInTheDocument();
  });

  it("renders nationality with emoji", async () => {
    mockedGetAuthor.mockResolvedValue(baseAuthor);

    render(await AuthorDetails({ slug: "adam" }));

    expect(screen.getByText("Polska")).toBeInTheDocument();
  });

  it("renders correct plural form: 1 książka", async () => {
    mockedGetAuthor.mockResolvedValue({
      ...baseAuthor,
      authoredBooksCount: 1,
    });

    render(await AuthorDetails({ slug: "adam" }));

    expect(screen.getByText("1 książka")).toBeInTheDocument();
  });

  it("renders correct plural form: 3 książki", async () => {
    mockedGetAuthor.mockResolvedValue({
      ...baseAuthor,
      authoredBooksCount: 3,
    });

    render(await AuthorDetails({ slug: "adam" }));

    expect(screen.getByText("3 książki")).toBeInTheDocument();
  });

  it("renders correct plural form: 5 książek", async () => {
    mockedGetAuthor.mockResolvedValue({
      ...baseAuthor,
      authoredBooksCount: 5,
    });

    render(await AuthorDetails({ slug: "adam" }));

    expect(screen.getByText("5 książek")).toBeInTheDocument();
  });

  it("renders bio section when exists", async () => {
    mockedGetAuthor.mockResolvedValue(baseAuthor);

    render(await AuthorDetails({ slug: "adam" }));

    expect(screen.getByText("Biografia")).toBeInTheDocument();
    expect(screen.getByTestId("separator")).toBeInTheDocument();
    expect(screen.getByText("Poeta romantyczny")).toBeInTheDocument();
  });

  it("calls getAuthor with correct slug", async () => {
    mockedGetAuthor.mockResolvedValue(baseAuthor);

    render(await AuthorDetails({ slug: "test-slug" }));

    expect(mockedGetAuthor).toHaveBeenCalledWith("test-slug");
  });
});
