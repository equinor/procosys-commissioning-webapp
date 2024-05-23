import { render, screen } from "@testing-library/react";
import { rest } from "msw";
import { AsyncStatus } from "../../../contexts/CommAppContext";
import { withPlantContext } from "../../../test/contexts";
import { ENDPOINTS, server } from "../../../test/setupServer";
import Tasks from "./Tasks";

const renderTasks = (): void => {
  render(
    withPlantContext({
      Component: <Tasks tasks={[]} fetchStatus={AsyncStatus.EMPTY_RESPONSE} />
    })
  );
};

describe("<Tasks />", () => {
  it("Renders placeholder text when an empty tasks is returned from API", async () => {
    server.use(
      rest.get(ENDPOINTS.getTasks, (request, response, context) => {
        return response(context.json([]), context.status(200));
      })
    );
    renderTasks();
    const noContentMessage = await screen.findByText(
      "There are no tasks for this CommPkg."
    );
    expect(noContentMessage).toBeInTheDocument();
  });
});
