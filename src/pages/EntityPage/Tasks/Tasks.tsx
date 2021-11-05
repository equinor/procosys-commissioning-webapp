import React from 'react';
import styled from 'styled-components';
import { Typography } from '@equinor/eds-core-react';
import EdsIcon from '../../../components/icons/EdsIcon';
import CompletionStatusIcon from '../../../components/icons/CompletionStatusIcon';
import { CompletionStatus } from '../../../services/apiTypes';
import useCommonHooks from '../../../utils/useCommonHooks';
import AsyncPage from '../../../components/AsyncPage';
import useAsyncGet from '../../../utils/useAsyncGet';
import { CancelToken } from 'axios';
import { Link } from 'react-router-dom';

export const CommPkgListWrapper = styled.div`
    padding-bottom: 85px;
    & h3 {
        text-align: center;
        margin-top: 16px;
    }
`;

export const TaskPreviewButton = styled(Link)`
    display: flex;
    align-items: center;
    padding: 8px 0;
    margin: 10px 4% 0 4%;
    cursor: pointer;
    text-decoration: none;
    justify-content: space-between;
    & img {
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
    & svg {
        flex: 0.5;
    }
`;

const Tasks = (): JSX.Element => {
    const { params, api, url } = useCommonHooks();
    const { response: tasks, fetchStatus } = useAsyncGet(
        (cancelToken: CancelToken) =>
            api.getTasks(params.plant, params.entityId, cancelToken)
    );

    return (
        <AsyncPage
            errorMessage={'Unable to load tasks. Please try again.'}
            fetchStatus={fetchStatus}
            emptyContentMessage={'There are no tasks for this CommPkg.'}
        >
            <>
                {tasks?.map((task) => (
                    <TaskPreviewButton to={`${url}/${task.id}`} key={task.id}>
                        {task.isSigned ? (
                            <CompletionStatusIcon
                                status={CompletionStatus.OK}
                            />
                        ) : (
                            <CompletionStatusIcon
                                status={CompletionStatus.OS}
                            />
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
