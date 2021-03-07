import { Button } from '@equinor/eds-core-react';
import React, { useState } from 'react';
import { AsyncStatus } from '../../contexts/CommAppContext';
import { Task } from '../../services/apiTypes';
import useCommonHooks from '../../utils/useCommonHooks';

type TaskSignatureProps = {
    isSigned: boolean;
    setIsSigned: React.Dispatch<React.SetStateAction<boolean>>;
    setSnackbarText: React.Dispatch<React.SetStateAction<string>>;
    task: Task | undefined;
    fetchTaskStatus: AsyncStatus;
    refreshTask: React.Dispatch<React.SetStateAction<boolean>>;
};

const TaskSignature = ({
    isSigned,
    setIsSigned,
    task,
    setSnackbarText,
    refreshTask,
}: TaskSignatureProps) => {
    const { api, params } = useCommonHooks();
    const [taskSignStatus, setTaskSignStatus] = useState(AsyncStatus.INACTIVE);

    const handleSign = async () => {
        setTaskSignStatus(AsyncStatus.LOADING);
        try {
            if (isSigned) {
                await api.postTaskUnsign(params.plant, params.taskId);
                setIsSigned(false);
                setSnackbarText('Task successfully unsigned');
            } else {
                await api.postTaskSign(params.plant, params.taskId);
                setIsSigned(true);
                setSnackbarText('Task successfully signed');
            }
            refreshTask((prev) => !prev);
            setTaskSignStatus(AsyncStatus.SUCCESS);
        } catch {
            setTaskSignStatus(AsyncStatus.ERROR);
            setSnackbarText('Sign/unsign action failed');
        }
    };

    if (task) {
        return (
            <>
                {task.signedAt ? (
                    <>
                        <p>{`Signed at ${new Date(
                            task.signedAt
                        ).toLocaleDateString('en-GB')} by ${
                            task.signedByFirstName
                        } ${task.signedByLastName} (${task.signedByUser})`}</p>
                    </>
                ) : (
                    <>
                        <p>This task is not signed.</p>
                    </>
                )}
                <Button
                    disabled={taskSignStatus === AsyncStatus.LOADING}
                    onClick={handleSign}
                >
                    {isSigned ? 'Unsign' : 'Sign'}
                </Button>
            </>
        );
    } else {
        return <></>;
    }
};

export default TaskSignature;
