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
    CompletionStatus,
    Task as TaskType,
    TaskParameter,
    TaskPreview,
} from '../../services/apiTypes';
import { AsyncStatus } from '../../contexts/CommAppContext';
import TaskAttachments from './TaskAttachments';
import { IsSignedBanner } from '../Checklist/Checklist';
import EdsIcon from '../../components/icons/EdsIcon';
import AsyncCard from '../../components/AsyncCard';
import useSnackbar from '../../utils/useSnackbar';
import { TaskPreviewButton } from '../CommPkg/Tasks/Tasks';
import CompletionStatusIcon from '../../components/icons/CompletionStatusIcon';
import { Typography } from '@equinor/eds-core-react';

const NextTaskButton = styled(TaskPreviewButton)`
    padding: 0;
    margin: 0;
    & > div {
        margin: 0;
    }
`;

const TaskWrapper = styled.main`
    padding: 16px 4%;
`;

const findNextTask = (
    tasks: TaskPreview[],
    currentTaskId: string
): TaskPreview | null => {
    const indexOfCurrentTask = tasks.findIndex(
        (task) => task.id === parseInt(currentTaskId)
    );
    if (indexOfCurrentTask < 0) return null;
    const nextTask = tasks[indexOfCurrentTask + 1];
    if (nextTask) return nextTask;
    return null;
};

const Task = () => {
    const { url, api, params } = useCommonHooks();
    const [task, setTask] = useState<TaskType>();
    const [nextTask, setNextTask] = useState<TaskPreview | null>(null);
    const [fetchNextTaskStatus, setFetchNextTaskStatus] = useState(
        AsyncStatus.LOADING
    );
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
    const [refreshTask, setRefreshTask] = useState(false);
    const { snackbar, setSnackbarText } = useSnackbar();

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

    useEffect(() => {
        (async () => {
            try {
                const tasksFromApi = await api.getTasks(
                    params.plant,
                    params.commPkg
                );
                if (tasksFromApi.length < 1) {
                    setNextTask(null);
                } else {
                    setNextTask(findNextTask(tasksFromApi, params.taskId));
                }
                setFetchNextTaskStatus(AsyncStatus.SUCCESS);
            } catch {
                setFetchNextTaskStatus(AsyncStatus.ERROR);
            }
        })();
    }, [api, params.taskId, params.plant, params.commPkg]);

    return (
        <>
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
                <AsyncCard
                    cardTitle={task ? `Task ${task.number}` : `Task`}
                    errorMessage={'Unable to load task description.'}
                    fetchStatus={fetchTaskStatus}
                >
                    <TaskDescription
                        task={task}
                        isSigned={isSigned}
                        setSnackbarText={setSnackbarText}
                    />
                </AsyncCard>
                <AsyncCard
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
                </AsyncCard>

                {fetchAttachmentsStatus !== AsyncStatus.EMPTY_RESPONSE ? (
                    <AsyncCard
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
                    </AsyncCard>
                ) : null}

                {fetchParametersStatus !== AsyncStatus.EMPTY_RESPONSE ? (
                    <AsyncCard
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
                    </AsyncCard>
                ) : null}

                <AsyncCard
                    cardTitle={'Next task'}
                    fetchStatus={fetchNextTaskStatus}
                    errorMessage={
                        'Unable to retrieve next task. Please go back to task list.'
                    }
                >
                    {nextTask ? (
                        <NextTaskButton
                            to={`${removeSubdirectories(url, 1)}/${
                                nextTask.id
                            }`}
                        >
                            <div>
                                <label>{nextTask.number}</label>
                                <Typography variant="body_short" lines={3}>
                                    {nextTask.title}
                                </Typography>
                            </div>
                            <EdsIcon name="arrow_forward" />
                        </NextTaskButton>
                    ) : (
                        <p>This is the last task in the list.</p>
                    )}
                </AsyncCard>
            </TaskWrapper>
            {snackbar}
        </>
    );
};

export default Task;
