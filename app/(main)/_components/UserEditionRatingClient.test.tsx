import { render, screen } from "@testing-library/react";
import UserEditionRatingClient from "./UserEditionRatingClient";

describe("UserEditionRatingClient", () => {
  const userEditionRatingClientFakeProps = {
    editionId: "1",
    userEditionRatingFromServer: {
      id: "1",
      editionId: "1",
      rating: 3,
      body: "",
    },
    isLogIn: true,
  };

  it("does not render the component if there is no rating", () => {
    const propsForLogOutUser = {
      ...userEditionRatingClientFakeProps,
      userEditionRatingFromServer: null,
    };

    render(<UserEditionRatingClient {...propsForLogOutUser} />);
    expect(screen.queryByText(/\/5/)).not.toBeInTheDocument();

  });
  it("renders correctly user edition rating", () => {
    render(<UserEditionRatingClient {...userEditionRatingClientFakeProps} />);
    expect(screen.getByText("3/5")).toBeInTheDocument();
  });
});
