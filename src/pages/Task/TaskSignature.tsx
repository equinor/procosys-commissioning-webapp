import { Card } from '@equinor/eds-core-react';
import React from 'react';
import styled from 'styled-components';
import EdsIcon from '../../components/icons/EdsIcon';
import SkeletonLoadingPage from '../../components/loading/SkeletonLoader';
import { AsyncStatus } from '../../contexts/CommAppContext';
import { Task } from '../../services/apiTypes';
import { TaskCardWrapper } from './TaskDescription';
const { CardHeader, CardHeaderTitle } = Card;

type TaskSignatureProps = {
    isSigned: boolean;
    setIsSigned: React.Dispatch<React.SetStateAction<boolean>>;
    task: Task | undefined;
    fetchTaskStatus: AsyncStatus;
};

const TaskSignature = ({
    fetchTaskStatus,
    isSigned,
    setIsSigned,
    task,
}: TaskSignatureProps) => {
    const content = () => {
        if (fetchTaskStatus === AsyncStatus.SUCCESS && task) {
            return (
                <>
                    {isSigned ? (
                        <h5>{`Updated at ${new Date(
                            task.signedAt
                        ).toLocaleDateString('en-GB')} by ${
                            task.signedByFirstName
                        } ${task.signedByLastName} (${task.signedByUser})`}</h5>
                    ) : (
                        <h5>This task is not signed</h5>
                    )}
                </>
            );
        } else if (fetchTaskStatus === AsyncStatus.ERROR) {
            return <p>Unable to load. Please refresh or contact IT support.</p>;
        } else {
            return <SkeletonLoadingPage nrOfRows={3} />;
        }
    };
    return (
        <TaskCardWrapper>
            <Card>
                <CardHeader>
                    <CardHeaderTitle>
                        <h3>Sign</h3>
                    </CardHeaderTitle>
                    <EdsIcon name="paste" />
                </CardHeader>
                {content()}
            </Card>
        </TaskCardWrapper>
    );
};

export default TaskSignature;
