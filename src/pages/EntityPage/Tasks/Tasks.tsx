import { Typography } from "@equinor/eds-core-react";
import { CompletionStatus } from "@equinor/procosys-webapp-components";
import { Link } from "react-router-dom";
import styled from "styled-components";
import AsyncPage from "../../../components/AsyncPage";
import CompletionStatusIcon from "../../../components/icons/CompletionStatusIcon";
import { AsyncStatus } from "../../../contexts/CommAppContext";
import { TaskPreview } from "../../../typings/apiTypes";
import useCommonHooks from "../../../utils/useCommonHooks";

export const TaskPreviewButton = styled(Link)`
  display: flex;
  align-items: center;
  padding: 8px 0;
  margin: 10px 4% 0 4%;
  cursor: pointer;
  text-decoration: none;
  justify-content: space-between;
  & > img {
    max-height: 20px;
    object-fit: contain;
    flex: 0.1;
  }
  & > div {
    margin-left: 24px;
    flex: 2;
    & p {
      margin: 0;
    }
  }
  & > svg {
    flex: 0.5;
  }
`;
interface TasksProps {
  fetchStatus: AsyncStatus;
  tasks: TaskPreview[] | undefined;
}

const Tasks = ({ fetchStatus, tasks }: TasksProps): JSX.Element => {
  const { url } = useCommonHooks();
  return (
    <AsyncPage
      errorMessage={"Unable to load tasks."}
      fetchStatus={fetchStatus}
      emptyContentMessage={"There are no tasks for this CommPkg."}
    >
      <>
        {tasks?.map((task) => (
          <TaskPreviewButton to={`${url}/${task.id}`} key={task.id}>
            {task.isSigned ? (
              <CompletionStatusIcon status={CompletionStatus.OK} />
            ) : (
              <CompletionStatusIcon status={CompletionStatus.OS} />
            )}
            <div>
              <label>{task.number}</label>
              <Typography variant="body_short" lines={3}>
                {task.title}
              </Typography>
            </div>
          </TaskPreviewButton>
        ))}
      </>
    </AsyncPage>
  );
};

export default Tasks;
