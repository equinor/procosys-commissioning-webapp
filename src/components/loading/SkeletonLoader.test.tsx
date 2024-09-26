import { render } from "@testing-library/react";
import SkeletonLoader from "./SkeletonLoader";

describe("<SkeletonLoader/>", () => {
  it("Renders component with loading text passed in", async () => {
    const { getByText } = render(<SkeletonLoader text="Test loading text" />);
    expect(await getByText("Test loading text")).toBeInTheDocument();
  });
});
