import { Button } from '@equinor/eds-core-react';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { AsyncStatus } from '../../contexts/CommAppContext';
import { Task } from '../../typings/apiTypes';
import useCommonHooks from '../../utils/useCommonHooks';

const TaskSignatureWrapper = styled.div`
    overflow: hidden;
    & button,
    button:disabled {
        float: right;
        margin-top: 12px;
    }
`;

const ButtonWrapper = styled.div`
    display: flex;
    margin-bottom: 12px;
    justify-content: flex-end;
    & button,
    button:disabled {
        margin-left: 12px;
    }
`;

type TaskSignatureProps = {
    isSigned: boolean;
    setIsSigned: React.Dispatch<React.SetStateAction<boolean>>;
    isVerified: boolean;
    setIsVerified: React.Dispatch<React.SetStateAction<boolean>>;
    setSnackbarText: React.Dispatch<React.SetStateAction<string>>;
    task: Task;
    fetchTaskStatus: AsyncStatus;
    refreshTask: React.Dispatch<React.SetStateAction<boolean>>;
};

const TaskSignature = ({
    isSigned,
    setIsSigned,
    isVerified,
    setIsVerified,
    task,
    setSnackbarText,
    refreshTask,
}: TaskSignatureProps): JSX.Element => {
    const { api, params } = useCommonHooks();
    const [taskSignStatus, setTaskSignStatus] = useState<AsyncStatus>(
        AsyncStatus.INACTIVE
    );
    const [taskVerifyStatus, setTaskVerifyStatus] = useState<AsyncStatus>(
        AsyncStatus.INACTIVE
    );
    const cancelTokenSource = Axios.CancelToken.source();

    const handleSign = async (): Promise<void> => {
        setTaskSignStatus(AsyncStatus.LOADING);
        try {
            if (isSigned) {
                await api.postTaskUnsign(
                    cancelTokenSource.token,
                    params.plant,
                    params.taskId
                );
                setIsSigned(false);
                setSnackbarText('Task successfully unsigned');
            } else {
                await api.postTaskSign(
                    cancelTokenSource.token,
                    params.plant,
                    params.taskId
                );
                setIsSigned(true);
                setSnackbarText('Task successfully signed');
            }
            refreshTask((prev) => !prev);
            setTaskSignStatus(AsyncStatus.SUCCESS);
        } catch (error) {
            if (!(error instanceof Error)) return;
            setTaskSignStatus(AsyncStatus.ERROR);
            setSnackbarText(error.toString());
        }
    };

    const handleVerify = async (): Promise<void> => {
        setTaskVerifyStatus(AsyncStatus.LOADING);
        try {
            if (isVerified) {
                await api.postTaskUnverify(
                    cancelTokenSource.token,
                    params.plant,
                    params.taskId
                );
                setIsVerified(false);
                setSnackbarText('Task successfully unverified');
            } else {
                await api.postTaskVerify(
                    cancelTokenSource.token,
                    params.plant,
                    params.taskId
                );
                setIsVerified(true);
                setSnackbarText('Task successfully verified');
            }
            refreshTask((prev) => !prev);
            setTaskVerifyStatus(AsyncStatus.SUCCESS);
        } catch (error) {
            if (!(error instanceof Error)) return;
            setTaskVerifyStatus(AsyncStatus.ERROR);
            setSnackbarText(error.toString());
        }
    };

    useEffect(() => {
        return (): void => {
            cancelTokenSource.cancel();
        };
    }, []);

    return (
        <TaskSignatureWrapper>
            {task.signedAt ? (
                <>
                    <p>{`Signed at ${new Date(task.signedAt).toLocaleDateString(
                        'en-GB'
                    )} by ${task.signedByFirstName} ${task.signedByLastName} (${
                        task.signedByUser
                    })`}</p>
                </>
            ) : (
                <>
                    <p>This task is not signed.</p>
                </>
            )}

            {task.verifiedAt ? (
                <>
                    <p>{`Verified at ${new Date(
                        task.verifiedAt
                    ).toLocaleDateString('en-GB')} by ${
                        task.verifiedByFirstName
                    } ${task.verifiedByLastName} (${task.verifiedByUser})`}</p>
                </>
            ) : task.signedAt ? (
                <>
                    <p>This task is not verified.</p>
                </>
            ) : null}

            <ButtonWrapper>
                {isVerified ? null : (
                    <Button
                        disabled={taskSignStatus === AsyncStatus.LOADING}
                        onClick={handleSign}
                    >
                        {isSigned ? 'Unsign' : 'Sign'}
                    </Button>
                )}
                {isSigned ? (
                    <Button
                        disabled={taskVerifyStatus === AsyncStatus.LOADING}
                        onClick={handleVerify}
                    >
                        {isVerified ? 'Unverify' : 'Verify'}
                    </Button>
                ) : null}
            </ButtonWrapper>
        </TaskSignatureWrapper>
    );
};

export default TaskSignature;
