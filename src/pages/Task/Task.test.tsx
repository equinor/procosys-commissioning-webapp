import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import { withPlantContext } from "../../test/contexts";
import {
  dummySignedTaskResponse,
  dummyTaskResponse
} from "../../test/dummyData";
import { ENDPOINTS, causeApiError, rest, server } from "../../test/setupServer";
import Task from "./Task";

const renderTask = async (): Promise<void> => {
  render(withPlantContext({ Component: <Task /> }));
  expect(await screen.findByText("dummy-task-description")).toBeInTheDocument();
};

const editAndSaveComment = async (): Promise<void> => {
  const commentField = screen.getByTestId("commentField");
  fireEvent.focusOut(commentField);
};

describe("<Task/> loading errors", () => {
  it("Renders error message if unable to load task", async () => {
    causeApiError(ENDPOINTS.getTask, "get");
    await act(async () => {
      render(withPlantContext({ Component: <Task /> }));
    });

    await waitFor(async () => {
      const errorMessageInSnackbar = await screen.findByText(
        "Unable to load task"
      );
      expect(errorMessageInSnackbar).toBeInTheDocument();
    });
  });

  it("Renders error message if unable to load task attachments", async () => {
    causeApiError(ENDPOINTS.getTaskAttachments, "get");
    await act(async () => {
      render(withPlantContext({ Component: <Task /> }));
    });
    const errorMessageInCard = await screen.findByText(
      "Unable to load attachments. Please refresh or try again later."
    );
    expect(errorMessageInCard).toBeInTheDocument();
  });

  it("Renders error message if unable to load next task", async () => {
    causeApiError(ENDPOINTS.getTasks, "get");
    await act(async () => {
      render(withPlantContext({ Component: <Task /> }));
    });
    const errorMessageInCard = await screen.findByText(
      "Unable to retrieve next task. Please go back to task list."
    );
    expect(errorMessageInCard).toBeInTheDocument();
  });
});

describe("<Task/> after successful loading", () => {
  beforeEach(async () => {
    await act(async () => {
      renderTask();
    });
  });

  it("Allows user to edit and save a comment", async () => {
    await editAndSaveComment();
    const messageInSnackbar = await screen.findByText(
      "Comment successfully saved."
    );
    expect(messageInSnackbar).toBeInTheDocument();
  });

  it("Renders error message if user is unable to edit and save a comment", async () => {
    causeApiError(ENDPOINTS.putTaskComment, "put");
    await act(async () => {
      await editAndSaveComment();
    });
    const messageInSnackbar = await screen.findByText("dummy error");
    await waitFor(async () => {
      expect(messageInSnackbar).toBeInTheDocument();
    });
  });

  it("Allows user to sign and unsign the task, enabling and disabling the comment button", async () => {
    server.use(
      rest.get(
        ENDPOINTS.getTask,
        (
          request: any,
          response: (arg0: any, arg1: any) => any,
          context: {
            json: (arg0: {
              Id: number;
              Number: string;
              Title: string;
              DescriptionAsHtml: string;
              CommentAsHtml: string;
              UpdatedByUser: string;
              UpdatedAt: string;
              UpdatedByFirstName: string;
              UpdatedByLastName: string;
              SignedByUser: string;
              SignedByFirstName: string;
              SignedByLastName: string;
              SignedAt: string;
              VerifiedByUser: null;
              VerifiedByFirstName: null;
              VerifiedByLastName: null;
              VerifiedAt: null;
            }) => any;
            status: (arg0: number) => any;
          }
        ) => {
          return response(
            context.json(dummySignedTaskResponse),
            context.status(200)
          );
        }
      )
    );
    const commentField = screen.getByTestId("commentField");
    expect(commentField).toHaveAttribute("aria-readonly", "false");
    const signButton = screen.getByRole("button", { name: "Sign" });
    userEvent.click(signButton);
    const messageInSnackbar = await screen.findByText(
      "Task successfully signed"
    );
    expect(messageInSnackbar).toBeInTheDocument();
    expect(commentField).toHaveAttribute("aria-readonly", "true");
    const unsignButton = await screen.findByRole("button", {
      name: "Unsign"
    });
    expect(unsignButton).toBeInTheDocument();
    server.use(
      rest.get(
        ENDPOINTS.getTask,
        (
          request: any,
          response: (arg0: any, arg1: any) => any,
          context: {
            json: (arg0: {
              Id: number;
              Number: string;
              Title: string;
              DescriptionAsHtml: string;
              CommentAsHtml: string;
              UpdatedByUser: string;
              UpdatedAt: string;
              UpdatedByFirstName: string;
              UpdatedByLastName: string;
              SignedByUser: null;
              SignedByFirstName: null;
              SignedByLastName: null;
              SignedAt: null;
              VerifiedByUser: null;
              VerifiedByFirstName: null;
              VerifiedByLastName: null;
              VerifiedAt: null;
            }) => any;
            status: (arg0: number) => any;
          }
        ) => {
          return response(context.json(dummyTaskResponse), context.status(200));
        }
      )
    );
    userEvent.click(unsignButton);
    const messageInSnackbar2 = await screen.findByText(
      "Task successfully unsigned"
    );
    expect(messageInSnackbar2).toBeInTheDocument();
    expect(commentField).toHaveAttribute("aria-readonly", "false");
  });

  it("Renders error message when task signing fails", async () => {
    causeApiError(ENDPOINTS.postTaskSign, "post");
    const signButton = screen.getByRole("button", { name: "Sign" });
    await act(async () => {
      await userEvent.click(signButton);
    });
    const errorMessageInSnackbar = await screen.findByText(
      "Error: dummy error"
    );
    await waitFor(async () => {
      expect(errorMessageInSnackbar).toBeInTheDocument();
    });
  });

  it("Allows user to input and save a parameter value.", async () => {
    const measuredInput = screen.getByRole("textbox", {
      name: "Measured V"
    });

    await userEvent.type(measuredInput, "230");
    await userEvent.tab();

    const messageInSnackbar = await screen.findByText("Parameter value saved");

    expect(messageInSnackbar).toBeInTheDocument();
  });

  it("Renders error if failing to save parameter input.", async () => {
    causeApiError(ENDPOINTS.putTaskParameter, "put");
    const measuredInput = screen.getByRole("textbox", {
      name: "Measured V"
    });
    await userEvent.type(measuredInput, "230");
    await userEvent.tab();
    const errorMessageInSnackbar = await screen.findByText(
      "Error: dummy error"
    );

    await waitFor(() => {
      expect(errorMessageInSnackbar).toBeInTheDocument();
    });
  });

  it("Shows a list of attachments", async () => {
    const attachmentImage = await screen.findByAltText("Dummy image thumbnail");
    expect(attachmentImage).toBeInTheDocument();
  });

  it("Shows message if current task is the last task", async () => {
    const lastTaskMessageInCard = await screen.findByText(
      "This is the last task in the list."
    );
    expect(lastTaskMessageInCard).toBeInTheDocument();
  });
  it("Opens the image in full screen when clicking the thumbnail, and closes the modal when the close button is clicked", async () => {
    const attachmentImage = await screen.findByAltText("Dummy image thumbnail");
    await userEvent.click(attachmentImage);
    const closeModalButton = await screen.findByRole("button", {
      name: "Close"
    });
    expect(closeModalButton).toBeInTheDocument();
    await userEvent.click(closeModalButton);
    expect(closeModalButton).not.toBeInTheDocument();
  });

  test.todo("It shows the next task if there is one");
  test.todo(
    "It removes attachments section after loading it if there are no attachments to display"
  );
  test.todo(
    "It removes parameters section after loading it if there are no parameters to display"
  );
});
