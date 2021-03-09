import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { CommPkgListWrapper, PreviewButton } from '../Scope/Scope';
import { Typography } from '@equinor/eds-core-react';
import EdsIcon from '../../../components/icons/EdsIcon';
import CompletionStatusIcon from '../../../components/icons/CompletionStatusIcon';
import { CompletionStatus, TaskPreview } from '../../../services/apiTypes';
import { AsyncStatus } from '../../../contexts/CommAppContext';
import useCommonHooks from '../../../utils/useCommonHooks';
import AsyncPage from '../../../components/AsyncPage';

const TaskPreviewButton = styled(PreviewButton)`
    & > div {
        flex: 2;
    }
`;

const Tasks = () => {
    const { params, api, url } = useCommonHooks();
    const [tasks, setTasks] = useState<TaskPreview[]>();
    const [fetchTasksStatus, setFetchTasksStatus] = useState(
        AsyncStatus.LOADING
    );

    useEffect(() => {
        (async () => {
            setFetchTasksStatus(AsyncStatus.LOADING);
            try {
                const tasksFromApi = await api.getTasks(
                    params.plant,
                    params.commPkg
                );
                setTasks(tasksFromApi);
                if (tasksFromApi.length < 1) {
                    setFetchTasksStatus(AsyncStatus.EMPTY_RESPONSE);
                } else {
                    setFetchTasksStatus(AsyncStatus.SUCCESS);
                }
            } catch {
                setFetchTasksStatus(AsyncStatus.ERROR);
            }
        })();
    }, [params.commPkg, params.plant, api]);

    return (
        <CommPkgListWrapper>
            <AsyncPage
                errorMessage={'Unable to load tasks. Please try again.'}
                fetchStatus={fetchTasksStatus}
                emptyContentMessage={'There are no tasks for this CommPkg.'}
            >
                <>
                    {tasks?.map((task) => (
                        <TaskPreviewButton
                            to={`${url}/${task.id}`}
                            key={task.id}
                        >
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
                            <EdsIcon name="chevron_right" />
                        </TaskPreviewButton>
                    ))}
                </>
            </AsyncPage>
        </CommPkgListWrapper>
    );
};

export default Tasks;
