import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Navbar from '../../components/navigation/Navbar';
import { removeSubdirectories } from '../../utils/general';
import useCommonHooks from '../../utils/useCommonHooks';
import TaskDescription from './TaskDescription';
import TaskParameters from './TaskParameters';
import TaskSignature from './TaskSignature';
import { Task as TaskType } from '../../services/apiTypes';
import { AsyncStatus } from '../../contexts/CommAppContext';

const TaskWrapper = styled.main`
    padding: 16px 4%;
    background-color: #ebebeb;
`;

const Task = () => {
    const { url, api, params } = useCommonHooks();
    const [task, setTask] = useState<TaskType>();
    const [fetchTaskStatus, setFetchTaskStatus] = useState(AsyncStatus.LOADING);
    const [isSigned, setIsSigned] = useState(true);

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
    }, [api, params.plant, params.taskId]);

    return (
        <>
            <Navbar
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
                />
                <TaskSignature
                    fetchTaskStatus={fetchTaskStatus}
                    isSigned={isSigned}
                    task={task}
                    setIsSigned={setIsSigned}
                />
            </TaskWrapper>
        </>
    );
};

export default Task;
