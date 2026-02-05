import { AuthorDto } from "@/lib/author";
import { render, screen } from "@testing-library/react";
import AuthorDetails from "./AuthorDetails";
import { getAuthor } from "@/lib/author";
import { Mock } from "vitest";

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

vi.mock("../AuthorAvatar.client", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img data-testid="avatar" src={src} alt={alt} />
  ),
}));

describe("AuthorDetails", () => {
  it("renders author name", async () => {
    (getAuthor as Mock).mockResolvedValueOnce(baseAuthor);
    render(await AuthorDetails({ slug: "adam" }));

    expect(screen.getByText("Adam Mickiewicz")).toBeInTheDocument();
  });
});
