import { Button, Divider } from '@equinor/eds-core-react';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { AsyncStatus } from '../../contexts/CommAppContext';
import { Task } from '../../services/apiTypes';
import { COLORS } from '../../style/GlobalStyles';
import useCommonHooks from '../../utils/useCommonHooks';

const CommentField = styled.div<{ editable: boolean }>`
    background-color: ${COLORS.lightGrey};
    padding: 12px;
    font-family: 'Equinor';
    min-height: 80px;
    border-bottom: ${(props) =>
        props.editable ? `1px solid ${COLORS.black}` : 'none'};
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
    setSnackbarText: React.Dispatch<React.SetStateAction<string>>;
};

const TaskDescription = ({
    task,
    isSigned,
    setSnackbarText,
}: TaskDescriptionProps) => {
    const { api, params } = useCommonHooks();
    const [putCommentStatus, setPutCommentStatus] = useState(
        AsyncStatus.INACTIVE
    );
    const [editComment, setEditComment] = useState(false);
    const commentRef = useRef<HTMLDivElement>(null);

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
        } catch (error) {
            setPutCommentStatus(AsyncStatus.ERROR);
            setSnackbarText(error.toString());
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

    if (task) {
        return (
            <>
                <h5>{task.title}</h5>
                <div
                    dangerouslySetInnerHTML={{
                        __html: `<p>${task.descriptionAsHtml}</p>`,
                    }}
                ></div>
                <Divider variant="medium" />
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
                            isSigned || putCommentStatus === AsyncStatus.LOADING
                        }
                        onClick={handleCommentClick}
                    >
                        {editComment ? 'Save comment' : 'Edit comment'}
                    </CommentButton>
                </div>
            </>
        );
    } else {
        return <></>;
    }
};

export default TaskDescription;
