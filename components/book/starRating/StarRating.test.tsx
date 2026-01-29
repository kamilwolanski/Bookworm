import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("evokes onClick when star is clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<StarRating rating={2} interactive onClick={handleClick} />);
    const stars = screen.getAllByRole("radio");
    await user.click(stars[3]);
    expect(handleClick).toHaveBeenCalledWith(4);
  });

  it("doesn't trigger onClick when it's not interactive", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<StarRating rating={2} onClick={handleClick} />);
    const stars = screen.getAllByRole("button");
    await user.click(stars[3]);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("disables buttons when isPending is true", () => {
    render(<StarRating rating={3} interactive isPending={true} />);
    const stars = screen.getAllByRole("radio");
    stars.forEach((star) => {
      expect(star).toBeDisabled();
    });
  });

  it("applies correct size classes", () => {
    const { rerender } = render(
      <StarRating rating={3} size="sm" interactive={true} />,
    );
    let stars = screen.getAllByRole("radio");
    stars.forEach((star) => {
      expect(star.firstChild).toHaveClass("w-4 h-4");
    });

    rerender(<StarRating rating={3} size="md" interactive={true} />);
    stars = screen.getAllByRole("radio");
    stars.forEach((star) => {
      expect(star.firstChild).toHaveClass("w-5 h-5");
    });

    rerender(<StarRating rating={3} size="lg" interactive={true} />);
    stars = screen.getAllByRole("radio");
    stars.forEach((star) => {
      expect(star.firstChild).toHaveClass("w-6 h-6");
    });
  });
});
