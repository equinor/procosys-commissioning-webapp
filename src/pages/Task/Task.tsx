import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import useCommonHooks from '../../utils/useCommonHooks';
import TaskDescription from './TaskDescription';
import TaskParameters from './TaskParameters/TaskParameters';
import TaskSignature from './TaskSignature';
import Attachment, { AttachmentsWrapper } from '../../components/Attachment';
import {
    Task as TaskType,
    TaskParameter,
    TaskPreview,
    Attachment as IAttachment,
} from '../../typings/apiTypes';
import { AsyncStatus } from '../../contexts/CommAppContext';
import EdsIcon from '../../components/icons/EdsIcon';
import AsyncCard from '../../components/AsyncCard';
import useSnackbar from '../../utils/useSnackbar';
import { Banner, Typography } from '@equinor/eds-core-react';
import Axios, { CancelToken } from 'axios';
import {
    BackButton,
    Navbar,
    removeSubdirectories,
} from '@equinor/procosys-webapp-components';
import { TaskPreviewButton } from '../EntityPage/Tasks/Tasks';

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

const Task = (): JSX.Element => {
    const { url, api, params } = useCommonHooks();
    const [attachments, setAttachments] = useState<IAttachment[]>();
    const [parameters, setParameters] = useState<TaskParameter[]>();
    const [task, setTask] = useState<TaskType>();
    const [nextTask, setNextTask] = useState<TaskPreview | null>(null);
    const [fetchNextTaskStatus, setFetchNextTaskStatus] = useState(
        AsyncStatus.LOADING
    );
    const [fetchTaskStatus, setFetchTaskStatus] = useState(AsyncStatus.LOADING);
    const [fetchAttachmentsStatus, setFetchAttachmentsStatus] =
        useState<AsyncStatus>(AsyncStatus.LOADING);
    const [fetchParametersStatus, setFetchParametersStatus] =
        useState<AsyncStatus>(AsyncStatus.LOADING);
    const [isSigned, setIsSigned] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [refreshTask, setRefreshTask] = useState(false);
    const { snackbar, setSnackbarText } = useSnackbar();
    const source = Axios.CancelToken.source();

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const [taskFromApi, attachmentsFromApi, parametersFromApi] =
                    await Promise.all([
                        api.getTask(source.token, params.plant, params.taskId),
                        api.getTaskAttachments(
                            source.token,
                            params.plant,
                            params.taskId
                        ),
                        api.getTaskParameters(
                            source.token,
                            params.plant,
                            params.taskId
                        ),
                    ]);
                setTask(taskFromApi);
                setFetchTaskStatus(AsyncStatus.SUCCESS);
                setAttachments(attachmentsFromApi);
                attachmentsFromApi.length > 0
                    ? setFetchAttachmentsStatus(AsyncStatus.SUCCESS)
                    : setFetchAttachmentsStatus(AsyncStatus.EMPTY_RESPONSE);
                setParameters(parametersFromApi);
                parametersFromApi.length > 0
                    ? setFetchParametersStatus(AsyncStatus.SUCCESS)
                    : setFetchParametersStatus(AsyncStatus.EMPTY_RESPONSE);
                setIsSigned(!!taskFromApi.signedByUser);
                setIsVerified(!!taskFromApi.verifiedByUser);
            } catch (error) {
                if (!Axios.isCancel(error)) {
                    setFetchTaskStatus(AsyncStatus.ERROR);
                    setFetchAttachmentsStatus(AsyncStatus.ERROR);
                    setFetchParametersStatus(AsyncStatus.ERROR);
                    setSnackbarText('Unable to load task');
                }
            }
        })();
        return (): void => {
            source.cancel();
        };
    }, [api, params.plant, params.taskId, refreshTask]);

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const tasksFromApi = await api.getTasks(
                    params.plant,
                    params.entityId,
                    source.token
                );
                if (tasksFromApi.length < 1) {
                    setNextTask(null);
                } else {
                    setNextTask(findNextTask(tasksFromApi, params.taskId));
                }
                setFetchNextTaskStatus(AsyncStatus.SUCCESS);
            } catch (error) {
                if (!Axios.isCancel(error)) {
                    setFetchNextTaskStatus(AsyncStatus.ERROR);
                    setSnackbarText('Unable to load next task.');
                }
            }
        })();
        return (): void => {
            source.cancel();
        };
    }, [api, params.taskId, params.plant, params.entityId]);

    return (
        <>
            <Navbar noBorder leftContent={<BackButton />} />
            {isSigned && !isVerified ? (
                <Banner>
                    <Banner.Icon variant={'info'}>
                        <EdsIcon name={'info_circle'} />
                    </Banner.Icon>
                    <Banner.Message>
                        This task is signed. Unsign to make changes.
                    </Banner.Message>
                </Banner>
            ) : null}
            {isVerified ? (
                <Banner>
                    <Banner.Icon variant={'info'}>
                        <EdsIcon name={'info_circle'} />
                    </Banner.Icon>
                    <Banner.Message>
                        This task is verified. Unverify to make changes.
                    </Banner.Message>
                </Banner>
            ) : null}

            <TaskWrapper>
                <AsyncCard
                    cardTitle={task ? `Task ${task.number}` : 'Task'}
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
                    {task ? (
                        <TaskSignature
                            fetchTaskStatus={fetchTaskStatus}
                            isSigned={isSigned}
                            isVerified={isVerified}
                            task={task}
                            setIsSigned={setIsSigned}
                            setIsVerified={setIsVerified}
                            setSnackbarText={setSnackbarText}
                            refreshTask={setRefreshTask}
                        />
                    ) : (
                        <></>
                    )}
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
                        <AttachmentsWrapper>
                            {attachments?.map((attachment) => (
                                <Attachment
                                    setSnackbarText={setSnackbarText}
                                    attachment={attachment}
                                    key={attachment.id}
                                    getAttachment={(
                                        cancelToken: CancelToken
                                    ): Promise<Blob> =>
                                        api.getTaskAttachment(
                                            cancelToken,
                                            params.plant,
                                            params.taskId,
                                            attachment.id
                                        )
                                    }
                                />
                            ))}
                        </AttachmentsWrapper>
                    </AsyncCard>
                ) : null}

                {fetchParametersStatus !== AsyncStatus.EMPTY_RESPONSE &&
                parameters ? (
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
