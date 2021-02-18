import { Card, TextField } from '@equinor/eds-core-react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import EdsIcon from '../../components/icons/EdsIcon';
import SkeletonLoadingPage from '../../components/loading/SkeletonLoader';
import { AsyncStatus } from '../../contexts/CommAppContext';
import { Task } from '../../services/apiTypes';
import { SHADOW } from '../../style/GlobalStyles';
import useCommonHooks from '../../utils/useCommonHooks';
const { CardHeader, CardHeaderTitle } = Card;

export const TaskCardWrapper = styled.div`
    & h3,
    h5 {
        margin: 0;
    }
    & p {
        margin-bottom: 8px;
        margin-top: 0;
    }
    margin-bottom: 16px;
    box-shadow: ${SHADOW};
    border-radius: 10px;
`;

export type TaskCommentDto = {
    TaskId: number;
    CommentAsHtml: string;
};

type TaskDescriptionProps = {
    task: Task | undefined;
    isSigned: boolean;
    fetchTaskStatus: AsyncStatus;
    setSnackbarText: React.Dispatch<React.SetStateAction<string>>;
};

const TaskDescription = ({
    task,
    isSigned,
    fetchTaskStatus,
    setSnackbarText,
}: TaskDescriptionProps) => {
    const { api, params } = useCommonHooks();
    const [comment, setComment] = useState('');
    const [putCommentStatus, setPutCommentStatus] = useState(
        AsyncStatus.INACTIVE
    );
    let commentBeforeFocus = '';

    useEffect(() => {
        if (!task) return;
        setComment(task.commentAsHtml);
    }, [task]);

    const handlePutComment = async () => {
        setPutCommentStatus(AsyncStatus.LOADING);
        const dto: TaskCommentDto = {
            TaskId: parseInt(params.taskId),
            CommentAsHtml: comment,
        };
        try {
            await api.putTaskComment(params.plant, dto);
            setPutCommentStatus(AsyncStatus.SUCCESS);
            setSnackbarText('Comment successfully saved.');
        } catch {
            setPutCommentStatus(AsyncStatus.ERROR);
            setSnackbarText('Unable to save comment.');
        }
    };

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
                        label="Comment"
                        disabled={
                            putCommentStatus === AsyncStatus.LOADING || isSigned
                        }
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
                        onBlur={() => {
                            comment !== commentBeforeFocus &&
                                handlePutComment();
                        }}
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
