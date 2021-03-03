import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Navbar from '../../components/navigation/Navbar';
import { removeSubdirectories } from '../../utils/general';
import useCommonHooks from '../../utils/useCommonHooks';
import TaskDescription from './TaskDescription';
import TaskParameters from './TaskParameters/TaskParameters';
import TaskSignature from './TaskSignature';
import {
    Attachment,
    Task as TaskType,
    TaskParameter,
} from '../../services/apiTypes';
import { AsyncStatus } from '../../contexts/CommAppContext';
import { Snackbar } from '@equinor/eds-core-react';
import TaskAttachments from './TaskAttachments';
import { IsSignedBanner } from '../Checklist/Checklist';
import EdsIcon from '../../components/icons/EdsIcon';
import ProcosysCard from '../../components/ProcosysCard';

const TaskWrapper = styled.main`
    padding: 16px 4%;
`;

const Task = () => {
    const { url, api, params } = useCommonHooks();
    const [task, setTask] = useState<TaskType>();
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [parameters, setParameters] = useState<TaskParameter[]>([]);
    const [fetchTaskStatus, setFetchTaskStatus] = useState(AsyncStatus.LOADING);
    const [fetchAttachmentsStatus, setFetchAttachmentsStatus] = useState(
        AsyncStatus.LOADING
    );
    const [fetchParametersStatus, setFetchParametersStatus] = useState(
        AsyncStatus.LOADING
    );
    const [isSigned, setIsSigned] = useState(true);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarText, setSnackbarText] = useState('');
    const [refreshTask, setRefreshTask] = useState(false);

    useEffect(() => {
        if (snackbarText.length < 1) return;
        setShowSnackbar(true);
    }, [snackbarText]);

    useEffect(() => {
        (async () => {
            try {
                const taskFromApi = await api.getTask(
                    params.plant,
                    params.taskId
                );
                setTask(taskFromApi);
                setFetchTaskStatus(AsyncStatus.SUCCESS);
                setIsSigned(!!taskFromApi.signedByUser);
            } catch {
                setFetchTaskStatus(AsyncStatus.ERROR);
            }
        })();
    }, [api, params.plant, params.taskId, refreshTask]);

    useEffect(() => {
        (async () => {
            try {
                const attachmentsFromApi = await api.getTaskAttachments(
                    params.plant,
                    params.taskId
                );
                if (attachmentsFromApi.length > 0) {
                    setFetchAttachmentsStatus(AsyncStatus.SUCCESS);
                    setAttachments(attachmentsFromApi);
                } else {
                    setFetchAttachmentsStatus(AsyncStatus.EMPTY_RESPONSE);
                }
            } catch {
                setFetchAttachmentsStatus(AsyncStatus.ERROR);
            }
        })();
    }, [api, params.plant, params.taskId]);

    useEffect(() => {
        (async () => {
            try {
                const parametersFromApi = await api.getTaskParameters(
                    params.plant,
                    params.taskId
                );
                if (parametersFromApi.length > 0) {
                    setParameters(parametersFromApi);
                    setFetchParametersStatus(AsyncStatus.SUCCESS);
                } else {
                    setFetchParametersStatus(AsyncStatus.EMPTY_RESPONSE);
                }
            } catch {
                setFetchParametersStatus(AsyncStatus.ERROR);
            }
        })();
    }, [api, params.taskId, params.plant]);

    return (
        <>
            <Snackbar
                autoHideDuration={3000}
                onClose={() => {
                    setShowSnackbar(false);
                    setSnackbarText('');
                }}
                open={showSnackbar}
            >
                {snackbarText}
            </Snackbar>
            <Navbar
                noBorder
                leftContent={{
                    name: 'back',
                    label: 'Tasks',
                    url: removeSubdirectories(url, 1),
                }}
            />
            {isSigned ? (
                <IsSignedBanner>
                    <EdsIcon name="info_circle" />
                    <p>This task is signed. Unsign to make changes.</p>
                </IsSignedBanner>
            ) : null}
            <TaskWrapper>
                <ProcosysCard
                    cardTitle={task ? `Task ${task.number}` : `Task`}
                    errorMessage={'Unable to load task description.'}
                    fetchStatus={fetchTaskStatus}
                >
                    <TaskDescription
                        task={task}
                        isSigned={isSigned}
                        setSnackbarText={setSnackbarText}
                    />
                </ProcosysCard>

                <ProcosysCard
                    fetchStatus={fetchAttachmentsStatus}
                    errorMessage={
                        'Unable to load attachments. Please refresh or try again later.'
                    }
                    emptyContentMessage={'This task has no attachments.'}
                    cardTitle={'Attachments'}
                >
                    <TaskAttachments
                        setSnackbarText={setSnackbarText}
                        attachments={attachments}
                    />
                </ProcosysCard>

                <ProcosysCard
                    fetchStatus={fetchParametersStatus}
                    errorMessage={
                        'Unable to load parameters. Please refresh or try again later.'
                    }
                    emptyContentMessage={'This task has no parameters'}
                    cardTitle={'Parameters'}
                >
                    <TaskParameters
                        setSnackbarText={setSnackbarText}
                        isSigned={isSigned}
                        parameters={parameters}
                    />
                </ProcosysCard>

                <ProcosysCard
                    errorMessage={'Unable to load task signature.'}
                    fetchStatus={fetchTaskStatus}
                    cardTitle={'Signature'}
                >
                    <TaskSignature
                        fetchTaskStatus={fetchTaskStatus}
                        isSigned={isSigned}
                        task={task}
                        setIsSigned={setIsSigned}
                        setSnackbarText={setSnackbarText}
                        refreshTask={setRefreshTask}
                    />
                </ProcosysCard>
            </TaskWrapper>
        </>
    );
};

export default Task;
