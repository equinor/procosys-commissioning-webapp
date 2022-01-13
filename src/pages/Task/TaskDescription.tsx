import { Divider } from '@equinor/eds-core-react';
import Axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
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
    border-bottom: ${(props): string =>
        props.editable ? `1px solid ${COLORS.black}` : 'none'};
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
}: TaskDescriptionProps): JSX.Element => {
    const { api, params } = useCommonHooks();
    const [putCommentStatus, setPutCommentStatus] = useState(
        AsyncStatus.INACTIVE
    );

    const [canEditComment, setCanEditComment] = useState<boolean>(false);
    const commentRef = useRef<HTMLDivElement>(null);
    const cancelTokenSource = Axios.CancelToken.source();

    useEffect(() => {
        if (isSigned || putCommentStatus === AsyncStatus.LOADING) {
            setCanEditComment(false);
        } else {
            setCanEditComment(true);
        }
        return (): void => {
            cancelTokenSource.cancel();
        };
    }, [isSigned]);

    const saveComment = async (): Promise<void> => {
        setPutCommentStatus(AsyncStatus.LOADING);
        const dto: TaskCommentDto = {
            TaskId: parseInt(params.taskId),
            CommentAsHtml: commentRef.current
                ? commentRef.current.innerHTML
                : '',
        };
        try {
            await api.putTaskComment(
                cancelTokenSource.token,
                params.plant,
                dto
            );
            setPutCommentStatus(AsyncStatus.SUCCESS);
            setSnackbarText('Comment successfully saved.');
        } catch (error) {
            if (!(error instanceof Error)) return;
            if (!Axios.isCancel(error)) {
                setPutCommentStatus(AsyncStatus.ERROR);
                setSnackbarText(error.toString());
            }
        }
    };

    if (task) {
        return (
            <>
                <h5>{task.title}</h5>

                {task.descriptionAsHtml ? (
                    <div
                        dangerouslySetInnerHTML={{
                            __html: `<p>${task.descriptionAsHtml}</p>`,
                        }}
                    />
                ) : null}

                <Divider variant="medium" />
                <div>
                    <label>Comment:</label>
                    <CommentField
                        role="textbox"
                        aria-readonly={canEditComment}
                        editable={canEditComment}
                        contentEditable={canEditComment}
                        ref={commentRef}
                        dangerouslySetInnerHTML={{
                            __html: task.commentAsHtml,
                        }}
                        onBlur={saveComment}
                    />
                </div>
            </>
        );
    } else {
        return <></>;
    }
};

export default TaskDescription;
