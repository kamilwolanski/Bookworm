import { render, screen } from "@testing-library/react";
import { StarRating } from "./StarRating";
describe("StarRating", () => {
  it("renders default star rating correctly", () => {
    render(<StarRating rating={3} />);
    expect(screen.getAllByRole("button")).toHaveLength(5);
  });

  it("renders star rating with custom maxRating", () => {
    render(<StarRating rating={4} maxRating={10} />);
    expect(screen.getAllByRole("button")).toHaveLength(10);
  });

  it("renders correctly interactive start", () => {
    render(<StarRating rating={2} interactive={true} />);
    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(5);
  });
});
