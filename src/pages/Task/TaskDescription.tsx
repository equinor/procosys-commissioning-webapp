import { Button, Card, Divider } from '@equinor/eds-core-react';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import SkeletonLoadingPage from '../../components/loading/SkeletonLoader';
import { AsyncStatus } from '../../contexts/CommAppContext';
import { Task } from '../../services/apiTypes';
import useCommonHooks from '../../utils/useCommonHooks';
import { TaskCardWrapper } from './Task';
const { CardHeader, CardHeaderTitle } = Card;

const CommentField = styled.div<{ editable: boolean }>`
    background-color: #fafafa;
    padding: 12px;
    font-family: 'Equinor';
    min-height: 80px;
    border-bottom: ${(props) => (props.editable ? '1px solid black' : 'none')};
`;

const CommentButton = styled(Button)`
    float: right;
    margin-top: 12px;
    :disabled {
        margin-top: 12px;
    }
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
    const [editComment, setEditComment] = useState(false);
    const commentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!task) return;
        setComment(task.commentAsHtml);
    }, [task]);

    useEffect(() => console.log(comment), [comment]);

    const saveComment = async () => {
        setPutCommentStatus(AsyncStatus.LOADING);
        const dto: TaskCommentDto = {
            TaskId: parseInt(params.taskId),
            CommentAsHtml: commentRef.current
                ? commentRef.current.innerHTML
                : '',
        };
        try {
            await api.putTaskComment(params.plant, dto);
            setPutCommentStatus(AsyncStatus.SUCCESS);
            setSnackbarText('Comment successfully saved.');
            setEditComment(false);
        } catch {
            setPutCommentStatus(AsyncStatus.ERROR);
            setSnackbarText('Unable to save comment.');
        }
    };

    const handleCommentClick = () => {
        if (editComment) {
            saveComment();
        } else {
            setEditComment(true);
            //Ensure focus occurs after comment div is made editable
            setTimeout(() => commentRef.current?.focus(), 100);
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
                    <Divider />
                    <div>
                        <label>Comment:</label>
                        <CommentField
                            editable={editComment}
                            contentEditable={editComment}
                            ref={commentRef}
                            dangerouslySetInnerHTML={{
                                __html: task.commentAsHtml,
                            }}
                        ></CommentField>

                        <CommentButton
                            disabled={
                                isSigned ||
                                putCommentStatus === AsyncStatus.LOADING
                            }
                            onClick={handleCommentClick}
                        >
                            {editComment ? 'Save comment' : 'Edit comment'}
                        </CommentButton>
                    </div>
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
                        <h3>Task {task ? `${task.number}` : null}</h3>
                    </CardHeaderTitle>
                    {/* <EdsIcon name="paste" /> */}
                </CardHeader>
                <div>{content()}</div>
            </Card>
        </TaskCardWrapper>
    );
};

export default TaskDescription;
