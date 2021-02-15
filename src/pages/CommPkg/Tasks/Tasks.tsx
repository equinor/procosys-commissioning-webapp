import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { CommPkgListWrapper, PreviewButton } from '../Scope/Scope';
import { Typography } from '@equinor/eds-core-react';
import EdsIcon from '../../../components/icons/EdsIcon';
import CompletionStatusIcon from '../../../components/icons/CompletionStatusIcon';
import { CompletionStatus, TaskPreview } from '../../../services/apiTypes';
import { AsyncStatus } from '../../../contexts/CommAppContext';
import useCommonHooks from '../../../utils/useCommonHooks';
import SkeletonLoadingPage from '../../../components/loading/SkeletonLoader';

const TaskPreviewButton = styled(PreviewButton)`
    & > div {
        flex: 2;
    }
`;

const Tasks = () => {
    const { params, api } = useCommonHooks();
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
                setFetchTasksStatus(AsyncStatus.SUCCESS);
            } catch {
                setFetchTasksStatus(AsyncStatus.ERROR);
            }
        })();
    }, []);

    if (fetchTasksStatus === AsyncStatus.SUCCESS && tasks) {
        const tasksToDisplay = tasks?.map((task) => (
            <TaskPreviewButton to={``} key={task.id}>
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
                <EdsIcon name="chevron_right" />
            </TaskPreviewButton>
        ));
        if (tasks!.length < 1)
            return (
                <CommPkgListWrapper>
                    <h3>No tasks to display.</h3>
                </CommPkgListWrapper>
            );
        return <CommPkgListWrapper>{tasksToDisplay}</CommPkgListWrapper>;
    }

    return <SkeletonLoadingPage text={''} />;
};

export default Tasks;
