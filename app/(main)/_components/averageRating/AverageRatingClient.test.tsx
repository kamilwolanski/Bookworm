import { BookRatingResponse } from "@/lib/books/rating";
import { render, screen } from "@testing-library/react";
import AverageRatingClient from "./AverageRatingClient";

describe("AverageRatingClient", () => {
  const fakeAverageRatingClientProps: {
    bookSlug: string;
    bookRatingFromServer: BookRatingResponse;
  } = {
    bookSlug: "hobbit",
    bookRatingFromServer: {
      averageRating: 3,
      ratingCount: 2,
    },
  };

  it("renders fallback rating from server", () => {
    render(<AverageRatingClient {...fakeAverageRatingClientProps} />);
    expect(screen.getByText("3/5")).toBeInTheDocument();
  });

  it("shows 0 when rating is null", () => {
    render(
      <AverageRatingClient
        bookSlug="hobbit"
        bookRatingFromServer={{ averageRating: 0, ratingCount: 0 }}
      />,
    );

    expect(screen.getByText("0/5")).toBeInTheDocument();
  });
});
