import { Card, TextField } from '@equinor/eds-core-react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import EdsIcon from '../../components/icons/EdsIcon';
import SkeletonLoadingPage from '../../components/loading/SkeletonLoader';
import { AsyncStatus } from '../../contexts/CommAppContext';
import { Task } from '../../services/apiTypes';
const { CardHeader, CardHeaderTitle } = Card;

export const TaskCardWrapper = styled.div`
    & h3,
    p,
    h5 {
        margin: 0;
    }
    margin-bottom: 16px;
`;

export type TaskCommentDto = {
    TaskId: number;
    CommentAsHtml: string;
};

type TaskDescriptionProps = {
    task: Task | undefined;
    isSigned: boolean;
    fetchTaskStatus: AsyncStatus;
};

const TaskDescription = ({
    task,
    isSigned,
    fetchTaskStatus,
}: TaskDescriptionProps) => {
    const [comment, setComment] = useState('');
    let commentBeforeFocus = '';

    useEffect(() => {
        if (!task) return;
        setComment(task.commentAsHtml);
    }, [task]);

    const content = () => {
        if (fetchTaskStatus === AsyncStatus.SUCCESS && task) {
            return (
                <>
                    <h5>{task.title}</h5>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: `<p>${task.descriptionAsHtml}</p>`,
                        }}
                    ></div>

                    <TextField
                        id="TaskComment"
                        multiline
                        rows={4}
                        onFocus={() => (commentBeforeFocus = comment)}
                        value={comment}
                        helperText={`Updated at ${new Date(
                            task.updatedAt
                        ).toLocaleDateString('en-GB')} by ${
                            task.updatedByFirstName
                        } ${task.updatedByLastName} (${task.updatedByUser})`}
                        onChange={(
                            e: React.ChangeEvent<
                                HTMLInputElement | HTMLTextAreaElement
                            >
                        ) => setComment(e.target.value)}
                    />
                </>
            );
        } else if (fetchTaskStatus === AsyncStatus.ERROR) {
            return (
                <p>
                    Unable to load task. Please refresh or contact IT support.
                </p>
            );
        } else {
            return <SkeletonLoadingPage nrOfRows={3} />;
        }
    };

    return (
        <TaskCardWrapper>
            <Card>
                <CardHeader>
                    <CardHeaderTitle>
                        <h3>Task</h3>
                    </CardHeaderTitle>
                    <EdsIcon name="paste" />
                </CardHeader>
                {content()}
            </Card>
        </TaskCardWrapper>
    );
};

export default TaskDescription;
