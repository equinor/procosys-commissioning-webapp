import React, { useContext } from 'react';
import styled from 'styled-components';
import CommPkgContext from '../../../contexts/CommPkgContext';
import { CommPkgListWrapper, PreviewButton } from '../Scope/Scope';
import greenStatusImage from '../../../assets/img/scopeStatusGreen.png';
import greyStatusImage from '../../../assets/img/scopeStatusGrey.png';
import { Typography } from '@equinor/eds-core-react';
import EdsIcon from '../../../components/icons/EdsIcon';
import CompletionStatusIcon from '../../../components/icons/CompletionStatusIcon';
import { CompletionStatus } from '../../../services/apiTypes';

const TaskPreviewButton = styled(PreviewButton)`
    & > div {
        flex: 2;
    }
`;

const Tasks = () => {
    const { tasks } = useContext(CommPkgContext);
    const tasksToDisplay = tasks.map((task) => (
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
    if (tasks.length < 1)
        return (
            <CommPkgListWrapper>
                <h3>No tasks to display.</h3>
            </CommPkgListWrapper>
        );
    return <CommPkgListWrapper>{tasksToDisplay}</CommPkgListWrapper>;
};

export default Tasks;
