import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Navbar from '../../components/navigation/Navbar';
import { removeSubdirectories } from '../../utils/general';
import useCommonHooks from '../../utils/useCommonHooks';
import TaskDescription from './TaskDescription';
import TaskParameters from './TaskParameters/TaskParameters';
import TaskSignature from './TaskSignature';
import { Task as TaskType } from '../../services/apiTypes';
import { AsyncStatus } from '../../contexts/CommAppContext';
import { Snackbar } from '@equinor/eds-core-react';

const TaskWrapper = styled.main`
    padding: 16px 4%;
`;

const Task = () => {
    const { url, api, params } = useCommonHooks();
    const [task, setTask] = useState<TaskType>();
    const [fetchTaskStatus, setFetchTaskStatus] = useState(AsyncStatus.LOADING);
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
                    url: removeSubdirectories(url, 2),
                }}
            />
            <TaskWrapper>
                <TaskDescription
                    task={task}
                    fetchTaskStatus={fetchTaskStatus}
                    isSigned={isSigned}
                    setSnackbarText={setSnackbarText}
                />
                <TaskParameters
                    setSnackbarText={setSnackbarText}
                    isSigned={isSigned}
                />
                <TaskSignature
                    fetchTaskStatus={fetchTaskStatus}
                    isSigned={isSigned}
                    task={task}
                    setIsSigned={setIsSigned}
                    setSnackbarText={setSnackbarText}
                    refreshTask={setRefreshTask}
                />
            </TaskWrapper>
        </>
    );
};

export default Task;
