import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import { MemoryRouter, Route } from "react-router-dom";
import { withPlantContext } from "../../test/contexts";
import {
  dummySignedChecklistResponse,
  dummyVerifiedChecklistResponse
} from "../../test/dummyData";
import { ENDPOINTS, rest, server } from "../../test/setupServer";
import ChecklistPage from "./ChecklistPage";

const renderChecklistPage = (contentType?: string): void => {
  render(
    withPlantContext({
      Component: (
        <MemoryRouter
          initialEntries={[
            `/plant-name/project-name/Comm/33/checklist/10${
              contentType ? `/${contentType}` : ""
            }`
          ]}
        >
          <Route path="/:plant/:project/:searchType/:entityId/checklist/:checklistId">
            <ChecklistPage />
          </Route>
        </MemoryRouter>
      )
    })
  );
};

jest.mock("@equinor/procosys-webapp-components", () => ({
  ...jest.requireActual("@equinor/procosys-webapp-components"),
  removeSubdirectories: (url: string, num: number): string => "/"
}));

describe("<Checklist/> after loading", () => {
  beforeEach(async () => {
    await act(async () => {
      renderChecklistPage();
      // const tagDescription = await screen.findByText(
      //     'dummy-tag-description'
      // );
      // expect(tagDescription).toBeInTheDocument();
    });
  });

  it("Lets user check all and uncheck all items", async () => {
    const checkAllButton = screen.getByRole("button", {
      name: "Check all"
    });

    const firstCheckItem = screen.getByTestId("checked-2");
    const secondCheckItem = screen.getByTestId("checked-3");
    const firstCustomCheckItem = screen.getByTestId("custom-checked-4");
    const secondCustomCheckItem = screen.getByTestId("custom-checked-5");

    expect(firstCheckItem).toBeDisabled();
    expect(secondCheckItem).toBeEnabled();
    expect(secondCheckItem).not.toBeChecked();
    expect(firstCustomCheckItem).toBeChecked();
    expect(secondCustomCheckItem).toBeChecked();

    userEvent.click(checkAllButton);

    await waitFor(() => expect(checkAllButton).toBeDisabled());

    await screen.findByText("Changes saved.");

    expect(firstCheckItem).toBeDisabled();
    expect(secondCheckItem).toBeChecked();
    expect(firstCustomCheckItem).toBeChecked();
    expect(secondCustomCheckItem).toBeChecked();

    const uncheckAllButton = screen.getByRole("button", {
      name: "Uncheck all"
    });

    userEvent.click(uncheckAllButton);

    await screen.findByText("Uncheck complete.");
    expect(firstCheckItem).toBeDisabled();
    expect(secondCheckItem).not.toBeChecked();
    expect(firstCustomCheckItem).not.toBeChecked();
    expect(secondCustomCheckItem).not.toBeChecked();
  });

  it("Lets user sign/unsign a checklist, showing relevant messages", async () => {
    const signButton = screen.getByRole("button", { name: "Sign" });

    expect(signButton).toBeDisabled();
    const applicableMustBeCheckedWarning = screen.getByText(
      "All applicable items must be checked before signing."
    );
    expect(applicableMustBeCheckedWarning).toBeInTheDocument();

    const missingCheckItem = screen.getByTestId("checked-3");
    expect(missingCheckItem).toBeEnabled();
    userEvent.click(missingCheckItem);
    await screen.findByText("Change saved.");

    expect(applicableMustBeCheckedWarning).not.toBeInTheDocument();
    expect(signButton).toBeEnabled();
    server.use(
      rest.get(ENDPOINTS.getChecklist, (_, response, context) => {
        return response(context.json(dummySignedChecklistResponse));
      })
    );

    userEvent.click(signButton);

    await waitFor(() => expect(signButton).toBeDisabled());

    await screen.findByText("Signing complete.");

    const checklistIsSignedBanner = screen.getByText(
      "This checklist is signed. Unsign to make changes."
    );
    expect(checklistIsSignedBanner).toBeInTheDocument();
    await screen.findByText("Signed by", { exact: false });

    const verifyButton = screen.getByRole("button", { name: "Verify" });
    expect(verifyButton).toBeEnabled();
    server.use(
      rest.get(ENDPOINTS.getChecklist, (_, response, context) => {
        return response(context.json(dummyVerifiedChecklistResponse));
      })
    );

    userEvent.click(verifyButton);

    await waitFor(() => expect(verifyButton).toBeDisabled());

    await screen.findByText("Verifying complete.");
    const checklistIsVerifiedBanner = await screen.findByText(
      "This checklist is verified."
    );
    expect(checklistIsVerifiedBanner).toBeInTheDocument();
    await screen.findByText("Verified by", { exact: false });
  });
});
